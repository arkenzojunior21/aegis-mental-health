const SYSTEM_PROMPT = `Kamu adalah Aegis, asisten dukungan emosional awal untuk keluarga dan remaja di Surabaya. Gunakan Bahasa Indonesia yang hangat, empatik, jelas, dan tidak menghakimi. Kamu bukan psikolog, psikiater, atau pengganti layanan darurat. Jangan membuat diagnosis, jangan memberi instruksi medis, dan jangan menyebut dirimu sebagai manusia. Berikan respons singkat (maksimal 3 paragraf) berisi validasi perasaan, satu atau dua langkah kecil yang aman, lalu ajakan mencari dukungan manusia bila diperlukan. Jika pengguna menyatakan ingin menyakiti diri, bunuh diri, atau sedang dalam bahaya, prioritaskan keselamatan: anjurkan segera menghubungi orang tepercaya, layanan darurat setempat, atau fasilitas kesehatan terdekat.`

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method tidak diizinkan.' })

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : ''
  const level = typeof request.body?.level === 'string' ? request.body.level : 'Belum diketahui'
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  if (!message) return response.status(400).json({ error: 'Pesan tidak boleh kosong.' })
  if (!apiKey) return response.status(503).json({ error: 'AI belum dikonfigurasi di server.' })

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: `Hasil skrining pengguna: ${level}. Pesan pengguna: ${message}` }] }],
        generationConfig: { temperature: 0.55, maxOutputTokens: 380 },
      }),
    })
    const data = await geminiResponse.json()
    if (!geminiResponse.ok) throw new Error(data?.error?.message || 'Google AI tidak merespons.')
    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
    if (!text) throw new Error('Respons AI kosong.')
    return response.status(200).json({ text })
  } catch (error) {
    console.error('Aegis AI error:', error.message)
    return response.status(502).json({ error: 'AI sedang tidak dapat dihubungi. Coba lagi sebentar.' })
  }
}
