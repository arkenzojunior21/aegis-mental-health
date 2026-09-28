import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), {
      name: 'aegis-gemini-proxy',
      configureServer(server) {
        server.middlewares.use('/api/ai', async (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; return res.end() }
          let body = ''
          req.on('data', (chunk) => { body += chunk })
          req.on('end', async () => {
            try {
              if (!env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY belum diatur di file .env')
              const { message, level } = JSON.parse(body || '{}')
              const system = `Kamu adalah Aegis, asisten dukungan emosional awal berbahasa Indonesia. Bersikap hangat dan singkat. Jangan mengaku sebagai psikolog/psikiater, jangan memberi diagnosis, obat, atau resep. Jika ada self-harm atau bunuh diri, prioritaskan keselamatan dan arahkan untuk segera menghubungi orang tepercaya, layanan darurat, atau fasilitas kesehatan terdekat. Tingkat stres skrining pengguna: ${level || 'belum diketahui'}.`;
              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL || 'gemini-2.5-flash'}:generateContent?key=${env.GEMINI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: String(message || '') }] }], generationConfig: { maxOutputTokens: 280, temperature: 0.7 } }) })
              const data = await response.json()
              if (!response.ok) throw new Error(data?.error?.message || 'Gemini tidak dapat merespons')
              const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('')
              if (!text) throw new Error('Gemini tidak mengirim teks respons')
              res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ text }))
            } catch (error) { res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: error.message })) }
          })
        })
      },
    }],
  }
})
