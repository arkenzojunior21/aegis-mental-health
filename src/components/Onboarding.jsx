import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function Onboarding({ onComplete }) {
  function finish(target = '#dashboard') { localStorage.setItem('aegis-onboarding-complete', 'true'); onComplete(); window.location.hash = target }

  return <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
    <section className="onboarding-card">
      <span className="onboarding-mark"><ShieldCheck size={28} /></span>
      <span className="quiz-eyebrow"><Sparkles size={15} /> Selamat datang</span>
      <h1 id="onboarding-title">Ruang untuk memahami<br />perasaan dengan tenang.</h1>
      <p>Aegis membantu kamu mengambil langkah awal untuk diri sendiri dan keluarga, dengan pendekatan yang hangat serta semi-anonim.</p>
      <button className="onboarding-main" onClick={() => finish('#dashboard')}>Lanjut ke Dashboard <ArrowRight size={18} /></button>
      <button className="onboarding-skip" onClick={() => finish('#beranda')}>Lewati untuk sekarang</button>
    </section>
  </div>
}
