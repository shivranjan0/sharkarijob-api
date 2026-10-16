/**
 * Clean the CMS pages: the staging domain and leftover Markdown.
 *
 * The policy pages were written against the staging host and carry
 * `sharkarijob.bluraj.com` throughout, which now points nowhere. They also
 * contain Markdown links inside HTML bodies, so visitors see the raw
 * `[text](url)` brackets instead of a link.
 *
 *   node fix-page-content.mjs            # dry run -- prints the diff
 *   node fix-page-content.mjs --apply    # writes the changes
 *
 * Add --local to work against the XAMPP database instead of Aiven.
 */

import mysql from 'mysql2/promise'
import readline from 'node:readline'

const apply = process.argv.includes('--apply')
const local = process.argv.includes('--local')

const OLD_HOST = 'sharkarijob.bluraj.com'
const NEW_HOST = 'sharkarijob.online'

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

/**
 * Markdown link to an anchor. When the label is the same as the target --
 * which is how most of these were written -- the label is dropped to the bare
 * URL so the text does not read as a duplicated address.
 */
function markdownLinksToHtml(html) {
  return html.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (_match, label, href) => {
    const text = label.trim() === href.trim() ? href : label
    return `<a href="${href}">${text}</a>`
  })
}

function clean(html) {
  let out = html.split(OLD_HOST).join(NEW_HOST)
  out = markdownLinksToHtml(out)
  return out
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

const [pages] = await conn.query('SELECT id, title, slug, content FROM pages ORDER BY id')

let changed = 0
for (const page of pages) {
  const before = String(page.content ?? '')
  const after = clean(before)

  if (before === after) {
    console.log(`  unchanged  ${page.title}`)
    continue
  }

  changed++
  const hosts = (before.match(new RegExp(OLD_HOST, 'g')) || []).length
  const links = (before.match(/\[[^\]]*\]\([^)]*\)/g) || []).length
  console.log(`  CHANGE     ${page.title}  (${hosts} host refs, ${links} markdown links)`)

  // Show one example of each fix so the edit is reviewable, not blind.
  const sample = before.match(/\[[^\]]*\]\([^)\s]+\)/)
  if (sample) {
    console.log(`               was: ${sample[0].slice(0, 90)}`)
    console.log(`               now: ${clean(sample[0]).slice(0, 110)}`)
  }

  if (apply) {
    await conn.query('UPDATE pages SET content = ?, updated_at = NOW() WHERE id = ?', [
      after,
      page.id,
    ])
  }
}

console.log(`\n${changed} of ${pages.length} pages ${apply ? 'updated' : 'would change'}.`)
if (!apply && changed) console.log('Re-run with --apply to write them.')

await conn.end()
