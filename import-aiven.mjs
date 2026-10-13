/**
 * Import the MySQL dump into Aiven using mysql2.
 *
 * The XAMPP client is MariaDB 10.4 and cannot speak MySQL 8's
 * caching_sha2_password, so the dump goes in through the Node driver the API
 * already depends on.
 *
 *   AIVEN_PASSWORD='...' node import-aiven.mjs [--verify-only]
 */

import mysql from 'mysql2/promise'
import { readFile } from 'node:fs/promises'

const HOST = 'mysql-28beb6b4-sharkarijobsupport-c662.a.aivencloud.com'
const PORT = 24781
const USER = 'avnadmin'
const DB = 'defaultdb'
const DUMP = new URL('../database/sharkari_db.sql', import.meta.url)

const password = process.env.AIVEN_PASSWORD
if (!password) {
  console.error('ERROR: set AIVEN_PASSWORD')
  process.exit(1)
}
const verifyOnly = process.argv.includes('--verify-only')

/**
 * Split a dump into statements. Semicolons inside strings, identifiers and
 * comments must not split, so this walks the text rather than using a regex.
 */
function splitStatements(sql) {
  const out = []
  let buf = ''
  let quote = null // "'", '"' or '`'
  let inLineComment = false
  let inBlockComment = false

  for (let i = 0; i < sql.length; i++) {
    const c = sql[i]
    const next = sql[i + 1]

    if (inLineComment) {
      if (c === '\n') inLineComment = false
      continue
    }
    if (inBlockComment) {
      if (c === '*' && next === '/') { inBlockComment = false; i++ }
      continue
    }
    if (!quote) {
      if (c === '-' && next === '-' && (sql[i + 2] === ' ' || sql[i + 2] === '\n')) { inLineComment = true; continue }
      if (c === '#') { inLineComment = true; continue }
      // Keep /*! version-gated */ blocks, skip ordinary comments.
      if (c === '/' && next === '*' && sql[i + 2] !== '!') { inBlockComment = true; i++; continue }
    }

    if (quote) {
      buf += c
      if (c === '\\') { buf += next ?? ''; i++; continue } // escaped char
      if (c === quote) {
        if (next === quote) { buf += next; i++; continue } // '' escape
        quote = null
      }
      continue
    }

    if (c === "'" || c === '"' || c === '`') { quote = c; buf += c; continue }

    if (c === ';') {
      const s = buf.trim()
      if (s) out.push(s)
      buf = ''
      continue
    }
    buf += c
  }
  const last = buf.trim()
  if (last) out.push(last)
  return out
}

const conn = await mysql.createConnection({
  host: HOST,
  port: PORT,
  user: USER,
  password,
  database: DB,
  // Aiven requires TLS. Its CA is not in the system store, so verification is
  // off here; the connection is still encrypted. The API uses DB_SSL_CA to
  // verify properly.
  ssl: { rejectUnauthorized: false },
  multipleStatements: false,
  connectTimeout: 30000,
})

async function counts() {
  const [t] = await conn.query(
    'SELECT COUNT(*) n FROM information_schema.tables WHERE table_schema=?', [DB])
  console.log(`  tables : ${t[0].n}`)
  for (const tbl of ['posts', 'users', 'blogs', 'categories', 'pages']) {
    try {
      const [r] = await conn.query(`SELECT COUNT(*) n FROM \`${tbl}\``)
      console.log(`  ${tbl.padEnd(7)}: ${r[0].n}`)
    } catch { console.log(`  ${tbl.padEnd(7)}: (missing)`) }
  }
}

const [v] = await conn.query('SELECT VERSION() v, @@max_connections m')
console.log(`Connected. MySQL ${v[0].v}, max_connections=${v[0].m}\n`)

if (verifyOnly) {
  await counts()
  await conn.end()
  process.exit(0)
}

console.log('Reading dump...')
const sql = await readFile(DUMP, 'utf8')
const statements = splitStatements(sql)
console.log(`${statements.length} statements, ${(sql.length / 1048576).toFixed(1)} MB\n`)

await conn.query('SET FOREIGN_KEY_CHECKS=0')
await conn.query('SET UNIQUE_CHECKS=0')
await conn.query("SET SESSION sql_mode='NO_ENGINE_SUBSTITUTION'")

let done = 0
let failed = 0
const started = Date.now()
for (const stmt of statements) {
  try {
    await conn.query(stmt)
  } catch (err) {
    failed++
    if (failed <= 5) console.error(`\n  FAILED: ${err.code} -- ${stmt.slice(0, 110)}...`)
  }
  done++
  if (done % 25 === 0 || done === statements.length) {
    const pct = ((done / statements.length) * 100).toFixed(0)
    process.stdout.write(`\r  ${done}/${statements.length} (${pct}%)  ${((Date.now() - started) / 1000).toFixed(0)}s`)
  }
}

await conn.query('SET FOREIGN_KEY_CHECKS=1')
await conn.query('SET UNIQUE_CHECKS=1')

console.log(`\n\nStatements run: ${done}, failed: ${failed}\n`)
await counts()
await conn.end()
console.log('\nExpected: 40 tables, 717 posts, 6 users, 12 blogs, 9 categories, 7 pages')
