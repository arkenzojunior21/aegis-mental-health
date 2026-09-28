import { ArrowLeft, ArrowRight, CheckCircle2, Heart, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { answerOptions, getStressLevel, screeningQuestions } from '../data/screeningQuestions'

export default function Screening() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const current = screeningQuestions[step]
  const selectedScore = answers[step]
  const progress = Math.round(((step + 1) / screeningQuestions.length) * 100)

  function choose(score) {
    const next = [...answers]
    next[step] = score
    setAnswers(next)
  }

  function continueQuiz() {
    if (selectedScore === undefined) return
    if (step < screeningQuestions.length - 1) setStep(step + 1)
    else {
      const score = answers.reduce((total, answer) => total + answer, 0)
      const result = { score, level: getStressLevel(score), completedAt: new Date().toISOString() }
      const history = JSON.parse(localStorage.getItem('aegis-screening-history') || '[]')
      localStorage.setItem('aegis-screening', JSON.stringify(result))
      localStorage.setItem('aegis-screening-history', JSON.stringify([result, ...history].slice(0, 12)))
      window.location.hash = 'hasil'
    }
  }

  return <main className="screen-page">
    <header className="quiz-topbar">
      <a className="brand" href="#beranda"><span className="brand-mark"><ShieldCheck size={22} strokeWidth={2.5} /></span><span>Aegis</span></a>
      <span className="quiz-private"><Heart size={15} fill="currentColor" /> Jawaban tersimpan aman di perangkatmu</span>
    </header>
    <section className="quiz-shell">
      <button className="back-link" onClick={() => step === 0 ? (window.location.hash = 'beranda') : setStep(step - 1)}><ArrowLeft size={17} /> {step === 0 ? 'Kembali' : 'Pertanyaan sebelumnya'}</button>
      <div className="progress-meta"><span>Langkah {step + 1} dari {screeningQuestions.length}</span><span>{progress}%</span></div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="quiz-content">
        <div className="quiz-eyebrow"><CheckCircle2 size={16} /> Skrining stres keluarga</div>
        <h1>{current.question}</h1>
        <p>{current.helper}</p>
        <div className="answer-list">
          {answerOptions.map(({ label, score }) => <button className={`answer-option ${selectedScore === score ? 'selected' : ''}`} onClick={() => choose(score)} key={label}>
            <span className="radio-dot">{selectedScore === score && <span />}</span>{label}
          </button>)}
        </div>
        <button className="quiz-next" disabled={selectedScore === undefined} onClick={continueQuiz}>{step === screeningQuestions.length - 1 ? 'Lihat hasil skrining' : 'Lanjutkan'} <ArrowRight size={18} /></button>
      </div>
    </section>
  </main>
}
