# Deploy Aegis ke Vercel

## Status prototype saat ini

- Vite + React siap dideploy sebagai website publik.
- Endpoint `api/ai.js` siap menjalankan Google Gemini di Vercel.
- Login, hasil skrining, progres latihan, riwayat chat, dan booking masih memakai `localStorage` browser. Ini cocok untuk demo penilaian, tetapi bukan database bersama.
- MySQL/Aiven belum tersambung karena kredensial database belum dimasukkan dan backend CRUD belum dibuat.

## Deploy melalui dashboard Vercel

1. Unggah proyek ke repository GitHub. Jangan unggah file `.env`.
2. Masuk ke [Vercel](https://vercel.com/new), lalu pilih repository Aegis.
3. Vercel akan mengenali **Vite**. Pastikan Build Command `npm run build` dan Output Directory `dist`.
4. Pada **Environment Variables**, tambahkan:
   - `GEMINI_API_KEY`: API key dari Google AI Studio.
   - `GEMINI_MODEL`: `gemini-2.5-flash`.
5. Tekan **Deploy**. Setelah selesai, Vercel memberi URL publik yang dapat dibuka juri.

## Tes setelah deploy

1. Buka URL Vercel dari mode incognito atau perangkat lain.
2. Buka Dashboard, Skrining, Latihan Harian, dan Konseling untuk memastikan semua halaman dapat diakses.
3. Kirim pesan di AI Assistant. Jika API key benar, respons datang dari Google Gemini. Jika belum dikonfigurasi atau kuota habis, aplikasi menampilkan respons cadangan demo.

## Tentang database

Vercel bukan penyedia MySQL. Aiven dapat dipakai sebagai database eksternal, tetapi data akan benar-benar tersimpan bersama hanya setelah dibuat API backend untuk registrasi, login, booking, dan hasil skrining. Simpan kredensial MySQL sebagai Environment Variables Vercel—bukan di kode atau `VITE_*`.
