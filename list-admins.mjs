/**
 * Report which accounts are administrators, and whether each one has
 * two-factor enabled. Read-only -- it issues a single SELECT and changes
 * nothing.
 *
 *   node list-admins.mjs            # against Aiven (prompts for the password)
 *   node list-admins.mjs --local    # against the local XAMPP database
 *
 * Deliberately does NOT select the password column. Passwords are bcrypt
 * hashes: a one-way verifier, not a recoverable secret. There is no query
 * that returns the original password, so there is no reason to read the
 * column at all. If you are locked out, reset with make-admin.mjs rather
 * than trying to recover.
 */

import mysql from 'mysql2/promise'
import readline from 'node:readline'

const local = process.argv.includes('--local')

function ask(question, { hidden = false } = {}) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  if (hidden) {
    rl._writeToOutput = function (str) {
      if (rl.stdoutMuted && str !== question) return
      rl.output.write(str)
    }
  }
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (hidden) rl.output.write('\n')
      rl.close()
      resolve(answer.trim())
    })
    if (hidden) rl.stdoutMuted = true
  })
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

const conn = await mysql.createConnection(config)
console.log(`Connected to ${local ? 'local MySQL' : 'Aiven'}\n`)

const [admins] = await conn.query(
  `SELECT id, name, email, is_admin,
          two_factor_secret IS NOT NULL       AS has_2fa_secret,
          two_factor_confirmed_at IS NOT NULL AS two_factor_active,
          created_at
     FROM users
    WHERE is_admin = 1
    ORDER BY id`
)

if (!admins.length) {
  console.log('No administrator accounts exist.')
  console.log('Create one with:  node make-admin.mjs')
} else {
  console.log(`${admins.length} administrator account(s):\n`)
  for (const a of admins) {
    const twoFactor = a.two_factor_active
      ? 'enabled'
      : a.has_2fa_secret
        ? 'started but never confirmed'
        : 'NOT set up'
    console.log(`  #${a.id}  ${a.email}`)
    console.log(`        name: ${a.name}`)
    console.log(`        two-factor: ${twoFactor}`)
    console.log(`        created: ${a.created_at}`)
    console.log()
  }
  console.log('Note: the admin panel refuses any administrator whose two-factor')
  console.log('is not "enabled", so an account listed otherwise cannot sign in')
  console.log('until it completes 2FA enrolment.')
}

const [[total]] = await conn.query('SELECT COUNT(*) AS n FROM users')
console.log(`(${total.n} user accounts in total.)`)

await conn.end()
