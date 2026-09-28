import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

let pool
const databaseVariables = ['MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE']
const usernamePattern = /^[a-zA-Z0-9._-]{3,32}$/

function missingDatabaseVariables() {
  return databaseVariables.filter((key) => !process.env[key])
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 4,
      ssl: process.env.MYSQL_SSL_MODE ? { rejectUnauthorized: false } : undefined,
    })
  }
  return pool
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(salt + ':' + key.toString('hex'))))
}

async function passwordMatches(password, stored) {
  const [salt] = String(stored).split(':')
  if (!salt) return false
  const candidate = await hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(stored))
}

function makeToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, alias: user.alias, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 })).toString('base64url')
  return payload + '.' + crypto.createHmac('sha256', process.env.APP_SESSION_SECRET).update(payload).digest('base64url')
}

function makeAlias() {
  return 'Keluarga-A' + Math.floor(100 + Math.random() * 900)
}

function validationError({ username, password, fullName, displayName, age }, isRegister) {
  if (!usernamePattern.test(username)) return 'Username harus 3–32 karakter dan hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda minus.'
  if (String(password).length < 6) return 'Kata sandi minimal 6 karakter.'
  if (isRegister && String(fullName).trim().length < 2) return 'Masukkan nama lengkap minimal 2 karakter.'
  if (isRegister && String(displayName).trim().length < 2) return 'Masukkan nama panggilan minimal 2 karakter.'
  const numericAge = Number(age)
  if (isRegister && (!Number.isInteger(numericAge) || numericAge < 10 || numericAge > 120)) return 'Umur harus diisi antara 10 sampai 120 tahun.'
  return null
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method tidak diizinkan.' })

  const missingVariables = missingDatabaseVariables()
  if (missingVariables.length) return response.status(500).json({ error: 'Konfigurasi database belum lengkap: ' + missingVariables.join(', ') + '.' })
  if (!process.env.APP_SESSION_SECRET) return response.status(500).json({ error: 'Konfigurasi APP_SESSION_SECRET belum tersedia pada deployment ini.' })

  const { action, username = '', password = '', fullName = '', displayName = '', age = '' } = request.body || {}
  const normalizedUsername = String(username).trim().toLowerCase()
  const isRegister = action === 'register'
  const invalid = validationError({ username: normalizedUsername, password, fullName, displayName, age }, isRegister)
  if (invalid) return response.status(400).json({ error: invalid })

  try {
    const db = getPool()
    if (isRegister) {
      const [existing] = await db.execute('SELECT id FROM users WHERE username = ?', [normalizedUsername])
      if (existing.length) return response.status(409).json({ error: 'Username ini sudah dipakai. Gunakan username lain.' })

      const [created] = await db.execute(
        'INSERT INTO users (username, full_name, display_name, age, password_hash) VALUES (?, ?, ?, ?, ?)',
        [normalizedUsername, String(fullName).trim(), String(displayName).trim(), Number(age), await hashPassword(password)],
      )
      let alias = makeAlias()
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await db.execute('INSERT INTO user_aliases (user_id, alias_code) VALUES (?, ?)', [created.insertId, alias])
          break
        } catch (error) {
          if (error.code !== 'ER_DUP_ENTRY' || attempt === 4) throw error
          alias = makeAlias()
        }
      }
      const user = { id: created.insertId, name: String(displayName).trim(), username: normalizedUsername, age: Number(age), alias }
      return response.status(201).json({ user, token: makeToken(user) })
    }

    if (action !== 'login') return response.status(400).json({ error: 'Aksi akun tidak dikenal.' })
    const [rows] = await db.execute(
      'SELECT u.id, u.username, u.display_name, u.age, u.password_hash, a.alias_code AS alias FROM users u INNER JOIN user_aliases a ON a.user_id = u.id WHERE u.username = ?',
      [normalizedUsername],
    )
    const found = rows[0]
    if (!found || !(await passwordMatches(password, found.password_hash))) return response.status(401).json({ error: 'Username atau kata sandi belum sesuai.' })
    await db.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [found.id])
    const user = { id: found.id, name: found.display_name, username: found.username, age: found.age, alias: found.alias }
    return response.status(200).json({ user, token: makeToken(user) })
  } catch (error) {
    console.error('Aegis auth:', error.message)
    if (error.code === 'ER_ACCESS_DENIED_ERROR') return response.status(503).json({ error: 'Koneksi database ditolak. Periksa MYSQL_USER dan MYSQL_PASSWORD di Vercel.' })
    if (error.code === 'ENOTFOUND') return response.status(503).json({ error: 'Host database tidak ditemukan. Periksa MYSQL_HOST di Vercel.' })
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') return response.status(503).json({ error: 'Database tidak dapat dijangkau. Periksa MYSQL_PORT dan status layanan Aiven.' })
    if (error.code === 'ER_BAD_FIELD_ERROR') return response.status(503).json({ error: 'Struktur database belum diperbarui. Jalankan migrasi username terlebih dahulu.' })
    return response.status(503).json({ error: 'Layanan akun belum dapat terhubung ke database.' })
  }
}
