import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import mysql from 'mysql2/promise'

const root = path.resolve(import.meta.dirname, '..')
const envPath = path.join(root, '.env')
const migrationPath = path.join(root, 'database', 'migrations', '002_username_profile.sql')

function loadEnv(file) {
  if (!fs.existsSync(file)) return {}
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#') && line.includes('=')).map((line) => {
    const index = line.indexOf('=')
    return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
  }))
}

const env = { ...loadEnv(envPath), ...process.env }
const required = ['MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD']
const missing = required.filter((key) => !env[key])
if (missing.length) {
  console.error('Gagal: isi ' + missing.join(', ') + ' di file .env terlebih dahulu.')
  process.exit(1)
}

const ssl = env.MYSQL_SSL_MODE === 'REQUIRED' || env.MYSQL_SSL_MODE === 'VERIFY_CA'
  ? { rejectUnauthorized: false }
  : undefined

let connection
try {
  console.log('Menjalankan migrasi username pada ' + env.MYSQL_DATABASE + '...')
  connection = await mysql.createConnection({
    host: env.MYSQL_HOST,
    port: Number(env.MYSQL_PORT),
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    ssl,
    multipleStatements: true,
  })
  await connection.query(fs.readFileSync(migrationPath, 'utf8'))
  console.log('Berhasil. Login sekarang menggunakan username.')
} catch (error) {
  console.error('Migrasi gagal:', error.message)
  process.exitCode = 1
} finally {
  await connection?.end()
}
