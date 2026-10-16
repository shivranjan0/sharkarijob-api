/**
 * Restore real publication dates, and stop marking closed jobs as live.
 *
 * Two problems, both from the import:
 *
 * 1. Every post's created_at is the date the scraper ran (Jul-Sep 2026), not
 *    the date the notification was published. Listings order by created_at,
 *    so the site shows posts in essentially the order they were imported.
 *    The real dates survive inside the body:
 *
 *      <time class="entry-date published" datetime="2026-07-23T16:57:09+05:30">
 *
 *    649 of 714 posts carry one, spanning 2018 to July 2026.
 *
 * 2. is_live is 1 on all 714 posts, so the LIVE badge appears on everything
 *    and means nothing. It should mark jobs still open for application.
 *
 *   node fix-post-dates.mjs            # dry run
 *   node fix-post-dates.mjs --apply
 *   node fix-post-dates.mjs --local
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

const TIME_RE = /<time[^>]*class="[^"]*entry-date[^"]*"[^>]*datetime="([^"]+)"/i

/** MySQL DATETIME in the server's terms; the source carries +05:30 offsets. */
function toMysqlDateTime(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  // Treat the instant as IST, which is what the source site published in.
  const ist = new Date(d.getTime() + 5.5 * 3600 * 1000)
  return ist.toISOString().slice(0, 19).replace('T', ' ')
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

const [posts] = await conn.query(
  'SELECT id, title, created_at, application_end_date, content FROM posts ORDER BY id'
)

let dated = 0
let noDate = 0
const samples = []

for (const post of posts) {
  const match = String(post.content ?? '').match(TIME_RE)
  if (!match) {
    noDate++
    continue
  }

  const when = toMysqlDateTime(match[1])
  if (!when) {
    noDate++
    continue
  }

  dated++
  if (samples.length < 6) {
    samples.push({
      id: post.id,
      title: String(post.title ?? '').slice(0, 42),
      from: String(post.created_at).slice(0, 10),
      to: when.slice(0, 10),
    })
  }

  if (apply) {
    // updated_at is left alone: it records when we last edited the row, and
    // the cleanup scripts already moved it to today.
    await conn.query('UPDATE posts SET created_at = ? WHERE id = ?', [when, post.id])
  }
}

console.log('--- publication dates ---')
console.log(`  recovered from body : ${dated}`)
console.log(`  no date in body     : ${noDate}  (created_at left as-is)`)
console.log('\n  examples:')
for (const s of samples) {
  console.log(`    post ${String(s.id).padEnd(5)} ${s.from} -> ${s.to}   ${s.title}`)
}

// --- is_live ---------------------------------------------------------
// Open for application = a deadline that has not passed. A post with no
// deadline recorded cannot be verified as open, so it is not marked live;
// an expired badge is worse than none on a jobs site.
const [[liveNow]] = await conn.query('SELECT COUNT(*) n FROM posts WHERE is_live = 1')
const [[shouldBeLive]] = await conn.query(
  'SELECT COUNT(*) n FROM posts WHERE application_end_date IS NOT NULL AND application_end_date >= CURDATE()'
)

console.log('\n--- live flag ---')
console.log(`  is_live = 1 now      : ${liveNow.n}  (every post)`)
console.log(`  genuinely open       : ${shouldBeLive.n}  (deadline still ahead)`)
console.log(`  would be cleared     : ${liveNow.n - shouldBeLive.n}`)

if (apply) {
  await conn.query(
    'UPDATE posts SET is_live = (application_end_date IS NOT NULL AND application_end_date >= CURDATE())'
  )
  const [[after]] = await conn.query('SELECT COUNT(*) n FROM posts WHERE is_live = 1')
  console.log(`  is_live = 1 after    : ${after.n}`)
}

if (!apply) console.log('\nRe-run with --apply to write them.')

await conn.end()
