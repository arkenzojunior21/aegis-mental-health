import { ArrowLeft, ArrowRight, Bot, Brain, Check, ChevronRight, Clock3, HeartHandshake, LockKeyhole, MapPin, Menu, MessageCircleHeart, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Screening from './pages/Screening'
import ResultDashboard from './pages/ResultDashboard'
import DailyModule from './pages/DailyModule'
import AiAssistant from './pages/AiAssistant'
import Counseling from './pages/Counseling'
import AdminDashboard from './pages/AdminDashboard'
import PrivacyPage from './pages/PrivacyPage'
import FeatureOverview from './pages/FeatureOverview'
import InfoPage from './pages/InfoPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import Onboarding from './components/Onboarding'

const features = [
  { icon: Clock3, title: 'Tes 15 Menit', copy: 'Memahami tanda stres lebih awal, dengan pertanyaan sederhana.', href: '#fitur-skrining', action: 'Pelajari fitur' },
  { icon: Bot, title: 'AI Assistant 24/7', copy: 'Ruang bercerita awal yang empatik, kapan pun dibutuhkan.', href: '#fitur-ai', action: 'Pelajari fitur' },
  { icon: HeartHandshake, title: 'Panduan Rumahan', copy: 'Langkah kecil yang hangat untuk dilakukan bersama di rumah.', href: '#fitur-modul', action: 'Pelajari fitur' },
  { icon: LockKeyhole, title: 'Konseling Anonim', copy: 'Terhubung ke psikolog lokal dengan identitas yang terlindungi.', href: '#fitur-konseling', action: 'Pelajari fitur' },
]

function AegisMark() {
  return <span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span>
}

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#beranda" aria-label="Aegis beranda"><AegisMark /><span>Aegis</span></a>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Navigasi utama">
          <a href="#tentang-aegis" onClick={() => setMenuOpen(false)}>Tentang Aegis</a>
          <a href="#dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
          <a href="#ai-chat" onClick={() => setMenuOpen(false)}>AI Assistant</a>
          <a href="#konseling" onClick={() => setMenuOpen(false)}>Konseling</a>
          <a href="#privasi" onClick={() => setMenuOpen(false)}>Privasi</a>
          <a href="#bantuan-aegis" onClick={() => setMenuOpen(false)}>Bantuan</a>
          <a className="mobile-auth-link" href="#login" onClick={() => setMenuOpen(false)}>Masuk</a>
          <a className="mobile-auth-link mobile-register-link" href="#register" onClick={() => setMenuOpen(false)}>Buat akun</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Buka menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <a className="header-cta" href="#dashboard">Buka Dashboard <ArrowRight size={16} /></a>
        <a className="login-link" href="#login">Masuk</a>
      </header>

      <section className="hero" id="beranda">
        <div className="hero-copy">
          <div className="location-pill"><MapPin size={15} /> Untuk keluarga di Surabaya</div>
          <h1>Tempat aman untuk<br /><em>memahami perasaan.</em></h1>
          <p className="lead">Aegis membantu orang tua dan remaja mengenali stres sejak dini, tanpa rasa takut akan stigma dan tanpa mengorbankan privasi.</p>
          <div className="hero-actions" id="skrining">
            <a className="primary-button" href="#dashboard">Lihat fitur siap pakai <ArrowRight size={18} /></a>
            <a className="text-button" href="#tentang-aegis">Kenali Aegis <ChevronRight size={17} /></a>
          </div>
          <div className="trust-line"><span><Check size={15} /> Privat &amp; aman</span><span><Check size={15} /> Tanpa penghakiman</span></div>
        </div>

        <div className="hero-art" aria-label="Ilustrasi dukungan kesehatan mental keluarga">
          <div className="sun-orb"></div><div className="dot-pattern"></div>
          <div className="care-card main-card">
            <div className="soft-icon"><HeartHandshake size={30} /></div>
            <span className="mini-title">Ruang untuk bernapas</span>
            <strong>Kamu tidak sendiri.</strong>
            <p>Setiap emosi layak didengarkan.</p>
            <div className="card-footer"><span className="avatars"><i></i><i></i><i></i></span><span>Didampingi dengan hangat</span></div>
          </div>
          <div className="floating-card shield-float"><ShieldCheck size={22} /><span>Privasi terjaga</span></div>
          <div className="floating-card chat-float"><MessageCircleHeart size={22} /><span>Selalu ada untukmu</span></div>
          <div className="leaf leaf-one"></div><div className="leaf leaf-two"></div>
        </div>
      </section>

      <section className="about-aegis">
        <div className="about-art"><span className="about-circle one" /><span className="about-circle two" /><HeartHandshake size={46} /></div>
        <div><span className="eyebrow">Tentang Aegis</span><h2>Dibuat untuk percakapan yang sering tertunda.</h2><p>Aegis hadir sebagai titik awal yang tenang bagi keluarga di Surabaya: untuk mengenali sinyal stres, memberi ruang bercerita, dan memilih dukungan yang tepat tanpa rasa malu.</p><div className="about-points"><span><Check size={16} /> Berpihak pada keluarga</span><span><Check size={16} /> Bahasa yang mudah dipahami</span><span><Check size={16} /> Privasi sejak awal</span></div><a href="#privasi" className="text-button">Pelajari cara kerja Aegis <ChevronRight size={17} /></a></div>
      </section>

      <section className="features" id="fitur">
        {features.map(({ icon: Icon, title, copy, href, action }, index) => <article className="feature-card" key={title}>
          <span className={`feature-icon tone-${index}`}><Icon size={23} /></span>
          <h3>{title}</h3><p>{copy}</p><a href={href}>{action} <ArrowRight size={15} /></a>
        </article>)}
      </section>

      <section className="privacy" id="privasi">
        <div className="privacy-icon"><LockKeyhole size={26} /></div>
        <div><div className="eyebrow">Privasi adalah fondasi kami</div><h2>Identitasmu tetap milikmu.</h2><p>Psikolog melihat alias, bukan nama asli. Data pribadi terenkripsi dan hanya dapat diakses melalui protokol keamanan yang ketat.</p></div>
        <a href="#privasi" className="outline-button">Cara kerja privasi <ArrowRight size={16} /></a>
      </section>

      <section className="bottom-cta" id="bantuan">
        <Brain size={35} /><div><h2>Mari mulai dari satu langkah kecil.</h2><p>Tidak perlu punya semua jawabannya hari ini.</p></div><a href="#dashboard" className="primary-button">Buka Dashboard <ArrowRight size={18} /></a>
      </section>

      <footer><a className="brand" href="#beranda"><AegisMark /><span>Aegis</span></a><span>Perisai Kesehatan Mental Keluarga</span><span>© 2026 Aegis Surabaya</span></footer>
    </main>
  )
}

function App() {
  const [page, setPage] = useState(() => window.location.hash.replace('#', '') || 'beranda')
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('aegis-onboarding-complete'))

  useEffect(() => {
    const syncPage = () => setPage(window.location.hash.replace('#', '') || 'beranda')
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  let currentPage = <Landing />
  if (page === 'skrining') currentPage = <Screening />
  else if (page === 'hasil') currentPage = <ResultDashboard />
  else if (page === 'modul') currentPage = <DailyModule />
  else if (page === 'ai-chat') currentPage = <AiAssistant />
  else if (page === 'konseling') currentPage = <Counseling />
  else if (page === 'admin') currentPage = <AdminDashboard />
  else if (page === 'privasi') currentPage = <PrivacyPage />
  else if (page === 'dashboard') currentPage = <Dashboard />
  else if (['tentang-aegis', 'daftar-fitur', 'bantuan-aegis'].includes(page)) currentPage = <InfoPage type={page} />
  else if (page === 'login' || page === 'register') currentPage = <AuthPage mode={page} />
  else if (page.startsWith('fitur-')) currentPage = <FeatureOverview type={page.replace('fitur-', '')} />

  return <>{showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}<div className="page-transition" key={page}>{currentPage}</div></>
}

export default App
