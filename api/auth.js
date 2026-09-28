import crypto from 'node:crypto'
import mysql from 'mysql2/promise'

let pool
function getPool() {
  if (!pool) pool = mysql.createPool({ host: process.env.MYSQL_HOST, port: Number(process.env.MYSQL_PORT || 3306), user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD, database: process.env.MYSQL_DATABASE, waitForConnections: true, connectionLimit: 4, ssl: process.env.MYSQL_SSL_MODE ? { rejectUnauthorized: false } : undefined })
  return pool
}
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(`${salt}:${key.toString('hex')}`)))
}
async function passwordMatches(password, stored) {
  const [salt, savedKey] = String(stored).split(':')
  if (!salt || !savedKey) return false
  const candidate = await hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(stored))
}
function makeToken(user) {
  const secret = process.env.APP_SESSION_SECRET
  if (!secret) throw new Error('APP_SESSION_SECRET belum diatur.')
  const payload = Buffer.from(JSON.stringify({ id: user.id, alias: user.alias, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 })).toString('base64url')
  return `${payload}.${crypto.createHmac('sha256', secret).update(payload).digest('base64url')}`
}
function makeAlias() { return `Keluarga-A${Math.floor(100 + Math.random() * 900)}` }

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method tidak diizinkan.' })
  const { action, name = '', email = '', password = '' } = request.body || {}
  const normalizedEmail = String(email).trim().toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || String(password).length < 6) return response.status(400).json({ error: 'Gunakan email yang valid dan kata sandi minimal 6 karakter.' })
  try {
    const db = getPool()
    if (action === 'register') {
      if (String(name).trim().length < 2) return response.status(400).json({ error: 'Masukkan nama panggilan minimal 2 karakter.' })
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [normalizedEmail])
      if (existing.length) return response.status(409).json({ error: 'Email ini sudah terdaftar. Silakan masuk.' })
      const [created] = await db.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', [normalizedEmail, await hashPassword(password)])
      let alias = makeAlias()
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try { await db.execute('INSERT INTO user_aliases (user_id, alias_code) VALUES (?, ?)', [created.insertId, alias]); break } catch (error) { if (error.code !== 'ER_DUP_ENTRY' || attempt === 4) throw error; alias = makeAlias() }
      }
      const user = { id: created.insertId, name: String(name).trim(), email: normalizedEmail, alias }
      return response.status(201).json({ user, token: makeToken(user) })
    }
    if (action !== 'login') return response.status(400).json({ error: 'Aksi akun tidak dikenal.' })
    const [rows] = await db.execute('SELECT u.id, u.email, u.password_hash, a.alias_code AS alias FROM users u INNER JOIN user_aliases a ON a.user_id = u.id WHERE u.email = ?', [normalizedEmail])
    const found = rows[0]
    if (!found || !(await passwordMatches(password, found.password_hash))) return response.status(401).json({ error: 'Email atau kata sandi belum sesuai.' })
    await db.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [found.id])
    const user = { id: found.id, name: found.email.split('@')[0], email: found.email, alias: found.alias }
    return response.status(200).json({ user, token: makeToken(user) })
  } catch (error) {
    console.error('Aegis auth:', error.message)
    return response.status(503).json({ error: 'Layanan akun belum dapat terhubung ke database.' })
  }
}
