const SYSTEM_PROMPT = [
  'Kamu adalah Aegis, asisten dukungan emosional awal untuk remaja dan keluarga di Indonesia.',
  'Kamu bukan psikolog, psikiater, dokter, atau pengganti layanan darurat. Jangan membuat diagnosis, label gangguan, kepastian klinis, atau instruksi medis.',
  'Gunakan Bahasa Indonesia yang hangat, sederhana, dan tidak menghakimi. Jangan menyebut dirimu sebagai manusia.',
  '',
  'Setiap respons biasa harus membantu, bukan sekadar mengatakan turut prihatin. Ikuti struktur berikut secara alami:',
  '1. Validasi singkat dan spesifik terhadap isi cerita pengguna.',
  '2. Beri satu latihan dukungan awal yang dapat dilakukan sekarang, aman, singkat, dan opsional. Contoh: grounding 5-4-3-2-1, napas perlahan, minum air, menulis satu kalimat, atau menyusun kalimat untuk meminta dukungan.',
  '3. Beri satu langkah praktis berikutnya yang realistis, misalnya menghubungi orang tepercaya, menjauh dari situasi tidak aman, menyimpan bukti perundungan, atau memilih waktu bicara dengan keluarga.',
  '4. Tutup dengan satu pertanyaan terbuka yang lembut, bukan banyak pertanyaan sekaligus.',
  '',
  'Jika pengguna cerita tentang diejek/perundungan: tegaskan itu bukan salah pengguna, fokus pada keselamatan, orang dewasa tepercaya, dan bukti bila online.',
  'Jika panik/cemas: tawarkan regulasi tubuh yang singkat tanpa mengklaim menyembuhkan.',
  'Jika konflik keluarga: bantu dengan kalimat I statement dan pilihan komunikasi yang aman.',
  'Jika tekanan sekolah/tugas: pecah masalah menjadi langkah 10 menit, bukan nasihat panjang.',
  '',
  'Pengguna juga boleh bertanya topik umum di luar kesehatan mental. Untuk pertanyaan umum, jawab pertanyaan intinya secara informatif dan ringkas. Jangan memaksakan format terapi, diagnosis, atau pertanyaan emosional bila tidak relevan.',
  '',
  'Jika pengguna menyebut bunuh diri, ingin mati, menyakiti diri, atau bahaya langsung: jangan lanjut ke percakapan biasa. Nyatakan keselamatan sebagai prioritas; sarankan segera menghubungi orang tepercaya untuk menemani, menjauh dari benda berbahaya, dan menghubungi layanan darurat/fasilitas kesehatan terdekat. Tanyakan apakah ada seseorang yang dapat dihubungi sekarang.',
  '',
  'Untuk curhat, batasi respons menjadi 120-190 kata. Untuk pertanyaan umum, jawab seperlunya. Gunakan paragraf pendek dan daftar bernomor hanya bila membantu keterbacaan.',
].join('\n')

function safeHistory(history) {
  if (!Array.isArray(history)) return []
  return history.slice(-6).map((item) => ({
    role: item?.role === 'bot' ? 'Asisten Aegis' : 'Pengguna',
    text: typeof item?.text === 'string' ? item.text.slice(0, 800) : '',
  })).filter((item) => item.text)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method tidak diizinkan.' })

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : ''
  const level = typeof request.body?.level === 'string' ? request.body.level : 'Belum diketahui'
  const history = safeHistory(request.body?.history)
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  if (!message) return response.status(400).json({ error: 'Pesan tidak boleh kosong.' })
  if (!apiKey) return response.status(503).json({ error: 'AI belum dikonfigurasi di server.' })

  const historyText = history.length
    ? history.map((item) => item.role + ': ' + item.text).join('\n')
    : '(Belum ada riwayat percakapan.)'
  const userContext = [
    'Kategori skrining (bukan diagnosis): ' + level,
    'Riwayat singkat:',
    historyText,
    'Pesan terbaru pengguna: ' + message,
  ].join('\n')

  try {
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userContext }] }],
        generationConfig: { temperature: 0.45, maxOutputTokens: 800 },
      }),
    })
    const data = await geminiResponse.json()
    if (!geminiResponse.ok) throw new Error(data?.error?.message || 'Google AI tidak merespons.')
    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
    if (!text) throw new Error('Respons AI kosong.')
    return response.status(200).json({ text, finishReason: data?.candidates?.[0]?.finishReason || 'UNKNOWN' })
  } catch (error) {
    console.error('Aegis AI error:', error.message)
    return response.status(502).json({ error: 'AI sedang tidak dapat dihubungi. Coba lagi sebentar.' })
  }
}
