/**
 * Second cleaning pass: junk that survives as plain text.
 *
 * The first pass removed real <script> and <style> elements. What is left was
 * already text by the time it reached the database -- the scrape lost the
 * tags but kept their contents, so the page shows:
 *
 *   .social-buttons { display: flex; gap: 10px; } .social-button { ... }
 *   (adsbygoogle = window.adsbygoogle || []).push({});
 *
 * Those read as body copy to a browser, which is why they appear mid-article.
 *
 *   node clean-post-text-junk.mjs            # dry run
 *   node clean-post-text-junk.mjs --apply
 *   node clean-post-text-junk.mjs --local
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
  // The AdSense bootstrap line, left over once its <script> was stripped.
  ['adsbygoogle push()', /\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\(\{\}\);?/g],

  // Runs of CSS rules sitting in the prose: `.foo { a: b; } .bar:hover { c: d; }`
  // Anchored on a class or id selector so ordinary prose containing a brace
  // is left alone.
  ['CSS rule blocks', /(?:[.#][A-Za-z][\w-]*(?:\s*[:,>][\s\w.#-]*)?\s*\{[^{}]*\}\s*)+/g],
]

function clean(html) {
  let out = html

  for (const [, re] of RULES) out = out.replace(re, '')

  // Paragraphs and spans left holding nothing.
  out = out.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
  out = out.replace(/<span>(?:\s|&nbsp;)*<\/span>/gi, '')
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

const totals = Object.fromEntries(RULES.map(([n]) => [n, 0]))
const worst = []
let changed = 0

for (const post of posts) {
  const before = String(post.content ?? '')
  const after = clean(before)
  if (before === after) continue

  changed++
  for (const [name, re] of RULES) totals[name] += (before.match(re) || []).length
  worst.push({
    id: post.id,
    title: String(post.title ?? ''),
    before: before.length,
    after: after.length,
    pct: Math.round(((before.length - after.length) / Math.max(before.length, 1)) * 100),
  })

  if (apply) {
    await conn.query('UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?', [
      after,
      post.id,
    ])
  }
}

worst.sort((a, b) => b.pct - a.pct)

console.log(`Posts ${apply ? 'updated' : 'that would change'}: ${changed} of ${posts.length}`)
for (const [name, n] of Object.entries(totals)) if (n) console.log(`  ${String(n).padStart(4)}  ${name}`)

console.log('\nBiggest shrinkage:')
for (const p of worst.slice(0, 5)) {
  console.log(`  post ${String(p.id).padEnd(5)} ${p.before} -> ${p.after} (-${p.pct}%)  ${p.title.slice(0, 44)}`)
}

const suspicious = worst.filter((p) => p.pct > 40)
if (suspicious.length) console.log(`\n  WARNING: ${suspicious.length} post(s) lose more than 40%.`)

if (!apply && changed) console.log('\nRe-run with --apply to write them.')

await conn.end()
