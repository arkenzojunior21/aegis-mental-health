import { AlertTriangle, ArrowLeft, ArrowRight, Bot, BookOpen, HeartHandshake, LockKeyhole, RotateCcw, ShieldCheck } from 'lucide-react'
import { getStressLevel } from '../data/screeningQuestions'

export default function ResultDashboard() {
  const saved = JSON.parse(localStorage.getItem('aegis-screening') || 'null')
  const score = saved?.score ?? 0
  const level = saved?.level ?? getStressLevel(score)
  const history = JSON.parse(localStorage.getItem('aegis-screening-history') || '[]')
  const scorePercent = Math.max(3, (score / 120) * 100)
  const formatDate = (date) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
  return <main className="result-page">
    <header className="quiz-topbar"><a className="brand" href="#beranda"><span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span><span>Aegis</span></a><span className="quiz-private">Hasil hanya untukmu</span></header>
    <section className="result-shell">
      <a className="back-link" href="#skrining"><ArrowLeft size={17} /> Kembali ke skrining</a>
      <div className="result-heading"><span className="quiz-eyebrow">Hasil skriningmu</span><h1>Terima kasih sudah<br />mendengarkan dirimu.</h1><p>Ini bukan diagnosis medis, melainkan gambaran awal untuk membantumu menentukan langkah berikutnya.</p></div>
      <article className="score-card">
        <div className={`score-orb ${level.color}`}><span>Skor stres</span><strong>{score}<small>/120</small></strong></div>
        <div><span className="result-label">Tingkat stres saat ini</span><h2 className={level.color}>{level.label}</h2><p>{level.insight}</p><div className="score-meter"><span className={level.color} style={{ width: `${scorePercent}%` }} /></div><div className="meter-labels"><span>Ringan</span><span>Sedang</span><span>Tinggi</span></div></div>
      </article>
      <section className="next-steps"><h2>Apa yang bisa kamu lakukan sekarang?</h2><div className="next-grid"><article><span className="step-number">01</span><BookOpen /><h3>Mulai latihan</h3><p>Coba latihan singkat yang disesuaikan dengan hasil skriningmu.</p><a href="#modul">Mulai latihan <ArrowRight size={15} /></a></article><article><span className="step-number">02</span><Bot /><h3>Bercerita</h3><p>Jika ingin menuliskan apa yang kamu rasakan, Aegis AI siap menjadi ruang awal.</p><a href="#ai-chat">Buka AI Assistant <ArrowRight size={15} /></a></article><article><span className="step-number">03</span><HeartHandshake /><h3>Pertimbangkan dukungan</h3><p>Jika membutuhkan bantuan lebih lanjut, lihat psikolog dan jadwal yang tersedia.</p><a href="#konseling">Lihat konseling <ArrowRight size={15} /></a></article></div></section>
      {history.length > 0 && <section className="screening-history"><div><span className="quiz-eyebrow"><RotateCcw size={15} /> Riwayat hasil skrining</span><h2>Hasil yang tersimpan di perangkat ini.</h2></div><div className="history-list">{history.slice(0, 5).map((item, index) => <div key={`${item.completedAt}-${index}`}><span>{formatDate(item.completedAt)}</span><b className={item.level.color}>{item.level.label}</b></div>)}</div></section>}
      <a className="safety-access" href="#bantuan-aegis"><AlertTriangle size={18} /><span><b>Butuh bantuan segera?</b> Pelajari pilihan bantuan keselamatan.</span><ArrowRight size={16} /></a>
      <p className="result-disclaimer"><LockKeyhole size={15} /> Hasil ini bukan diagnosis medis. Gunakan sebagai gambaran awal dan pertimbangkan bantuan profesional bila diperlukan.</p>
      <button className="retry-link" onClick={() => { localStorage.removeItem('aegis-screening'); window.location.hash = 'skrining' }}><RotateCcw size={16} /> Ulangi skrining</button>
    </section>
  </main>
}
