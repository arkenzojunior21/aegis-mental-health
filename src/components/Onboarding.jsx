import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

const choices = [
  ['Memahami kondisi saya', '#skrining'],
  ['Mencoba latihan', '#modul'],
  ['Bercerita dengan AI', '#ai-chat'],
  ['Mencari konseling', '#konseling'],
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  function finish(target = '#dashboard') { localStorage.setItem('aegis-onboarding-complete', 'true'); onComplete(); window.location.hash = target }

  return <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
    <section className="onboarding-card">
      <span className="onboarding-mark"><ShieldCheck size={28} /></span>
      {step === 0 ? <><span className="quiz-eyebrow"><Sparkles size={15} /> Selamat datang</span><h1 id="onboarding-title">Ruang untuk memahami<br />perasaan dengan tenang.</h1><p>Aegis membantu kamu mengambil langkah awal untuk diri sendiri dan keluarga, dengan pendekatan yang hangat serta semi-anonim.</p><button className="onboarding-main" onClick={() => setStep(1)}>Lanjut <ArrowRight size={18} /></button><button className="onboarding-skip" onClick={() => finish()}>Lewati untuk sekarang</button></> : <><span className="quiz-eyebrow"><HeartHandshake size={15} /> Mulai dari kebutuhanmu</span><h1 id="onboarding-title">Apa yang ingin<br />kamu lakukan?</h1><div className="onboarding-options">{choices.map(([label, target]) => <button onClick={() => finish(target)} key={label}>{label}<ArrowRight size={17} /></button>)}</div><button className="onboarding-skip" onClick={() => finish()}>Masuk ke Dashboard</button></>}
    </section>
  </div>
}
