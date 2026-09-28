import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Heart, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { modulePlans } from '../data/dailyModules'

export default function DailyModule() {
  const saved = JSON.parse(localStorage.getItem('aegis-screening') || 'null')
  const hasScreening = Boolean(saved?.level?.label)
  const level = saved?.level?.label
  const plan = hasScreening ? modulePlans[level] : []
  const [activeDay, setActiveDay] = useState(0)
  const [done, setDone] = useState(() => JSON.parse(localStorage.getItem('aegis-module-complete') || '[]'))
  const active = plan[activeDay]
  const completed = done.includes(activeDay)

  function finish() {
    const next = done.includes(activeDay) ? done.filter((day) => day !== activeDay) : [...done, activeDay]
    setDone(next)
    localStorage.setItem('aegis-module-complete', JSON.stringify(next))
  }

  return <main className="module-page">
    <header className="quiz-topbar"><a className="brand" href="#beranda"><span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span><span>Aegis</span></a><span className="quiz-private"><LockKeyhole size={14} /> Ruang latihan privat</span></header>
    <section className="module-shell">
      <a href="#beranda" className="back-link"><ArrowLeft size={17} /> Kembali ke beranda</a>
      {!hasScreening && <div className="module-no-result"><span className="quiz-eyebrow"><Sparkles size={15} /> Panduan yang dipersonalisasi</span><h1>Panduan rumahan mengikuti hasil skriningmu.</h1><p>Aegis memilih latihan berdasarkan kategori Ringan, Sedang, atau Tinggi dari hasil skrining. Ini membantu rekomendasi terasa lebih sesuai dengan kebutuhanmu saat ini.</p><div><a className="primary-button" href="#skrining">Mulai skrining stres <ArrowRight size={17} /></a><a className="text-button" href="#beranda">Kembali ke beranda <ArrowRight size={15} /></a></div><small>Hasil skrining adalah gambaran awal dan bukan diagnosis medis.</small></div>}
      {hasScreening && <>
      <div className="module-hero"><div><span className="quiz-eyebrow"><Sparkles size={15} /> Modul latihan harian</span><h1>Hal kecil, untuk<br /><em>dirimu hari ini.</em></h1><p>Rangkaian latihan ini disesuaikan untuk tingkat stres <b>{level}</b>. Tidak perlu sempurna—cukup lakukan dengan perlahan.</p></div><div className="module-streak"><Heart size={23} fill="currentColor" /><strong>{done.length}<small>/ {plan.length}</small></strong><span>latihan selesai</span></div></div>
      <div className="module-layout">
        <aside className="day-list">{plan.map((item, index) => <button onClick={() => setActiveDay(index)} className={`${activeDay === index ? 'active' : ''} ${done.includes(index) ? 'complete' : ''}`} key={item.day}><span>{done.includes(index) ? <Check size={15} /> : index + 1}</span><div><b>{item.day}</b><small>{item.type} · {item.time}</small></div></button>)}</aside>
        <article className="exercise-card"><div className="exercise-tag"><Clock3 size={15} /> {active.time} · {active.type}</div><h2>{active.title}</h2><p className="exercise-intro">Ikuti langkah berikut dengan ritmemu sendiri. Kamu boleh berhenti kapan pun jika merasa tidak nyaman.</p><ol>{active.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol><div className="reflection"><CheckCircle2 size={19} /><div><b>Jeda untuk refleksi</b><p>{active.reflection}</p></div></div><button className={`complete-button ${completed ? 'is-done' : ''}`} onClick={finish}>{completed ? <><Check size={18} /> Latihan sudah selesai</> : <><Check size={18} /> Tandai latihan selesai</>}</button></article>
      </div>
      {level === 'Tinggi' && <div className="support-note"><Heart size={18} fill="currentColor" /><p><b>Ingat:</b> latihan ini adalah dukungan awal. Bila kamu merasa tidak aman atau terpikir untuk menyakiti diri, segera hubungi orang tepercaya atau layanan darurat setempat.</p></div>}
      </>}
    </section>
  </main>
}
