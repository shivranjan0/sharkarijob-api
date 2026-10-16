/**
 * Strip scraped furniture out of post bodies.
 *
 * The imported posts carry markup from the site they were scraped from:
 *
 *   - a competitor's AdSense script and <ins> slots, including their
 *     publisher id ca-pub-9762662687323163 (88 posts). It never earned them
 *     anything -- scripts injected through innerHTML do not execute -- but
 *     someone else's ad code has no business sitting in our pages.
 *   - <style> blocks (649 posts), most of them empty. The non-empty ones sit
 *     inside <p>, which is invalid, so the browser spills the CSS onto the
 *     page as visible text.
 *   - "<!-- SarkariResult -->" comments (194 posts)
 *   - whitespace-only paragraphs left behind once the above is gone
 *
 *   node clean-post-content.mjs            # dry run
 *   node clean-post-content.mjs --apply    # write the changes
 *   node clean-post-content.mjs --local    # against XAMPP instead of Aiven
 */

import mysql from 'mysql2/promise'
import readline from 'node:readline'

const apply = process.argv.includes('--apply')
const local = process.argv.includes('--local')

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.stdoutMuted = true
  rl._writeToOutput = (str) => {
    if (rl.stdoutMuted && str !== question) return
    rl.output.write(str)
  }
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      process.stdout.write('\n')
      rl.close()
      resolve(a.trim())
    })
  )
}

const RULES = [
  ['script tags', /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi],
  ['style tags', /<style\b[^>]*>[\s\S]*?<\/style\s*>/gi],
  ['adsbygoogle slots', /<ins\b[^>]*class=["'][^"']*adsbygoogle[^"']*["'][^>]*>[\s\S]*?<\/ins\s*>/gi],
  ['scraper comments', /<!--[\s\S]*?-->/g],
]

/**
 * Remove the junk, then tidy what it leaves behind. Order matters: the empty
 * paragraphs only become empty once the <style> inside them is gone.
 */
function clean(html) {
  let out = html

  for (const [, re] of RULES) out = out.replace(re, '')

  // Paragraphs holding nothing but whitespace, &nbsp; or <br>.
  out = out.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')

  // Collapse the runs of blank lines the removals leave behind.
  out = out.replace(/\n{3,}/g, '\n\n')

  return out.trim()
}

const config = local
  ? { host: '127.0.0.1', port: 3306, user: 'root', password: '', database: 'sharkari_db' }
  : {
      host: 'mysql-28beb6b4-sharkarijobsupport-c662.a.aivencloud.com',
      port: 24781,
      user: 'avnadmin',
      password: process.env.AIVEN_PASSWORD || (await ask('Aiven database password (hidden): ')),
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false },
    }

const conn = await mysql.createConnection(config)
console.log(`${apply ? 'APPLYING to' : 'DRY RUN against'} ${local ? 'local MySQL' : 'Aiven'}\n`)

const [posts] = await conn.query('SELECT id, title, content FROM posts ORDER BY id')

const totals = Object.fromEntries(RULES.map(([name]) => [name, 0]))
let changed = 0
let bytesSaved = 0
const worst = []

for (const post of posts) {
  const before = String(post.content ?? '')
  const after = clean(before)
  if (before === after) continue

  changed++
  bytesSaved += before.length - after.length
  worst.push({
    id: post.id,
    title: String(post.title ?? ''),
    before: before.length,
    after: after.length,
    pct: Math.round(((before.length - after.length) / Math.max(before.length, 1)) * 100),
  })
  for (const [name, re] of RULES) {
    totals[name] += (before.match(re) || []).length
  }

  if (apply) {
    await conn.query('UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?', [
      after,
      post.id,
    ])
  }
}

console.log(`Posts ${apply ? 'updated' : 'that would change'}: ${changed} of ${posts.length}`)
for (const [name, n] of Object.entries(totals)) {
  if (n) console.log(`  ${String(n).padStart(5)}  ${name} removed`)
}
console.log(`  ${(bytesSaved / 1024).toFixed(0)} KB of markup removed`)

// A post should never lose most of its body -- that would mean the rules are
// matching real content rather than furniture. Report the worst shrinkage so
// it can be eyeballed before anything is written.
worst.sort((a, b) => b.pct - a.pct)
console.log('')
console.log('Biggest shrinkage (check these are only losing junk):')
for (const p of worst.slice(0, 5)) {
  console.log(
    `  post ${String(p.id).padEnd(5)} ${p.before} -> ${p.after} chars (-${p.pct}%)  ` +
      p.title.slice(0, 46)
  )
}

const suspicious = worst.filter((p) => p.after < 300)
if (suspicious.length) {
  console.log(`  WARNING: ${suspicious.length} post(s) end up under 300 chars.`)
}

if (!apply && changed) console.log('\nRe-run with --apply to write them.')

await conn.end()
