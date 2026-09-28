# Handoff Proyek Aegis

## Peran dan tujuan

Bertindaklah sebagai Senior Full-Stack Developer dan Lead UI/UX Engineer. Lanjutkan aplikasi web mobile-first bernama **Aegis — Perisai Kesehatan Mental Keluarga** di proyek yang **sudah ada**. Jangan membuat proyek baru dan jangan menghapus fitur yang sudah berjalan.

## Lokasi proyek dan cara menjalankan

```powershell
cd "C:\Users\Junior\Documents\Data junior\Exploraition"
npm install
npm run dev -- --host 0.0.0.0
```

Untuk membuka aplikasi melalui HP yang terhubung pada hotspot sama, gunakan:

```text
http://10.119.91.115:5173
```

IP laptop dapat berubah; cek kembali dengan `ipconfig` bila diperlukan.

Verifikasi produksi:

```powershell
npm run build
```

## Teknologi

- Vite + React
- Tailwind CSS (terpasang dan terkonfigurasi)
- CSS custom di `src/styles.css`
- Lucide React untuk ikon
- React state dan `localStorage` untuk data demo
- Belum ada Supabase, backend, autentikasi, atau API AI nyata

## Struktur proyek saat ini

```text
src/
├── data/
│   ├── dailyModules.js
│   └── screeningQuestions.js
├── pages/
│   ├── DailyModule.jsx
│   ├── ResultDashboard.jsx
│   └── Screening.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

## Fitur selesai

### Landing Page

- Hero dengan nuansa calming, trustworthy, dan bebas stigma.
- CTA skrining stres 15 menit.
- Kartu fitur Tes 15 Menit, AI Assistant 24/7, Panduan Rumahan, dan Konseling Anonim.
- Penjelasan privasi semi-anonim.
- Desain responsif, mobile-first.

### Skrining stres

- Route: `#skrining`.
- 40 pertanyaan interaktif, satu pertanyaan per layar.
- Progress bar dan tombol kembali.
- Skala jawaban:
  - Tidak pernah: `0`
  - Jarang: `1`
  - Sering: `2`
  - Hampir selalu: `3`
- Skor maksimum: `120`.
- Data hasil disimpan dalam `localStorage` dengan key `aegis-screening`.

### Kategori hasil

| Kategori | Rentang skor |
| --- | ---: |
| Ringan | 0–40 |
| Sedang | 41–80 |
| Tinggi | 81–120 |

- Route: `#hasil`.
- Menampilkan skor, indikator visual, ringkasan suportif, dan pilihan langkah selanjutnya.
- Ini hanyalah demo skrining dan **bukan diagnosis medis atau instrumen klinis tervalidasi**.

### Modul latihan harian

- Route: `#modul`.
- Modul awal menyesuaikan kategori Ringan, Sedang, atau Tinggi.
- Tiap kategori masih mempunyai 3 sesi latihan awal.
- Latihan meliputi pernapasan, grounding, refleksi, komunikasi, dan daftar dukungan.
- Status latihan disimpan di `localStorage` dengan key `aegis-module-complete`.

## Design system yang wajib dipertahankan

- Vibe: calming, trustworthy, modern, profesional, dan bebas stigma.
- Palet: off-white, soft teal, hijau pastel, serta soft blue.
- Font: **DM Sans** untuk teks UI dan **Fraunces** untuk heading.
- Gunakan Lucide React untuk ikon; jangan memakai emoji untuk ikon UI.
- Border radius lembut dan cukup besar.
- Mobile-first; pastikan tidak ada horizontal overflow di layar HP.

## Pekerjaan lanjutan

### 1. AI Assistant 24/7

Buat `src/pages/AiAssistant.jsx` dan route `#ai-chat`.

- Gunakan mock AI; belum perlu API eksternal.
- Respons pembuka harus menyesuaikan hasil skrining di `aegis-screening`.
- Sediakan suggested prompts:
  - “Aku lagi merasa kewalahan”
  - “Bantu aku tenang sebentar”
  - “Aku ingin bicara dengan orang tua”
- Tampilan chat harus ringan dan nyaman pada HP.
- Selalu tampilkan disclaimer berikut:

  > AI ini memberikan pertolongan emosional awal dan bukan diagnosis medis final.

- Buat crisis guardrail: bila pesan mengindikasikan self-harm atau bunuh diri, beri respons yang hangat, sarankan menghubungi orang dewasa tepercaya, layanan darurat setempat, atau fasilitas kesehatan terdekat. Jangan pernah memberi instruksi berbahaya.
- Simpan riwayat demo pada `localStorage` key `aegis-chat-history`.
- Hubungkan CTA “Mulai percakapan” di hasil skrining ke `#ai-chat`.

### 2. Konseling privat semi-anonim

Buat `src/pages/Counseling.jsx`, route `#konseling`, dan data `src/data/psychologists.js`.

- Sediakan minimal empat psikolog mock di Surabaya.
- Data psikolog: `id`, nama tampilan profesional, avatar ilustratif lokal/CSS, spesialisasi, lokasi, mode konsultasi, biaya demo, rating demo, serta slot waktu.
- Buat alias otomatis seperti `Keluarga-A89`.
- Simpan alias yang konsisten di `localStorage` key `aegis-user-alias`.
- Jelaskan secara visual bahwa psikolog hanya melihat alias dan data skrining relevan; nama serta kontak asli tidak terlihat oleh psikolog.
- Booking flow:
  1. Pilih psikolog.
  2. Pilih online/tatap muka.
  3. Pilih jadwal.
  4. Isi kebutuhan singkat opsional.
  5. Konfirmasi.
- Simpan booking ke `localStorage` key `aegis-bookings`.
- Tampilkan konfirmasi berisi alias, psikolog, jadwal, mode, dan status “Menunggu konfirmasi”.
- Hubungkan CTA “Lihat jadwal” dari hasil ke `#konseling`.

### 3. Kembangkan modul latihan harian

- Perbanyak menjadi minimal tujuh hari pada setiap kategori.
- Tampilkan “Hari X dari 7”.
- Tambahkan latihan napas/grounding, mood check-in, jurnal singkat, self-compassion, batas sehat, komunikasi orang tua–remaja, serta rencana dukungan.
- Tambahkan textarea refleksi opsional.
- Simpan jurnal dengan key `aegis-module-journal`.
- Tambahkan ringkasan progres.
- Tambahkan tombol print-friendly menggunakan `window.print()` untuk demo.

### 4. Admin / Server View mock

Buat `src/pages/AdminDashboard.jsx` dan route `#admin`.

- Beri label jelas **Demo / Mock Server**.
- Buat dashboard metrik demo: total skrining, sesi AI aktif, booking, emergency flags.
- Visualisasikan Three-Tier Privacy Model:
  1. Public View: tanpa PII.
  2. Psychologist View: alias dan data skrining relevan.
  3. Server/Admin View: PII berstatus terenkripsi.
- Gunakan ciphertext palsu seperti `AES-256-GCM::bXJz...7a91`; jangan mengklaim enkripsi ini nyata.
- Tambahkan tabel audit log akses.
- Buat tombol **Emergency Override Protocol** dengan modal konfirmasi warning.
- Setelah dikonfirmasi, cukup tambahkan audit log mock. Jangan mengungkap PII asli.

### 5. PWA dasar

- Tambahkan `public/manifest.webmanifest`.
- Tambahkan meta tag relevan di `index.html`.
- Tambahkan icon placeholder sederhana dan service worker/offline fallback hanya bila aman dan tidak mengganggu development.
- Usahakan aplikasi dapat diinstal dari browser mobile.

### 6. QA dan polish

- Semua CTA yang masih menuju `#beranda` perlu dihubungkan ke halaman nyata.
- Jika user membuka `#hasil` tanpa skrining, tampilkan empty state dan ajakan memulai skrining; jangan tampilkan skor nol.
- Tambahkan warning yang proporsional untuk hasil Tinggi.
- Jangan pernah membuat klaim diagnosis, terapi, atau jaminan medis.
- Jalankan `npm run build` setelah fitur selesai dan perbaiki semua error.
- Jangan hapus `package-lock.json` atau `node_modules` secara manual.
- Gunakan `apply_patch` untuk perubahan file.

## Urutan pengerjaan yang direkomendasikan

1. Buat mock alias dan data psikolog.
2. Implementasikan konseling dan booking.
3. Implementasikan AI Assistant beserta guardrail.
4. Hubungkan CTA Result Dashboard.
5. Kembangkan modul menjadi 7 hari beserta jurnal.
6. Buat Admin Dashboard mock.
7. Tambahkan PWA.
8. Jalankan build akhir dan rangkum hasil.

## Output akhir yang diminta

Setelah implementasi, laporkan:

- Fitur yang selesai.
- Route/hash baru.
- Key `localStorage` yang digunakan.
- File yang dibuat atau diubah.
- Hasil `npm run build`.
