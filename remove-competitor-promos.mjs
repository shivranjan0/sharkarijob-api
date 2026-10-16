/**
 * Final pass: the competitor's own promotional blocks.
 *
 * What the link/brand sweep could not catch, because none of it names their
 * domain:
 *
 *   - a Play Store button for their Android app (com.vinod.sarkarinaukri),
 *     wrapped in its own centred <div> (30 posts)
 *   - <div class="social-buttons"> holding their WhatsApp and Telegram
 *     channel links (88 posts) -- the CSS for this is the block that was
 *     leaking onto the page as text earlier
 *   - their WhatsApp channel linked from inside content tables, labelled
 *     things like "Will Receive Via Email" (32 posts). The cell text is real,
 *     so the link is removed and the words stay.
 *   - "made by sarkariresult team" in the disclaimer (30 posts)
 *
 *   node remove-competitor-promos.mjs            # dry run
 *   node remove-competitor-promos.mjs --apply
 *   node remove-competitor-promos.mjs --local
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

const stats = {
  'app promo blocks': 0,
  'social-button blocks': 0,
  'channel links unlinked': 0,
  'team credit rewritten': 0,
}

function clean(html) {
  let out = html

  // The centred div that holds only the app button.
  out = out.replace(
    /<div[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>\s*<a\b[^>]*play\.google\.com[^>]*>[\s\S]*?<\/a>\s*<\/div>/gi,
    () => {
      stats['app promo blocks']++
      return ''
    }
  )
  // Any app button left outside such a wrapper.
  out = out.replace(/<a\b[^>]*play\.google\.com[^>]*>[\s\S]*?<\/a>/gi, () => {
    stats['app promo blocks']++
    return ''
  })

  // Their follow-us strip, and the stray CSS class that went with it.
  out = out.replace(/<div[^>]*class="[^"]*social-buttons[^"]*"[^>]*>[\s\S]*?<\/div>/gi, () => {
    stats['social-button blocks']++
    return ''
  })

  // Channel links inside content tables: drop the anchor, keep the words.
  out = out.replace(
    /<a\b[^>]*href="[^"]*(?:whatsapp\.com\/chan|t\.me\/|telegram\.me)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi,
    (_m, label) => {
      stats['channel links unlinked']++
      return label
    }
  )

  // The disclaimer crediting their team.
  out = out.replace(/\bby\s+sarkari\s*result\s+team\b/gi, () => {
    stats['team credit rewritten']++
    return 'by our team'
  })
  out = out.replace(/\bsarkari\s*result\s+team\b/gi, () => {
    stats['team credit rewritten']++
    return 'our team'
  })

  // Tidy up.
  out = out.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
  out = out.replace(/<div[^>]*>\s*<\/div>/gi, '')
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

let changed = 0
let textLost = 0

const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

for (const post of posts) {
  const before = String(post.content ?? '')
  const after = clean(before)
  if (before === after) continue

  changed++
  textLost += plain(before).length - plain(after).length

  if (apply) {
    await conn.query('UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?', [
      after,
      post.id,
    ])
  }
}

console.log(`Posts ${apply ? 'updated' : 'that would change'}: ${changed}\n`)
for (const [k, v] of Object.entries(stats)) if (v) console.log(`  ${String(v).padStart(4)}  ${k}`)
console.log(`\n  visible text removed: ${textLost.toLocaleString()} chars`)

const [[left]] = await conn.query(
  "SELECT COUNT(*) n FROM posts WHERE content LIKE '%sarkariresult%' OR content LIKE '%sarkarinaukri%'"
)
console.log(`  posts still referencing them: ${left.n}`)

if (!apply && changed) console.log('\nRe-run with --apply to write them.')

await conn.end()
