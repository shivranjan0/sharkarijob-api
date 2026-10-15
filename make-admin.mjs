/**
 * Promote an account to administrator and set its password.
 *
 * The only admin carried over from the Laravel site is admin@sharkari.com,
 * whose password nobody has. This creates or updates an account you control.
 *
 *   node make-admin.mjs
 *
 * Run it with no arguments and it asks for everything it needs, with the two
 * passwords hidden. Nothing lands in shell history that way. Values may still
 * be passed up front when scripting:
 *
 *   AIVEN_PASSWORD='...' node make-admin.mjs you@example.com 'NewPassw0rd!'
 *
 * Add --local to run against the XAMPP database instead of Aiven.
 */

import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import readline from 'node:readline'

const [, , emailArg, passwordArg, ...flags] = process.argv
const local = flags.includes('--local')

/**
 * Prompt on the terminal. With `hidden`, keystrokes are not echoed -- the
 * usual trick of muting output on the readline interface, so a password is
 * never shown on screen or captured by a scrollback buffer.
 */
function ask(question, { hidden = false } = {}) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  if (hidden) {
    rl._writeToOutput = function (str) {
      // Let the prompt itself through; swallow the typed characters.
      if (rl.stdoutMuted && str !== question) return
      rl.output.write(str)
    }
  }

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.stdoutMuted = false
      if (hidden) process.stdout.write('\n')
      rl.close()
      resolve(answer.trim())
    })
    if (hidden) rl.stdoutMuted = true
  })
}

const email = emailArg || (await ask('Admin email: '))
if (!email.includes('@')) {
  console.error('ERROR: that does not look like an email address.')
  process.exit(1)
}

const password = passwordArg || (await ask('Admin password (hidden): ', { hidden: true }))
if (password.length < 8) {
  console.error('ERROR: use a password of at least 8 characters.')
  process.exit(1)
}

if (!local && !process.env.AIVEN_PASSWORD) {
  process.env.AIVEN_PASSWORD = await ask('Aiven database password (hidden): ', { hidden: true })
}

const config = local
  ? { host: '127.0.0.1', port: 3306, user: 'root', password: '', database: 'sharkari_db' }
  : {
      host: 'mysql-28beb6b4-sharkarijobsupport-c662.a.aivencloud.com',
      port: 24781,
      user: 'avnadmin',
      password: process.env.AIVEN_PASSWORD,
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false },
    }

if (!local && !config.password) {
  console.error('ERROR: set AIVEN_PASSWORD (or pass --local).')
  process.exit(1)
}

// Cost 12 matches config/hash.js, so the hash is indistinguishable from one
// created by the app itself.
const hash = await bcrypt.hash(password, 12)

const conn = await mysql.createConnection(config)
console.log(`Connected to ${local ? 'local MySQL' : 'Aiven'}\n`)

const [rows] = await conn.query('SELECT id, name, is_admin FROM users WHERE email = ?', [email])

if (rows.length > 0) {
  const user = rows[0]
  await conn.query('UPDATE users SET password = ?, is_admin = 1, updated_at = NOW() WHERE id = ?', [
    hash,
    user.id,
  ])
  console.log(`Updated existing account #${user.id} (${user.name})`)
  console.log(`  was admin: ${user.is_admin ? 'yes' : 'no'} -> now: yes`)
  console.log('  password: replaced')
} else {
  const [res] = await conn.query(
    'INSERT INTO users (name, email, password, is_admin, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())',
    ['Administrator', email, hash]
  )
  console.log(`Created account #${res.insertId} (${email}) as administrator`)
}

// Any token issued before the password changed should stop working.
const [tok] = await conn.query(
  'DELETE FROM auth_access_tokens WHERE tokenable_id = (SELECT id FROM users WHERE email = ?)',
  [email]
)
if (tok.affectedRows) console.log(`  revoked ${tok.affectedRows} existing session token(s)`)

const [all] = await conn.query('SELECT id, email, is_admin FROM users WHERE is_admin = 1')
console.log('\nAdministrators now:')
for (const u of all) console.log(`  #${u.id}  ${u.email}`)

await conn.end()
console.log('\nSign in at https://sharkarijob.online/admin/login')
