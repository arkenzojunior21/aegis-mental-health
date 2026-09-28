import { ArrowLeft, ArrowRight, Bot, BookOpen, CalendarDays, Clock3, HeartHandshake, LockKeyhole, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react'

const tools = [
  { icon: Clock3, title: 'Skrining stres', label: '40 pertanyaan · ±15 menit', description: 'Kenali pola stres dan dapatkan gambaran awal yang mudah dipahami.', action: 'Mulai skrining', href: '#skrining', tone: 'screening' },
  { icon: Bot, title: 'AI Assistant', label: 'Ruang cerita 24/7', description: 'Mulai percakapan suportif, latihan singkat, atau refleksi emosimu.', action: 'Buka AI Assistant', href: '#ai-chat', tone: 'assistant' },
  { icon: BookOpen, title: 'Latihan harian', label: 'Program 7 hari', description: 'Pilih aktivitas praktis untuk bernapas, pulih, dan membangun rutinitas.', action: 'Buka latihan', href: '#modul', tone: 'module' },
  { icon: CalendarDays, title: 'Konseling privat', label: 'Psikolog Surabaya', description: 'Pilih psikolog dan jadwal dengan Alias ID untuk menjaga privasimu.', action: 'Cari psikolog', href: '#konseling', tone: 'counseling' },
]

export default function Dashboard() {
  const screening = JSON.parse(localStorage.getItem('aegis-screening') || 'null')
  const alias = localStorage.getItem('aegis-user-alias')
  const completedDays = JSON.parse(localStorage.getItem('aegis-module-complete') || '[]')
  const chats = JSON.parse(localStorage.getItem('aegis-chat-conversations') || '[]')
  const bookings = JSON.parse(localStorage.getItem('aegis-bookings') || '[]')
  const completedCount = Math.min(completedDays.length, 7)
  const screeningDate = screening?.completedAt ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(screening.completedAt)) : null
  return <main className="dashboard-page">
    <header className="quiz-topbar"><a className="brand" href="#beranda"><span className="brand-mark"><ShieldCheck size={22} /></span><span>Aegis</span></a><span className="quiz-private"><LockKeyhole size={14} /> Ruang dukungan privat</span></header>
    <section className="dashboard-shell">
      <a className="back-link" href="#beranda"><ArrowLeft size={17} /> Kembali ke beranda</a>
      <div className="dashboard-heading"><span className="quiz-eyebrow"><Sparkles size={15} /> Dashboard Aegis</span><h1>Selamat datang kembali.<br /><em>Mulai dari mana hari ini?</em></h1><p>Semua fitur siap digunakan secara mandiri. Kamu bebas memulai dari mana saja—tanpa perlu menyelesaikan fitur lain terlebih dahulu.</p></div>
      <div className="dashboard-status" aria-label="Status dukungan Anda"><div><span>Alias privat</span><b>{alias || 'Akan dibuat saat konseling'}</b></div><div><span>Hasil skrining</span><b>{screening?.level?.label || 'Belum dikerjakan'}</b></div><a href="#privasi">Cara kerja privasi <ArrowRight size={15} /></a></div>
      <section className="dashboard-tools" aria-label="Fitur siap pakai">{tools.map(({ icon: Icon, title, label, description, action, href, tone }) => <article className={`dashboard-tool ${tone}`} key={title}><span className="dashboard-icon"><Icon size={25} /></span><div><span className="tool-label">{label}</span><h2>{title}</h2><p>{description}</p></div><a href={href}>{action} <ArrowRight size={17} /></a></article>)}</section>
      <section className="journey-section" aria-label="Perjalanan Anda"><div className="journey-heading"><div><span className="quiz-eyebrow"><HeartHandshake size={15} /> Perjalananmu</span><h2>Ringkasan yang tersimpan di perangkat ini.</h2></div><span className="private-chip"><LockKeyhole size={14} /> Mode privat aktif</span></div><div className="journey-grid"><article><Clock3 size={19} /><span>Skrining terakhir</span>{screening ? <><b>{screening.level.label}</b><small>{screeningDate}</small><a href="#hasil">Lihat hasil <ArrowRight size={14} /></a></> : <><b>Belum ada hasil skrining</b><small>Lakukan skrining pertama untuk mendapat gambaran awal.</small><a href="#skrining">Mulai skrining <ArrowRight size={14} /></a></>}</article><article><BookOpen size={19} /><span>Latihan minggu ini</span>{completedCount ? <><b>{completedCount} / 7 selesai</b><div className="journey-progress"><span style={{ width: `${(completedCount / 7) * 100}%` }} /></div><small>Hari {Math.min(completedCount + 1, 7)} siap dilanjutkan.</small><a href="#modul">Lanjutkan latihan <ArrowRight size={14} /></a></> : <><b>Belum ada latihan selesai</b><small>Mulai dari aktivitas singkat yang sesuai kebutuhanmu.</small><a href="#modul">Mulai latihan <ArrowRight size={14} /></a></>}</article><article><MessageSquare size={19} /><span>Percakapan AI</span>{chats.some((chat) => chat.messages?.length) ? <><b>{chats.filter((chat) => chat.messages?.length).length} percakapan</b><small>Riwayat tersimpan hanya di perangkat ini.</small><a href="#ai-chat">Buka AI Assistant <ArrowRight size={14} /></a></> : <><b>Belum ada percakapan</b><small>Mulai ruang cerita kapan pun kamu membutuhkannya.</small><a href="#ai-chat">Mulai percakapan <ArrowRight size={14} /></a></>}</article><article><CalendarDays size={19} /><span>Konseling</span>{bookings.length ? <><b>{bookings.length} sesi tersimpan</b><small>{bookings.at(-1)?.status || 'Menunggu konfirmasi'}</small><a href="#konseling">Lihat konseling <ArrowRight size={14} /></a></> : <><b>Belum ada sesi konseling</b><small>Cari psikolog yang sesuai kebutuhan dan jadwalmu.</small><a href="#konseling">Cari konseling <ArrowRight size={14} /></a></>}</article></div></section>
      <div className="dashboard-note"><HeartHandshake size={20} /><p><b>Mulai dengan nyaman.</b> Aegis memberi dukungan awal, bukan diagnosis medis atau layanan darurat. Kamu dapat berhenti kapan pun.</p></div>
    </section>
  </main>
}
