# Handoff Terbaru — Aegis

Dokumen ini merangkum status terkini proyek **Aegis — Perisai Kesehatan Mental Keluarga** agar dapat dilanjutkan pada akun lain.

## 1. Lokasi dan menjalankan proyek

**Folder proyek:**

```text
C:\Users\Junior\Documents\Data junior\Exploraition
```

**Menjalankan aplikasi:**

```powershell
cd "C:\Users\Junior\Documents\Data junior\Exploraition"
npm install
npm run dev -- --host 0.0.0.0
```

Untuk membuka dari HP yang memakai hotspot/jaringan sama, gunakan:

```text
http://IP_LAPTOP:5173
```

Lihat IP laptop dengan:

```powershell
ipconfig
```

Build produksi:

```powershell
npm run build
```

Build terakhir berhasil.

## 2. Stack

- React + Vite.
- JavaScript/JSX.
- CSS custom utama dalam `src/styles.css`.
- Tailwind CSS sudah dikonfigurasi, tetapi belum menjadi styling utama.
- Lucide React untuk ikon.
- `localStorage` untuk data demo saat ini.
- `mysql2` sudah terpasang, tetapi belum dipakai karena backend/database hosting belum dikonfigurasi.
- Google Gemini API melalui Google AI Studio sudah disiapkan pada Vite dev middleware.

## 3. Struktur penting

```text
src/
├── data/
│   ├── dailyModules.js
│   ├── psychologists.js
│   └── screeningQuestions.js
├── pages/
│   ├── AdminDashboard.jsx
│   ├── AiAssistant.jsx
│   ├── AuthPage.jsx
│   ├── Counseling.jsx
│   ├── DailyModule.jsx
│   ├── FeatureOverview.jsx
│   ├── InfoPage.jsx
│   ├── PrivacyPage.jsx
│   ├── ResultDashboard.jsx
│   └── Screening.jsx
├── App.jsx
├── main.jsx
└── styles.css

database/
└── aegis_schema.sql

public/
└── manifest.webmanifest

.env.example
vite.config.js
```

## 4. Fitur yang telah dibuat

### Landing Page

- Vibe calming, soft teal, soft blue, dan mobile-first.
- Hero untuk keluarga Surabaya.
- Empat fitur utama: Tes, AI Assistant, Modul Harian, Konseling Anonim.
- Section Tentang Aegis ditambah agar halaman tidak kosong.
- Section ringkas privasi.

### Halaman pengenalan empat fitur

Kartu pada Landing Page tidak lagi langsung menuju fitur. Setiap kartu membuka halaman penjelasan terlebih dahulu:

| Kartu | Route pengenalan | Route fitur utama |
|---|---|---|
| Tes 15 Menit | `#fitur-skrining` | `#skrining` |
| AI Assistant | `#fitur-ai` | `#ai-chat` |
| Panduan Rumahan | `#fitur-modul` | `#modul` |
| Konseling Anonim | `#fitur-konseling` | `#konseling` |

Setiap pengenalan berisi manfaat, tiga langkah, contoh output, disclaimer, dan tombol lanjut.

### Skrining stres

- Route: `#skrining`.
- 40 pertanyaan, satu per satu, dengan progress bar.
- Pilihan skor: Tidak pernah `0`, Jarang `1`, Sering `2`, Hampir selalu `3`.
- Skor maksimum `120`.
- Kategori demo:
  - Ringan: `0–40`
  - Sedang: `41–80`
  - Tinggi: `81–120`
- Hasil tersimpan di `localStorage` key `aegis-screening`.
- Route hasil: `#hasil`.
- Jangan menyebut skrining ini sebagai diagnosis atau instrumen klinis tervalidasi.

### Modul harian

- Route: `#modul`.
- Tersedia modul Ringan/Sedang/Tinggi.
- Saat ini masih tiga latihan awal per kategori.
- Progres tersimpan pada `aegis-module-complete`.
- Tombol kembali sudah diarahkan ke Beranda.
- Pekerjaan yang belum selesai: perluas menjadi minimal tujuh hari, jurnal textarea, progres harian, dan print-friendly.

### AI Assistant

- Route: `#ai-chat`.
- Memiliki suggested prompts, disclaimer medis, dan fallback mock.
- Ada keyword crisis guardrail untuk indikasi self-harm/bunuh diri.
- Riwayat chat demo disimpan di `aegis-chat-history`.
- Bila Gemini gagal atau key belum ada, aplikasi memakai respons mock lokal.
- AI diposisikan sebagai dukungan emosional awal, **bukan psikolog/psikiater**, tidak memberi diagnosis atau resep.

### Konseling semi-anonim

- Route: `#konseling`.
- Empat psikolog demo Surabaya dalam `src/data/psychologists.js`.
- Alias otomatis seperti `Keluarga-A123` disimpan pada `aegis-user-alias`.
- Pilih psikolog, mode, slot, catatan, lalu konfirmasi.
- Booking tersimpan pada `aegis-bookings`.
- Semua tombol kembali dari konseling, termasuk halaman konfirmasi, sekarang menuju Beranda.

### Privacy Page

- Route: `#privasi`.
- Menjelaskan Three-Tier Privacy Model:
  1. Public View: tanpa profil publik/PII.
  2. Psychologist View: Alias ID dan data sesi relevan.
  3. Server View: identitas dipisah dan perlu enkripsi nyata.
- Berisi daftar data yang terlihat dan tidak terlihat oleh psikolog.
- Menyatakan jelas bahwa localStorage hanyalah demo.

### Halaman navbar

Navbar membuka halaman mandiri:

| Menu | Route |
|---|---|
| Tentang Aegis | `#tentang-aegis` |
| Fitur | `#daftar-fitur` |
| AI Assistant | `#ai-chat` |
| Konseling | `#konseling` |
| Privasi | `#privasi` |
| Bantuan | `#bantuan-aegis` |

### Login/Registrasi demo

- Route login: `#login`.
- Route register: `#register`.
- Dapat diakses dari tombol **Masuk** di Landing Page desktop.
- Menggunakan `aegis-users`, `aegis-session`, dan `aegis-user-alias` pada localStorage.
- Ini hanya demo; kata sandi belum aman karena masih berada di localStorage.
- Produksi perlu backend, hashing password, session/JWT/secure cookie, reset password, dan verifikasi email.

### Admin Dashboard mock

- Route: `#admin`.
- Visualisasi Three-Tier Privacy Model, metric demo, ciphertext palsu, audit log, dan modal Emergency Override.
- Label jelas: **DEMO / MOCK SERVER**.
- Tidak membuka PII asli.

### PWA dasar

- `public/manifest.webmanifest` sudah dibuat dan sudah dirujuk di `index.html`.
- Service worker/offline fallback belum dibuat.

## 5. Google Gemini API

### Status kode

`vite.config.js` memiliki middleware dev endpoint:

```text
POST /api/ai
```

Endpoint ini memanggil Google Gemini menggunakan:

```text
gemini-2.5-flash
```

Frontend di `src/pages/AiAssistant.jsx` mengirim pesan ke endpoint ini. Jika gagal, UI memakai fallback mock.

### Konfigurasi API key

Jangan pernah taruh key di JSX, Git, atau chat.

```powershell
Copy-Item .env.example .env
notepad .env
```

Isi `.env`:

```env
GEMINI_API_KEY=API_KEY_DARI_GOOGLE_AI_STUDIO
GEMINI_MODEL=gemini-2.5-flash
```

Setelah mengubah `.env`, hentikan Vite (`Ctrl+C`) lalu jalankan ulang:

```powershell
npm run dev -- --host 0.0.0.0
```

Catatan:

- Free Tier Google Gemini cocok untuk prototype, tetapi memiliki kuota RPM/TPM/RPD dan bisa berubah.
- Jangan mengirim PII atau data klinis sensitif ke Gemini Free Tier.
- Middleware ini hanya berjalan pada `npm run dev`. Saat production/static deploy, perlu backend Node/PHP terpisah.

## 6. Database MySQL

### File SQL

```text
database/aegis_schema.sql
```

Skema berisi:

- `users`, `user_aliases`, `user_pii`
- `screenings`
- `daily_module_progress`
- `ai_chat_sessions`, `ai_chat_messages`
- `psychologist_profiles`, `psychologist_slots`
- `counseling_bookings`
- `emergency_events`, `audit_logs`

Tabel `user_pii` sengaja dipisahkan dari alias/sesi. Field PII memakai nama `*_encrypted`; enkripsi harus dilakukan backend sebelum menyimpan data, bukan oleh SQL schema saja.

### Nama database

Nama yang diinginkan pengguna:

```text
db_aegis
```

Namun file SQL sekarang **tidak membuat database** (`CREATE DATABASE` sudah dihapus) agar kompatibel dengan shared hosting yang menolak akses `CREATE DATABASE`.

### Import SQL di shared hosting

1. Buat database melalui hosting control panel.
2. Nama database dapat memiliki prefix penyedia, contohnya `if0_43033218_db_aegis`.
3. Buka phpMyAdmin.
4. Pilih database itu di sidebar kiri terlebih dahulu.
5. Import `database/aegis_schema.sql`.

Error sebelumnya:

```text
#1044 Access denied ... to database 'db_aegis'
```

Terjadi karena user hosting tidak punya hak membuat database melalui SQL.

## 7. Status database integration

**Belum tersambung sepenuhnya.** Semua fitur UI masih menggunakan `localStorage`.

Alasan:

- React/Vite tidak boleh mengakses MySQL secara langsung karena kredensial database dapat bocor.
- Perlu backend API.
- Shared hosting biasa umumnya tidak mengizinkan Node/Vite di laptop untuk konek langsung ke MySQL hosting; umumnya perlu PHP API pada hosting yang sama.

`mysql2` telah dipasang sebagai persiapan, tetapi belum digunakan pada kode produksi.

### Pilihan arsitektur berikutnya

**Pilihan direkomendasikan jika MySQL berada di shared hosting:**

```text
React/Vite frontend → PHP REST API pada shared hosting → MySQL
```

**Jika memakai hosting Node seperti Aiven Runtime/Render/Railway:**

```text
React/Vite frontend → Node.js/Express API → MySQL hosting
```

Pengguna saat ini sedang melihat layanan hosting lain yang menawarkan MySQL dan Aiven Runtime. Untuk arsitektur Node, pilih:

1. **MySQL** untuk database.
2. **Aiven Runtime** untuk API Node.js.

Database saja tidak cukup; API Runtime dibutuhkan agar frontend tidak langsung menyimpan kredensial MySQL.

## 8. Pekerjaan lanjutan paling penting

1. Tentukan backend: PHP API untuk shared hosting atau Node/Express untuk Aiven Runtime.
2. Buat konfigurasi environment server, misalnya:

```env
DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_SSL=true
GEMINI_API_KEY=
```

3. Implementasikan endpoint aman:
   - register/login/logout
   - session/JWT atau secure cookie
   - screening CRUD
   - module progress/journal CRUD
   - chat session/message CRUD
   - psychologist list/slots
   - booking CRUD
   - admin audit/emergency dengan role authorization
4. Refactor semua `localStorage` ke API. Boleh menyisakan localStorage hanya sebagai cache/offline draft.
5. Hash password menggunakan Argon2/bcrypt di backend; jangan simpan plaintext.
6. Enkripsi PII dan konten sensitif sebelum insert ke MySQL, kelola kunci di server secret manager.
7. Terapkan CORS, rate limiting, validasi input, role-based authorization, HTTPS, audit logging, dan policy retensi data.
8. Perluas modul menjadi 7 hari dan jurnal seperti requirement awal.
9. Tambahkan empty state yang lebih baik jika hasil skrining belum ada.
10. Tambahkan service worker hanya setelah alur backend stabil.

## 9. Aturan produk dan keselamatan

- Jangan mengklaim skrining atau AI sebagai diagnosis medis.
- AI tidak boleh berperan sebagai psikiater/psikolog atau memberi obat/resep.
- Indikasi self-harm/bunuh diri harus memprioritaskan keselamatan, orang tepercaya, fasilitas kesehatan, dan layanan darurat setempat.
- Jangan masukkan PII pengguna ke prompt Gemini, terutama di Free Tier.
- Profil psikolog di aplikasi saat ini adalah data demo; wajib diverifikasi sebelum dipublikasikan.

## 10. Perintah berguna

```powershell
# Jalankan local development
npm run dev -- --host 0.0.0.0

# Build / verifikasi
npm run build

# Cek IP hotspot laptop
ipconfig
```
