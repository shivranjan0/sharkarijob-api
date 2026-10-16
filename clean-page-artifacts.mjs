/**
 * Strip editor and AI-assistant artifacts out of the CMS pages.
 *
 * The policy pages were drafted in an AI assistant and pasted in, bringing its
 * UI along:
 *
 *   - <div class="source-inline-chip-container luminous-sources ..."> holding
 *     a "View source details" button -- a live control from another app,
 *     rendered on our page
 *   - <sup class="superscript" data-turn-source-index="N"> citation markers
 *   - <!----> Angular placeholder comments, hundreds of them
 *   - citation-NNN classes and data-path-to-node / data-index-in-node
 *     attributes left by the paste
 *
 * One page also has a tag inside an href -- `https://s</span>harkarijob...` --
 * which makes the link point nowhere.
 *
 *   node clean-page-artifacts.mjs            # dry run
 *   node clean-page-artifacts.mjs --apply
 *   node clean-page-artifacts.mjs --local
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
  // The assistant's own source widget, button and all.
  ['source chip widgets', /<div[^>]*class="[^"]*source-inline-chip[^"]*"[^>]*>[\s\S]*?<\/div>/gi],
  // Citation superscripts.
  ['citation superscripts', /<sup[^>]*class="[^"]*superscript[^"]*"[^>]*>[\s\S]*?<\/sup>/gi],
  // Angular placeholder comments.
  ['empty comments', /<!---->/g],
  // Paste bookkeeping attributes.
  ['path/index attributes', /\s+data-(?:path-to-node|index-in-node|turn-source-index)="[^"]*"/gi],
  // citation-123 / citation-end-123 class names.
  ['citation classes', /\s*\bcitation(?:-end)?-\d+\b/gi],
  // ng-star-inserted and the assistant's theme classes.
  ['framework classes', /\s*\b(?:ng-star-inserted|luminous-[\w-]+)\b/gi],
]

/**
 * A closing tag that ended up inside an href, e.g.
 *   href="https://s</span>harkarijob.online/"
 * Rejoin the URL and move the stray tag out to just before the anchor.
 */
function repairHrefs(html) {
  return html.replace(/href="([^"]*?)(<\/?[a-z][^>]*>)([^"]*?)"/gi, (_m, a, tag, b) => {
    return `href="${a}${b}"`.replace(/href="/, `${tag}href="`)
  })
}

function clean(html) {
  let out = repairHrefs(html)

  for (const [, re] of RULES) out = out.replace(re, '')

  // class="" left behind once the only classes were stripped.
  out = out.replace(/\s+class="\s*"/gi, '')

  // Elements that now hold nothing at all.
  out = out.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
  out = out.replace(/<span>\s*<\/span>/gi, '')

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

const [pages] = await conn.query('SELECT id, title, content FROM pages ORDER BY id')

const totals = Object.fromEntries(RULES.map(([n]) => [n, 0]))
let changed = 0

for (const page of pages) {
  const before = String(page.content ?? '')
  const after = clean(before)
  if (before === after) {
    console.log(`  unchanged  ${page.title}`)
    continue
  }

  changed++
  for (const [name, re] of RULES) totals[name] += (before.match(re) || []).length

  const pct = Math.round(((before.length - after.length) / before.length) * 100)
  console.log(`  CHANGE     ${String(page.title).padEnd(24)} ${before.length} -> ${after.length} (-${pct}%)`)

  if (apply) {
    await conn.query('UPDATE pages SET content = ?, updated_at = NOW() WHERE id = ?', [after, page.id])
  }
}

console.log(`\n${changed} of ${pages.length} pages ${apply ? 'updated' : 'would change'}`)
for (const [name, n] of Object.entries(totals)) if (n) console.log(`  ${String(n).padStart(4)}  ${name}`)

if (!apply && changed) console.log('\nRe-run with --apply to write them.')

await conn.end()
