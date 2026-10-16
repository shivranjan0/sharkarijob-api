/**
 * Remove UI classes that came in with pasted content.
 *
 * 147 posts carry ChatGPT's own interface markup around their Q&A:
 *
 *   <div class="flex-shrink-0 flex flex-col relative items-end">
 *     <div class="gizmo-bot-avatar flex h-8 w-8 overflow-hidden rounded-full">
 *       <ul> ...the actual questions and answers... </ul>
 *
 * Harmless as plain text, except the site is built with Tailwind, so those
 * class names are live utilities on our pages: `items-end` shoves the block
 * to the right margin and `h-8 w-8 overflow-hidden rounded-full` crushes the
 * whole answer into a 32px circle. That is the clipped text and the small
 * blue smudge at the edge of the FAQ tables.
 *
 * The wrappers are not unwrapped, only stripped of their class attributes:
 * an empty <div> changes nothing about the layout, while removing elements
 * risks taking content with them.
 *
 *   node clean-pasted-ui-classes.mjs            # dry run
 *   node clean-pasted-ui-classes.mjs --apply
 *   node clean-pasted-ui-classes.mjs --local
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

/**
 * Class names that do something on this site and have no business coming
 * from pasted content. Layout, sizing and overflow only -- the source
 * markup's own presentational classes (gb-headline and friends) are left
 * alone, because scraped.css styles them deliberately.
 */
const KILL = [
  /^gizmo[\w-]*$/,
  /^flex$/, /^inline-flex$/, /^flex-col$/, /^flex-row$/, /^flex-shrink-\d+$/, /^shrink-\d+$/,
  /^grow(-\d+)?$/, /^flex-grow(-\d+)?$/,
  /^items-(start|end|center|baseline|stretch)$/,
  /^justify-\w+$/,
  /^[wh]-\d+(\.\d+)?$/, /^[wh]-(full|screen|auto|px)$/,
  /^min-[wh]-\w+$/, /^max-[wh]-\w+$/,
  /^overflow(-[xy])?-(hidden|auto|scroll|clip)$/,
  /^rounded(-\w+)?$/,
  /^absolute$/, /^relative$/, /^fixed$/, /^sticky$/,
  /^[pm][trblxy]?-\d+(\.\d+)?$/,
  /^gap-\d+$/, /^space-[xy]-\d+$/,
  /^text-(xs|sm|base|lg|xl|\dxl)$/,
  /^bg-\w+-\d+$/, /^text-\w+-\d+$/,
]

function stripClasses(html) {
  let removed = 0

  const out = html.replace(/\sclass="([^"]*)"/gi, (whole, value) => {
    const kept = value
      .split(/\s+/)
      .filter(Boolean)
      .filter((cls) => !KILL.some((re) => re.test(cls)))

    if (kept.length === value.split(/\s+/).filter(Boolean).length) return whole

    removed++
    return kept.length ? ` class="${kept.join(' ')}"` : ''
  })

  return { html: out, removed }
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

const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

let changed = 0
let attrs = 0
let textLost = 0

for (const post of posts) {
  const before = String(post.content ?? '')
  const { html: after, removed } = stripClasses(before)
  if (before === after) continue

  changed++
  attrs += removed
  textLost += plain(before).length - plain(after).length

  if (apply) {
    await conn.query('UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?', [
      after,
      post.id,
    ])
  }
}

console.log(`Posts ${apply ? 'updated' : 'that would change'}: ${changed} of ${posts.length}`)
console.log(`  class attributes cleaned : ${attrs}`)
console.log(`  visible text removed     : ${textLost} chars  (should be 0)`)

const [[left]] = await conn.query(
  "SELECT COUNT(*) n FROM posts WHERE content LIKE '%gizmo%' OR content LIKE '%flex-shrink%'"
)
console.log(`  posts still carrying the wrapper: ${left.n}`)

if (!apply && changed) console.log('\nRe-run with --apply to write them.')

await conn.end()
