import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import mysql from 'mysql2/promise'

const root = path.resolve(import.meta.dirname, '..')
const envPath = path.join(root, '.env')
const schemaPath = path.join(root, 'database', 'aegis_schema.sql')

function loadEnv(file) {
  if (!fs.existsSync(file)) return {}
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#') && line.includes('=')).map((line) => {
    const index = line.indexOf('='); const key = line.slice(0, index).trim(); let value = line.slice(index + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    return [key, value]
  }))
}

const env = { ...loadEnv(envPath), ...process.env }
const required = ['MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD']
const missing = required.filter((key) => !env[key])
if (missing.length) {
  console.error(`Gagal: isi ${missing.join(', ')} di file .env terlebih dahulu.`)
  process.exit(1)
}
if (!fs.existsSync(schemaPath)) {
  console.error('Gagal: database/aegis_schema.sql tidak ditemukan.')
  process.exit(1)
}

const ssl = env.MYSQL_SSL_MODE === 'REQUIRED' || env.MYSQL_SSL_MODE === 'VERIFY_CA'
  ? (env.MYSQL_CA_CERT_PATH ? { ca: fs.readFileSync(path.resolve(root, env.MYSQL_CA_CERT_PATH), 'utf8'), rejectUnauthorized: true } : { rejectUnauthorized: false })
  : undefined

console.log(`Menghubungkan ke ${env.MYSQL_HOST}:${env.MYSQL_PORT}/${env.MYSQL_DATABASE}...`)
let connection
try {
  connection = await mysql.createConnection({ host: env.MYSQL_HOST, port: Number(env.MYSQL_PORT), user: env.MYSQL_USER, password: env.MYSQL_PASSWORD, database: env.MYSQL_DATABASE, ssl, multipleStatements: true })
  await connection.query(fs.readFileSync(schemaPath, 'utf8'))
  const [tables] = await connection.query("SHOW TABLES")
  console.log(`Berhasil. ${tables.length} tabel tersedia di database Aegis.`)
  console.log('Contoh tabel:', tables.slice(0, 5).map((row) => Object.values(row)[0]).join(', '))
} catch (error) {
  console.error('Import gagal:', error.message)
  process.exitCode = 1
} finally {
  await connection?.end()
}
