import { Check, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'

export default function AuthPage({ mode, onAuthenticated }) {
  const isLogin = mode === 'login'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: isLogin ? 'login' : 'register', name, email, password }) })
      const data = await response.json()
      if (!response.ok) return setError(data.error || 'Akun belum dapat diproses.')
      const session = { ...data.user, token: data.token }
      localStorage.setItem('aegis-session', JSON.stringify(session))
      localStorage.setItem('aegis-user-alias', data.user.alias)
      onAuthenticated(session)
      window.location.hash = 'dashboard'
    } catch { setError('Tidak dapat terhubung ke layanan akun. Coba lagi.') } finally { setLoading(false) }
  }
  return <main className="auth-page"><header className="quiz-topbar"><a className="brand" href="#login"><span className="brand-mark"><ShieldCheck size={22} /></span><span>Aegis</span></a></header><section className="auth-layout"><div className="auth-intro"><span className="quiz-eyebrow"><ShieldCheck size={16} /> Ruang aman untuk keluarga</span><h1>Mulai dengan<br /><em>rasa aman.</em></h1><p>Masuk untuk membuka ruang dukungan Aegis, menyimpan alias konseling, serta perjalananmu secara terpusat.</p><ul><li><Check size={16} /> Alias dibuat untuk menjaga privasi sesi.</li><li><Check size={16} /> Tidak ada profil publik.</li><li><Check size={16} /> Data akun disimpan melalui layanan Aegis.</li></ul></div><form className="auth-card" onSubmit={submit}><span className="auth-icon">{isLogin ? <LockKeyhole size={25} /> : <UserRound size={25} />}</span><h2>{isLogin ? 'Selamat datang kembali' : 'Buat akun Aegis'}</h2><p>{isLogin ? 'Masuk untuk melanjutkan ruang dukunganmu.' : 'Daftar untuk menyimpan perjalananmu di Aegis.'}</p>{!isLogin && <label>Nama panggilan<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Ibu Rani" /></label>}<label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" /></label><label>Kata sandi<input required type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 6 karakter" /></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="quiz-next" disabled={loading}>{loading ? 'Memproses…' : isLogin ? 'Masuk ke Aegis' : 'Buat akun & lanjutkan'}</button><p className="auth-switch">{isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'} <a href={isLogin ? '#register' : '#login'}>{isLogin ? 'Daftar sekarang' : 'Masuk'}</a></p><small className="auth-demo">Akses fitur Aegis tersedia setelah kamu masuk.</small></form></section></main>
}
