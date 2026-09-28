import { AlertTriangle, Bot, Heart, Menu, MessageSquare, Plus, Send, ShieldCheck, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const crisisWords = /bunuh diri|mengakhiri hidup|menyakiti diri|self.?harm|melukai diri|tidak ingin hidup|lebih baik mati/i

const replyTemplates = {
  crisis: 'Aku sangat peduli kamu mau menyampaikan ini. Keselamatanmu adalah yang paling penting sekarang.\n\nLangkah sekarang:\n1. Jangan sendirian bila memungkinkan - hubungi keluarga, teman, guru, atau orang dewasa yang kamu percaya dan katakan: "Aku sedang tidak aman dan butuh ditemani."\n2. Jauhkan diri dari benda atau tempat yang bisa kamu gunakan untuk melukai diri.\n3. Bila ada bahaya langsung, segera hubungi layanan darurat setempat atau pergi ke IGD/fasilitas kesehatan terdekat.\n\nKamu tidak harus menyelesaikan semuanya saat ini. Apakah ada satu orang yang bisa kamu hubungi atau datangi sekarang?',
  bullying: 'Kedengarannya perlakuan mereka benar-benar menyakitkan. Kamu tidak pantas diejek atau diperlakukan seperti itu, dan ini bukan salahmu.\n\nUntuk melindungi dirimu hari ini, pilih satu langkah kecil: menjauh dari situasi itu bila aman, simpan bukti bila terjadi secara online, atau ceritakan pada orang dewasa yang bisa membantu. Kamu bisa memakai kalimat: "Aku sedang sering diejek dan aku butuh bantuan supaya ini berhenti."\n\nSebelum kita mencari langkah berikutnya, ejekannya terjadi di sekolah, rumah, atau media sosial?',
  panic: 'Rasa panik atau cemas bisa membuat tubuh terasa seperti sedang dalam bahaya, walau kamu sedang berusaha bertahan. Terima kasih sudah memberitahuku.\n\nMari coba jeda 60 detik: letakkan telapak kaki di lantai, lihat 5 benda di sekitarmu, lalu tarik napas pelan selama 4 hitungan dan hembuskan selama 6 hitungan. Ulangi 3 kali tanpa memaksa.\n\nSetelah sedikit lebih tenang, apa yang paling terasa di tubuhmu sekarang - napas, dada, pikiran yang berlari, atau hal lain?',
  overwhelmed: 'Kamu sedang membawa banyak hal sekaligus, jadi wajar kalau rasanya kewalahan. Kita tidak perlu menyelesaikan semuanya sekarang.\n\nCoba pilih satu dari dua hal ini: minum air dan duduk selama satu menit, atau tulis tiga hal yang sedang membebani lalu lingkari satu yang paling mendesak. Fokus hanya pada langkah yang bisa dilakukan dalam 10 menit ke depan.\n\nKalau kamu mau, ceritakan satu hal yang paling berat saat ini. Kita bisa menguraikannya pelan-pelan.',
  family: 'Membicarakan hal yang berat dengan keluarga memang bisa terasa menakutkan, terutama kalau kamu khawatir tidak dipahami. Perasaanmu masuk akal.\n\nKamu bisa mencoba membuka percakapan pada waktu yang lebih tenang dengan kalimat: "Aku tidak butuh solusi dulu, aku cuma ingin didengar sebentar." Jika sulit bicara langsung, kamu boleh mengirim pesan atau meminta satu orang tepercaya menemani.\n\nSiapa yang paling mungkin bisa mendengarkanmu dengan tenang: orang tua, kakak, saudara, guru, atau teman?',
  sad: 'Terima kasih sudah jujur. Saat sedang tidak baik-baik saja, kamu tidak perlu memaksa diri terlihat kuat di depan semua orang.\n\nUntuk beberapa menit ke depan, coba lakukan satu bentuk perawatan kecil: pindah ke tempat yang lebih nyaman, minum air, mandi, atau kirim pesan sederhana kepada seseorang: "Aku lagi butuh ditemani ngobrol."\n\nAku ingin memahami dengan lebih baik: perasaan ini sudah datang sejak kapan, dan apa yang paling kamu butuhkan hari ini?',
  general: 'Terima kasih sudah bercerita. Perasaanmu layak didengar, bahkan kalau kamu belum bisa menjelaskan semuanya dengan rapi.\n\nKita bisa mulai dari hal kecil: coba beri nama perasaan yang paling kuat sekarang, lalu nilai intensitasnya dari 1 sampai 5. Setelah itu, pilih satu kebutuhan sederhana - istirahat, didengar, ditemani, atau dibantu mencari solusi.\n\nBagian mana yang ingin kamu ceritakan lebih dulu?',
}

function responseFor(text) {
  if (crisisWords.test(text)) return replyTemplates.crisis
  if (/diejek|ejek|bully|dibully|perundung|dihina|dipermalukan/i.test(text)) return replyTemplates.bullying
  if (/panik|cemas|sesak|deg.?degan|takut|gelisah/i.test(text)) return replyTemplates.panic
  if (/kewalahan|capek|lelah|tertekan|banyak tugas|burnout/i.test(text)) return replyTemplates.overwhelmed
  if (/orang tua|keluarga|ibu|ayah|rumah|dimarahi/i.test(text)) return replyTemplates.family
  if (/sedih|sendiri|kesepian|tidak baik|menangis|putus asa/i.test(text)) return replyTemplates.sad
  return replyTemplates.general
}

const newChat = () => ({ id: String(Date.now()) + '-' + Math.random(), title: 'Percakapan baru', updatedAt: Date.now(), messages: [] })

function loadChats() {
  const saved = JSON.parse(localStorage.getItem('aegis-chat-conversations') || 'null')
  if (Array.isArray(saved) && saved.length) return saved
  const legacy = JSON.parse(localStorage.getItem('aegis-chat-history') || 'null')
  const chat = newChat()
  if (Array.isArray(legacy) && legacy.length) chat.messages = legacy
  return [chat]
}

export default function AiAssistant() {
  const saved = JSON.parse(localStorage.getItem('aegis-screening') || 'null')
  const level = saved?.level?.label || 'Belum diketahui'
  const [conversations, setConversations] = useState(() => loadChats())
  const [activeId, setActiveId] = useState(() => loadChats()[0].id)
  const [text, setText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const end = useRef(null)
  const active = conversations.find((chat) => chat.id === activeId) || conversations[0]

  useEffect(() => {
    localStorage.setItem('aegis-chat-conversations', JSON.stringify(conversations))
    if (active) localStorage.setItem('aegis-chat-history', JSON.stringify(active.messages))
    end.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, active])

  function createChat() {
    const chat = newChat()
    setConversations((list) => [chat, ...list])
    setActiveId(chat.id)
    setText('')
    setSidebarOpen(false)
  }

  function deleteChat(id) {
    setConversations((list) => {
      const next = list.filter((item) => item.id !== id)
      if (!next.length) {
        const fresh = newChat()
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  function updateMessages(id, update) {
    setConversations((list) => list.map((chat) => chat.id === id ? {
      ...chat, messages: update(chat.messages), updatedAt: Date.now(),
    } : chat))
  }

  async function send(value = text) {
    const clean = value.trim()
    if (!clean || !active) return
    const title = active.title === 'Percakapan baru' ? clean.slice(0, 37) + (clean.length > 37 ? '...' : '') : active.title
    const history = active.messages.slice(-6).map(({ role, text: message }) => ({ role, text: message }))
    setConversations((list) => list.map((chat) => chat.id === active.id ? {
      ...chat,
      title,
      updatedAt: Date.now(),
      messages: [...chat.messages, { role: 'user', text: clean }, { role: 'bot', text: 'Aegis sedang menyiapkan respons yang lebih personal...', pending: true }],
    } : chat))
    setText('')
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, level, history }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      updateMessages(active.id, (items) => [...items.slice(0, -1), { role: 'bot', text: data.text }])
    } catch {
      updateMessages(active.id, (items) => [...items.slice(0, -1), { role: 'bot', text: responseFor(clean) }])
    }
  }

  return (
    <main className="chat-page chatgpt-layout">
      <aside className={'chat-sidebar ' + (sidebarOpen ? 'mobile-open' : '')}>
        <div className="sidebar-head"><a className="brand" href="#beranda"><span className="brand-mark"><ShieldCheck size={20} /></span><span>Aegis</span></a><button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={19} /></button></div>
        <button className="new-chat" onClick={createChat}><Plus size={18} /> Percakapan baru</button>
        <p className="history-label">RIWAYAT PERCAKAPAN</p>
        <div className="conversation-list">{conversations.slice().sort((a, b) => b.updatedAt - a.updatedAt).map((chat) => <div className={'conversation ' + (chat.id === active?.id ? 'active' : '')} key={chat.id}><button onClick={() => { setActiveId(chat.id); setSidebarOpen(false) }}><MessageSquare size={16} /><span>{chat.title}</span></button><button className="delete-chat" onClick={() => deleteChat(chat.id)} aria-label="Hapus percakapan"><Trash2 size={15} /></button></div>)}</div>
        <div className="sidebar-foot"><Heart size={15} /> Ruang dukungan privat<br /><small>Riwayat tersimpan di perangkat ini</small></div>
      </aside>
      <section className="chat-main">
        <header className="chat-top"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button><div><b>Aegis AI</b><span><i /> Dukungan awal siap</span></div><a href="#dashboard">Dashboard</a></header>
        <section className="chat-shell">
          <div className="chat-title compact"><span className="quiz-eyebrow"><Bot size={16} /> Dukungan emosional awal</span><h1>Aegis AI</h1><p>Teman untuk memahami perasaan, menenangkan diri, dan memilih langkah awal yang aman.</p></div>
          <div className="chat-disclaimer"><Heart size={16} /> Dukungan awal, bukan diagnosis atau pengganti psikolog/layanan darurat.</div>
          <div className="messages">{active?.messages.length ? active.messages.map((message, i) => <div className={'bubble ' + message.role + (message.pending ? ' pending' : '')} key={i}>{message.role === 'bot' && <Bot size={16} />}<span>{message.text}</span></div>) : <div className="empty-chat"><Bot size={26} /><b>Belum ada percakapan.</b><span>Ceritakan apa yang sedang kamu alami. Kita akan mencari satu langkah kecil yang bisa dilakukan sekarang.</span></div>}<div ref={end} /></div>
          <div className="suggestions">{['Aku sedang diejek', 'Bantu aku tenang sebentar', 'Aku merasa kewalahan', 'Aku ingin bicara dengan orang tua'].map((item) => <button key={item} onClick={() => send(item)}>{item}</button>)}</div>
          <form className="chat-input" onSubmit={(event) => { event.preventDefault(); send() }}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Tulis yang ingin kamu ceritakan..." /><button aria-label="Kirim"><Send size={18} /></button></form>
          <a className="safety-access chat-safety" href="#bantuan-aegis"><AlertTriangle size={17} /><span><b>Butuh bantuan segera?</b> Pelajari pilihan bantuan keselamatan.</span></a>
        </section>
      </section>
    </main>
  )
}
