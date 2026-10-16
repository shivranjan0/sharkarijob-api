/**
 * Remove every trace of the site this content was scraped from.
 *
 * 194 posts still carry sarkariresult.com.cm:
 *
 *   687 <a> links, none of them rel="nofollow", so Google reads each one as a
 *       vote for a direct competitor -- the single most costly thing left in
 *       the content.
 *    30 <img> hotlinked from their server. Served over http:// as well, so an
 *       https page blocks them anyway: they are broken and theirs.
 *   276 mentions of the brand in running text, plus their navigation menu
 *       ("Latest Posts Related Posts WhatsApp Telegram") scraped in as prose.
 *
 * Links are handled by what they say, not uniformly: an anchor labelled with
 * a real post title keeps its text and loses only the link, while "Click Here"
 * or the bare brand name goes entirely -- neither means anything once it no
 * longer points anywhere.
 *
 *   node remove-competitor-refs.mjs            # dry run
 *   node remove-competitor-refs.mjs --apply
 *   node remove-competitor-refs.mjs --local
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

const DOMAIN = /sarkariresult\s*\.?\s*com\s*\.?\s*cm/i
const ANCHOR = /<a\b[^>]*href="[^"]*sarkariresult[^"]*"[^>]*>([\s\S]*?)<\/a>/gi

/** Anchor text that carries no meaning once the link is gone. */
function isThrowawayLabel(text) {
  const plain = text.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
  if (!plain) return true
  if (DOMAIN.test(plain)) return true
  return /^(click here|read more|here|link|download|apply online|official website|more details?)\.?$/i.test(
    plain
  )
}

const stats = {
  'links removed (label was junk)': 0,
  'links unwrapped (text kept)': 0,
  'hotlinked images removed': 0,
  'navigation menu removed': 0,
  'brand mentions rewritten': 0,
}

function clean(html) {
  let out = html

  // 1. Anchors: drop or unwrap depending on the label.
  out = out.replace(ANCHOR, (_match, label) => {
    if (isThrowawayLabel(label)) {
      stats['links removed (label was junk)']++
      return ''
    }
    stats['links unwrapped (text kept)']++
    return label
  })

  // 2. Images served from their host.
  out = out.replace(/<img\b[^>]*(?:src|data-[\w-]+)="[^"]*sarkariresult[^"]*"[^>]*>/gi, () => {
    stats['hotlinked images removed']++
    return ''
  })

  // 3. Their scraped navigation strip.
  out = out.replace(
    /Sarkari\s*Result\s*\.?\s*Com\s*\.?\s*Cm[\s\S]{0,40}?Latest\s*Posts[\s\S]{0,40}?Related\s*Posts[\s\S]{0,60}?Telegram/gi,
    () => {
      stats['navigation menu removed']++
      return ''
    }
  )

  // 4. The brand in running text. Replaced rather than cut, so the sentence
  //    still reads: "available on SarkariResult.com.cm (Official ... 2009)."
  //    would otherwise become "available on .".
  const phrases = [
    [/our\s+(?:platform|site|website)\s+SarkariResult\s*\.?\s*com\s*\.?\s*cm/gi, 'our website'],
    [/SarkariResult\s*\.?\s*com\s*\.?\s*cm\s*\(\s*Official Sarkari Result Since \d{4}\s*\)/gi, 'the official website'],
    [/(?:on|our|the)\s+SarkariResult\s*\.?\s*com\s*\.?\s*cm\s+(?:site|website|platform)/gi, 'our website'],
    [/SarkariResult\s*\.?\s*com\s*\.?\s*cm/gi, 'the official website'],
    [/Sarkari\s+Result\s*\.\s*Com\s*\.\s*Cm/gi, 'the official website'],
  ]
  for (const [re, replacement] of phrases) {
    out = out.replace(re, () => {
      stats['brand mentions rewritten']++
      return replacement
    })
  }

  // 5. Anything left pointing at their host (stray attributes).
  out = out.replace(/\s*(?:href|src|data-[\w-]+)="[^"]*sarkariresult[^"]*"/gi, '')

  // 6. Tidy what the removals leave behind.
  out = out.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
  out = out.replace(/<(span|strong|em|b|i)>\s*<\/\1>/gi, '')
  out = out.replace(/<td>(?:\s|&nbsp;)*<\/td>/gi, '<td></td>')
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
const samples = []

for (const post of posts) {
  const before = String(post.content ?? '')
  if (!/sarkariresult/i.test(before)) continue

  const after = clean(before)
  if (before === after) continue

  changed++

  if (samples.length < 3) {
    const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
    const b = plain(before)
    const i = b.search(DOMAIN)
    if (i > -1) {
      samples.push({
        id: post.id,
        was: b.slice(Math.max(0, i - 60), i + 70).trim(),
        now: plain(after).slice(Math.max(0, i - 60), i + 70).trim(),
      })
    }
  }

  if (apply) {
    await conn.query('UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ?', [
      after,
      post.id,
    ])
  }
}

console.log(`Posts ${apply ? 'updated' : 'that would change'}: ${changed}\n`)
for (const [k, v] of Object.entries(stats)) if (v) console.log(`  ${String(v).padStart(4)}  ${k}`)

console.log('\nText before / after:')
for (const s of samples) {
  console.log(`\n  post ${s.id}`)
  console.log(`    was: ...${s.was}...`)
  console.log(`    now: ...${s.now}...`)
}

const [[left]] = await conn.query(
  "SELECT COUNT(*) n FROM posts WHERE content LIKE '%sarkariresult%'"
)
console.log(`\nPosts still mentioning them${apply ? '' : ' (before applying)'}: ${left.n}`)

if (!apply && changed) console.log('\nRe-run with --apply to write them.')

await conn.end()
