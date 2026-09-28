# Ringkasan Aplikasi Aegis untuk Review AI

## Prompt untuk AI Reviewer

> Saya sedang membuat prototype web bernama **Aegis — Perisai Kesehatan Mental Keluarga** untuk kebutuhan penilaian. Tolong review aplikasi ini secara kritis sebagai Product Manager, UI/UX Designer, Full-Stack Engineer, dan juri kompetisi. Identifikasi kekurangan paling penting, risiko, prioritas perbaikan, fitur yang sebaiknya ditambah, serta saran agar prototype lebih meyakinkan. Berikan rekomendasi yang realistis untuk dikerjakan sebelum demo/presentasi. Jangan menyarankan fitur yang terlalu besar tanpa menjelaskan prioritasnya.

---

## 1. Gambaran Produk

**Nama:** Aegis  
**Tagline:** Perisai Kesehatan Mental Keluarga  
**Target pengguna:** Orang tua dan remaja, terutama konteks keluarga di Surabaya.  
**Tujuan:** Membantu pengguna mengenali stres lebih awal, mendapatkan dukungan emosional awal, menjalankan latihan harian, dan mencari konseling secara semi-anonim.

Aegis bukan alat diagnosis medis dan bukan layanan darurat. Aplikasi memberi dukungan awal dengan bahasa yang tidak menghakimi serta menempatkan privasi sebagai nilai utama.

## 2. Teknologi yang Digunakan

- Frontend: React + Vite
- Styling: CSS custom + Lucide React icons
- Routing: hash routing (`#dashboard`, `#skrining`, dan seterusnya)
- Penyimpanan prototype: `localStorage` browser
- AI: Google Gemini melalui endpoint serverless Vercel `api/ai.js`
- Deployment target: Vercel
- Database yang direncanakan: MySQL/Aiven

## 3. Halaman yang Sudah Ada

| Halaman | Route | Fungsi |
|---|---|---|
| Landing Page | `#beranda` | Menjelaskan tujuan, nilai privasi, dan gambaran fitur Aegis. |
| Dashboard | `#dashboard` | Pusat fitur siap pakai; pengguna dapat memilih fitur tanpa harus menyelesaikan fitur lain. |
| Skrining Stres | `#skrining` | Kuesioner 40 pertanyaan dengan progress dan kalkulasi tingkat stres. |
| Hasil Skrining | `#hasil` | Menampilkan kategori stres Ringan, Sedang, atau Tinggi serta rekomendasi awal. |
| AI Assistant | `#ai-chat` | Chat suportif dengan riwayat beberapa percakapan. |
| Latihan Harian | `#modul` | Program latihan 7 hari yang menyesuaikan kategori stres. |
| Konseling Privat | `#konseling` | Katalog psikolog demo, mode konsultasi, jadwal, dan booking dengan Alias ID. |
| Privasi | `#privasi` | Menjelaskan model privasi semi-anonim. |
| Detail Fitur | `#fitur-*` | Menjelaskan tujuan, alur, dan contoh output tiap fitur. |
| Login / Registrasi | `#login`, `#register` | Login dan registrasi demo. |
| Admin Demo | `#admin` | Ilustrasi pemetaan alias dan data terenkripsi untuk demo. |

## 4. Fitur Utama dan Cara Kerjanya

### A. Dashboard fitur

Dashboard merupakan pusat penggunaan aplikasi. Pengguna tidak dikunci ke satu alur. Mereka dapat langsung memilih Skrining, AI Assistant, Latihan Harian, atau Konseling.

### B. Skrining stres 40 pertanyaan

1. Pengguna membuka Skrining.
2. Menjawab pertanyaan secara bertahap.
3. Aplikasi menghitung skor otomatis.
4. Skor diklasifikasikan menjadi Ringan, Sedang, atau Tinggi.
5. Hasil disimpan lokal dan digunakan sebagai konteks rekomendasi berikutnya.

### C. Hasil dan rekomendasi

Hasil skrining menjelaskan tingkat stres dengan bahasa sederhana. Pengguna diarahkan ke latihan harian, AI Assistant, atau konseling sesuai kebutuhan. Hasil ini bukan diagnosis medis.

### D. AI Assistant 24/7

1. Pengguna membuka AI Assistant dari Dashboard.
2. Pengguna dapat membuat percakapan baru atau membuka riwayat sebelumnya.
3. Pesan dikirim ke endpoint `/api/ai`.
4. Endpoint menggunakan Google Gemini jika `GEMINI_API_KEY` sudah dimasukkan ke Environment Variables Vercel.
5. Jika AI tidak dapat dihubungi, aplikasi memakai respons cadangan demo agar pengalaman tidak berhenti.

AI diberi instruksi untuk bersikap empatik, tidak mendiagnosis, dan menekankan keselamatan ketika mendeteksi kondisi berbahaya.

### E. Latihan Harian 7 Hari

Latihan tersedia untuk kategori Ringan, Sedang, dan Tinggi.

- Setiap kategori memiliki 7 hari aktivitas berbeda.
- Contoh aktivitas: napas terarah, grounding, refleksi, komunikasi, peregangan, perawatan diri, dan rencana dukungan.
- Pengguna dapat menandai latihan selesai.
- Progres latihan disimpan di `localStorage`.
- Untuk tingkat stres Tinggi, ada catatan keselamatan tambahan.

### F. Konseling semi-anonim

1. Aplikasi membuat Alias ID seperti `Keluarga-A123`.
2. Pengguna memilih salah satu psikolog demo Surabaya.
3. Pengguna memilih mode sesi: online, tatap muka, atau hybrid.
4. Pengguna memilih jadwal yang tersedia dan menulis kebutuhan singkat opsional.
5. Booking disimpan lokal dengan status `Menunggu konfirmasi`.

Saat ini tersedia 9 psikolog demo dengan spesialisasi, lokasi, rating, biaya, mode sesi, dan jadwal berbeda.

### G. Privasi semi-anonim

Konsep yang ditampilkan di aplikasi:

- Publik tidak dapat melihat profil pengguna.
- Psikolog seharusnya hanya melihat Alias ID, kebutuhan sesi, dan jadwal.
- Identitas asli seharusnya disimpan terpisah dan dienkripsi di server.
- Halaman Admin hanya simulasi visual untuk menjelaskan konsep tersebut.

## 5. Workflow Pengguna

```text
Landing Page
    ↓
Dashboard fitur
    ├── Skrining 40 pertanyaan → Hasil stres → Latihan / AI / Konseling
    ├── AI Assistant → Percakapan baru atau riwayat chat
    ├── Latihan Harian → Pilih Hari 1–7 → Tandai selesai
    └── Konseling Privat → Pilih psikolog → Pilih jadwal → Booking berhasil
```

Pengguna juga dapat membuka AI, latihan, atau konseling langsung dari Dashboard tanpa mengerjakan skrining.

## 6. Data yang Saat Ini Disimpan

| Data | Lokasi saat ini | Catatan |
|---|---|---|
| Akun login/register | `localStorage` | Hanya demo; password belum aman untuk produksi. |
| Sesi login | `localStorage` | Hanya berlaku di browser/perangkat yang sama. |
| Hasil skrining | `localStorage` | Dipakai untuk menyesuaikan rekomendasi dan latihan. |
| Progres latihan | `localStorage` | Tidak tersinkron antar perangkat. |
| Riwayat AI | `localStorage` | Tidak tersinkron antar perangkat. |
| Alias dan booking | `localStorage` | Booking belum masuk ke database/psikolog nyata. |

## 7. Status Database

Schema MySQL sudah tersedia di folder `database/`, dan Aiven MySQL pernah dipilih sebagai target hosting database.

Namun, **database belum benar-benar terhubung ke aplikasi**. Saat ini belum ada:

- API backend CRUD untuk pengguna, skrining, chat, dan booking.
- Koneksi MySQL aman dari server Vercel.
- Hash password dengan bcrypt/argon2.
- Autentikasi berbasis token/session aman.
- Enkripsi data identitas nyata.

Karena itu aplikasi saat ini adalah **prototype frontend interaktif yang siap didemokan**, bukan layanan kesehatan mental produksi.

## 8. Status Deploy Vercel

Sudah disiapkan:

- `vercel.json` untuk build Vite.
- `api/ai.js` sebagai Vercel Serverless Function untuk Google Gemini.
- `.env.example` untuk contoh environment variable.
- `DEPLOY_VERCEL.md` sebagai panduan deploy.

Sebelum deploy, perlu menambahkan di Vercel:

```env
GEMINI_API_KEY=API_KEY_DARI_GOOGLE_AI_STUDIO
GEMINI_MODEL=gemini-2.5-flash
```

## 9. Batasan Penting untuk Reviewer

1. Aplikasi memiliki konteks kesehatan mental, sehingga AI tidak boleh diposisikan sebagai psikolog/psikiater atau pemberi diagnosis.
2. Fitur emergency sekarang berupa pesan/arahan keselamatan, belum integrasi hotline atau layanan darurat nyata.
3. Katalog psikolog adalah data demo, bukan daftar tenaga profesional yang sudah diverifikasi.
4. Privasi semi-anonim masih berupa desain dan simulasi UI karena database/backend produksi belum diimplementasikan.
5. AI Gemini membutuhkan API key dan kuota aktif pada Vercel agar respons AI nyata berjalan.

## 10. Pertanyaan yang Ingin Dijawab oleh AI Reviewer

1. Apa 5 kekurangan paling penting yang harus diperbaiki sebelum penilaian?
2. Apakah workflow dari Landing → Dashboard → fitur sudah jelas untuk juri baru?
3. Apa fitur kecil dengan dampak besar yang paling layak ditambahkan dalam waktu singkat?
4. Bagian mana yang berisiko dianggap hanya mockup, bukan prototype fungsional?
5. Bagaimana cara menjelaskan batasan AI, privasi, dan database secara jujur tetapi tetap meyakinkan saat presentasi?
6. Apa yang perlu diperbaiki dalam UX mobile, visual hierarchy, dan accessibility?
7. Apakah arsitektur Vercel + Gemini + MySQL/Aiven tepat untuk tahap berikutnya? Jika ya, urutkan implementasi backend yang paling penting.
