import { ArrowLeft, ArrowRight, Bot, BookOpen, HeartHandshake, RotateCcw, ShieldCheck } from 'lucide-react'
import { getStressLevel } from '../data/screeningQuestions'

export default function ResultDashboard() {
  const saved = JSON.parse(localStorage.getItem('aegis-screening') || 'null')
  const score = saved?.score ?? 0
  const level = saved?.level ?? getStressLevel(score)
  const scorePercent = Math.max(3, (score / 120) * 100)
  return <main className="result-page">
    <header className="quiz-topbar"><a className="brand" href="#beranda"><span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span><span>Aegis</span></a><span className="quiz-private">Hasil hanya untukmu</span></header>
    <section className="result-shell">
      <a className="back-link" href="#skrining"><ArrowLeft size={17} /> Kembali ke skrining</a>
      <div className="result-heading"><span className="quiz-eyebrow">Hasil skriningmu</span><h1>Terima kasih sudah<br />mendengarkan dirimu.</h1><p>Ini bukan diagnosis medis, melainkan gambaran awal untuk membantumu menentukan langkah berikutnya.</p></div>
      <article className="score-card">
        <div className={`score-orb ${level.color}`}><span>Skor stres</span><strong>{score}<small>/120</small></strong></div>
        <div><span className="result-label">Tingkat stres saat ini</span><h2 className={level.color}>{level.label}</h2><p>{level.insight}</p><div className="score-meter"><span className={level.color} style={{ width: `${scorePercent}%` }} /></div><div className="meter-labels"><span>Ringan</span><span>Sedang</span><span>Tinggi</span></div></div>
      </article>
      <section className="next-steps"><h2>Langkah kecil yang bisa kamu pilih</h2><div className="next-grid"><article><BookOpen /><h3>Buka latihan harian</h3><p>Latihan singkat untuk menciptakan ruang komunikasi yang lebih hangat.</p><a href="#modul">Mulai latihan <ArrowRight size={15} /></a></article><article><Bot /><h3>Berbicara dengan AI Aegis</h3><p>Teman refleksi awal yang siap mendengar tanpa menghakimi.</p><a href="#ai-chat">Mulai percakapan <ArrowRight size={15} /></a></article><article><HeartHandshake /><h3>Temukan psikolog</h3><p>Konseling privat bersama psikolog Surabaya dengan Alias ID.</p><a href="#konseling">Lihat jadwal <ArrowRight size={15} /></a></article></div></section>
      <button className="retry-link" onClick={() => { localStorage.removeItem('aegis-screening'); window.location.hash = 'skrining' }}><RotateCcw size={16} /> Ulangi skrining</button>
    </section>
  </main>
}
