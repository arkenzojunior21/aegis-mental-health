# Aegis — Perisai Kesehatan Mental Keluarga

## 1. Ringkasan aplikasi

**Aegis** adalah aplikasi web mobile-first untuk membantu keluarga—terutama orang tua dan remaja di Surabaya—memulai percakapan tentang kesehatan mental dengan cara yang lebih aman, tenang, dan minim stigma.

Aplikasi ini bukan alat diagnosis medis. Aegis memberi dukungan awal berupa skrining, latihan rumahan, ruang refleksi, asisten percakapan, dan jalur konseling privat. Untuk kondisi darurat atau risiko keselamatan, pengguna perlu menghubungi orang dewasa tepercaya, layanan darurat, atau fasilitas kesehatan terdekat.

Tagline: **Perisai Kesehatan Mental Keluarga**.

## 2. Target pengguna

| Pengguna | Kebutuhan yang dibantu |
| --- | --- |
| Remaja | Mengenali emosi, menulis refleksi, melakukan latihan singkat, dan mencari ruang bicara yang aman. |
| Orang tua/wali | Memahami sinyal stres dalam keluarga, melihat panduan rumahan, dan mencari dukungan profesional. |
| Keluarga Surabaya | Mengakses katalog konseling dengan konteks psikolog lokal Surabaya. |
| Admin demo | Melihat contoh cara data semi-anonim dipisahkan serta simulasi protokol darurat. |
| Juri/penguji | Menelusuri alur aplikasi dari registrasi hingga fitur dukungan tanpa harus memasang aplikasi. |

## 3. Konsep utama: privasi semi-anonim

Aegis membuat **Alias ID** seperti `Keluarga-A123`. Alias ini yang ditampilkan dalam konteks konseling dan tampilan publik/psikolog.

- Username dipakai untuk login.
- Nama lengkap, nama panggilan, dan umur dipakai untuk profil pengguna pada prototype.
- Psikolog/public view seharusnya hanya menggunakan Alias ID, bukan identitas asli.
- Tabel `user_aliases` dipisahkan dari data akun.
- Dashboard Admin adalah simulasi visual: *Emergency Override Protocol* dicatat sebagai audit dan tidak otomatis membocorkan identitas.

> Catatan keamanan: versi prototype belum menerapkan enkripsi PII tingkat produksi dan belum memiliki verifikasi sesi pada setiap endpoint. Untuk produksi, gunakan autentikasi terverifikasi, enkripsi data sensitif, role-based access control, audit log server-side, consent management, serta tinjauan tenaga profesional.

## 4. Fitur aplikasi

### A. Login dan registrasi

Halaman awal wajib adalah Login/Register. Pada pendaftaran, pengguna mengisi:

- Nama lengkap
- Nama panggilan
- Umur (10–120 tahun)
- Username unik
- Kata sandi minimal 6 karakter

Sistem membuat alias keluarga otomatis dan menyimpan akun pada MySQL. Setelah masuk, sesi disimpan di browser untuk pengalaman prototype dan tombol **Keluar** tersedia pada Dashboard.

### B. Landing page

Landing page memperkenalkan misi Aegis, dukungan untuk keluarga Surabaya, prinsip keamanan, serta akses cepat ke fitur siap pakai.

### C. Dashboard

Dashboard berfungsi sebagai pusat navigasi. Pengguna dapat membuka skrining stres, latihan/panduan, AI Assistant, konseling privat, dan halaman privasi tanpa wajib menyelesaikan skrining terlebih dahulu.

### D. Skrining stres 15 menit

Skrining terdiri dari **40 pertanyaan** bertahap dengan indikator progres. Jawaban dihitung menjadi kategori:

- Ringan
- Sedang
- Tinggi

Hasil bersifat indikator dukungan awal, bukan diagnosis klinis.

### E. Dashboard hasil dan panduan rumahan

Setelah skrining, pengguna melihat ringkasan kategori stres dan rekomendasi langkah awal. Modul panduan rumahan menyesuaikan arah dukungan berdasarkan hasil skrining.

### F. Latihan harian

Tersedia latihan hingga satu minggu, seperti napas sadar, check-in emosi, refleksi singkat, jeda digital, dan komunikasi keluarga. Penyelesaian latihan disimpan secara lokal pada browser dalam versi saat ini.

### G. Ruang harian

Ruang harian menyediakan:

- Check-in suasana hati dan intensitas emosi
- Catatan opsional
- Journal pribadi
- Aktivitas kecil yang direkomendasikan
- Profil dan tautan bantuan

Check-in dan jurnal prototype tersimpan pada `localStorage` perangkat pengguna.

### H. AI Assistant 24/7

Antarmuka AI dibuat seperti percakapan modern: tersedia riwayat percakapan, percakapan baru, hapus riwayat, pesan cepat, dan disclaimer keselamatan.

Jika `GEMINI_API_KEY` tersedia di Vercel, endpoint `/api/ai` menghubungi Google Gemini. Jika API tidak tersedia/gagal, aplikasi memberi respons pendukung berbasis aturan sebagai fallback. AI tidak menggantikan psikolog, psikiater, atau layanan darurat.

### I. Konseling privat

Pengguna dapat melihat katalog psikolog demo Surabaya, spesialisasi, pilihan mode konsultasi, jadwal, serta membuat booking menggunakan Alias ID. Booking versi sekarang tersimpan di browser dan katalog psikolog adalah data demo.

### J. Halaman privasi dan Admin/Server View

Halaman privasi menerangkan prinsip pemisahan data. Admin View menunjukkan contoh pemetaan:

- Public/Psychologist View: Alias ID
- Server/Admin View: data sensitif yang seharusnya terenkripsi
- Emergency Override: simulasi permintaan darurat yang dicatat

## 5. Alur penggunaan

```text
Register / Login
        ↓
Dashboard
        ├─ Skrining 40 pertanyaan → Hasil kategori → Panduan sesuai hasil
        ├─ Ruang harian → Check-in / Journal / Aktivitas
        ├─ AI Assistant → Percakapan dan riwayat lokal
        ├─ Konseling → Pilih psikolog → Pilih jadwal → Konfirmasi booking
        └─ Privasi / Admin demo → Memahami alias dan contoh protokol
```

## 6. Teknologi yang digunakan

| Lapisan | Teknologi | Fungsi |
| --- | --- | --- |
| Frontend | React | Membangun komponen dan state antarmuka. |
| Build tool | Vite | Menjalankan development server dan membuat build produksi. |
| Bahasa utama | JavaScript (ES Modules), JSX, HTML, CSS | Logika aplikasi, UI React, struktur halaman, dan desain visual. |
| Ikon | Lucide React | Ikon UI seperti perisai, chat, navigasi, dan status. |
| Routing | Hash routing browser | Navigasi halaman dengan URL seperti `#dashboard` dan `#ai-chat`. |
| API backend | Vercel Serverless Functions | Endpoint `/api/auth` dan `/api/ai`. |
| Database | MySQL 8 di Aiven | Menyimpan akun, alias, serta tabel pendukung skema Aegis. |
| Hosting | Vercel | Mempublikasikan frontend dan menjalankan API serverless. |
| AI | Google Gemini API | Respons AI Assistant apabila API key aktif. |
| Version control | Git dan GitHub | Menyimpan riwayat perubahan dan memicu deployment Vercel. |
| Penyimpanan lokal | Browser localStorage | State skrining, latihan, journal, chat, dan booking prototype. |

## 7. Data yang benar-benar tersimpan saat ini

| Data | Lokasi saat ini |
| --- | --- |
| Username, kata sandi yang di-hash, nama lengkap, nama panggilan, umur, alias | MySQL Aiven melalui endpoint Login/Register. |
| Sesi tampilan pengguna | localStorage browser. |
| Jawaban skrining dan hasil | localStorage browser. |
| Latihan, journal, check-in, riwayat AI, booking | localStorage browser. |
| Katalog psikolog | Data mock di source code. |
| Pesan AI | Dikirim ke Gemini ketika API key tersedia; riwayat UI masih localStorage. |

Ini berarti database sudah menjadi bagian nyata dari login/registrasi, tetapi belum semua fitur dipersistenkan ke MySQL. Langkah pengembangan lanjutan dapat memindahkan data skrining, chat, latihan, dan booking ke endpoint API aman.

## 8. Struktur proyek penting

```text
src/
  App.jsx                 # Router dan gerbang login
  pages/
    AuthPage.jsx          # Login dan registrasi
    Dashboard.jsx         # Pusat fitur
    Screening.jsx         # Skrining 40 pertanyaan
    ResultDashboard.jsx   # Hasil skrining
    DailyModule.jsx       # Latihan mingguan
    DailySpace.jsx        # Check-in dan journal
    AiAssistant.jsx       # UI asisten AI
    Counseling.jsx        # Katalog dan booking
    PrivacyPage.jsx       # Penjelasan privasi
    AdminDashboard.jsx    # Simulasi server/admin
api/
  auth.js                 # Endpoint username/login MySQL
  ai.js                   # Endpoint Google Gemini
database/
  aegis_schema.sql        # Skema baru untuk database kosong
  migrations/
    002_username_profile.sql  # Migrasi database Aiven yang sudah ada
```

## 9. Konfigurasi environment Vercel

Simpan seluruh nilai sensitif sebagai **Secret**, jangan pernah di GitHub:

```text
MYSQL_HOST
MYSQL_PORT
MYSQL_DATABASE
MYSQL_USER
MYSQL_PASSWORD
MYSQL_SSL_MODE
APP_SESSION_SECRET
GEMINI_API_KEY
GEMINI_MODEL
```

Nilai model yang digunakan:

```text
GEMINI_MODEL=gemini-2.5-flash
```

Untuk kebutuhan demo, variabel database dan session secret harus diaktifkan pada **Production and Preview** bila kedua jenis URL akan diuji.

## 10. Cara menjalankan lokal

```powershell
npm install
npm run dev
```

Vite akan menampilkan alamat lokal, biasanya `http://localhost:5173`.

Untuk mengakses dari ponsel pada Wi-Fi/hotspot yang sama:

```powershell
npm run dev -- --host 0.0.0.0
```

Lalu buka `http://IP-LAPTOP:5173` dari ponsel. Login API Vercel tidak otomatis berjalan di Vite lokal; untuk menguji endpoint serverless lokal gunakan Vercel CLI atau uji melalui deployment.

## 11. Deployment dan migrasi username

Sebelum kode username dipakai oleh Vercel, struktur MySQL lama harus dimigrasikan.

1. Pastikan file `.env` lokal masih berisi kredensial Aiven yang benar. Jika pernah membuat akun dengan versi email lama, gunakan akun baru setelah migrasi; akun lama diberi username sistem berbentuk `pengguna-ID`.
2. Jalankan dari terminal proyek:

   ```powershell
   npm run db:migrate:username
   ```

   Alternatifnya, buka MySQL Workbench dan jalankan isi [database/migrations/002_username_profile.sql](database/migrations/002_username_profile.sql) satu kali pada database `defaultdb`.

3. Pastikan terminal menampilkan `Berhasil. Login sekarang menggunakan username.`.
4. Commit dan push kode terbaru ke branch `main`.
5. Tunggu Vercel selesai deploy, kemudian uji Register dan Login dengan username.

Untuk database baru yang belum memiliki tabel, gunakan [database/aegis_schema.sql](database/aegis_schema.sql).

## 12. Batasan dan rekomendasi pengembangan

- Tambahkan endpoint autentikasi yang memverifikasi token pada semua API privat.
- Simpan skrining, latihan, journal, chat, dan booking ke MySQL melalui API terproteksi.
- Enkripsi nama lengkap dan data sensitif sebelum disimpan.
- Implementasikan pembatasan akses role admin/psikolog yang nyata.
- Verifikasi kredensial psikolog sebelum aplikasi digunakan publik.
- Tambahkan consent, kebijakan privasi, penghapusan akun, dan audit keamanan.
- Tambahkan PWA manifest dan service worker apabila aplikasi ingin dipasang seperti aplikasi mobile.
- Uji aksesibilitas, responsivitas, dan skenario krisis bersama ahli kesehatan mental.

## 13. Catatan untuk penilaian

Aegis menonjolkan kombinasi **dukungan awal kesehatan mental keluarga**, **alur fitur yang mudah dipahami**, serta konsep **semi-anonim berbasis Alias ID**. Implementasi saat ini sengaja diberi label prototype/demo untuk membedakan pengalaman UI yang sudah dapat diuji dari kebutuhan keamanan klinis yang wajib dipenuhi sebelum penggunaan nyata.
