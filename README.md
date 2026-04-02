# Frontend

Frontend project ini menampilkan biodata kelompok, status autentikasi user, style website yang aktif, dan panel `Style Studio` untuk editor. Frontend terhubung ke backend melalui HTTP API dan tidak menyimpan token auth di localStorage.

## Tanggung Jawab Frontend

Frontend bertanggung jawab untuk:
- menampilkan biodata kelompok yang bisa diakses tanpa login
- menampilkan tombol login Google
- menampilkan status session user
- menampilkan style global yang sedang aktif
- menampilkan `Style Studio` hanya untuk editor
- mengirim request perubahan warna dan font ke backend

## Tech Stack

- React 19
- React Router 7
- TypeScript
- Vite
- CSS kustom

## Fitur Utama

- halaman biodata kelompok
- snapshot style aktif
- login Google melalui backend
- informasi role user
- panel `Style Studio` untuk editor
- preview style sebelum disimpan

## Mekanisme Akses User

Frontend membedakan tiga kondisi user:

### Guest
- belum login
- bisa melihat biodata dan style aktif
- tidak bisa mengakses `Style Studio`

### Viewer
- sudah login dengan Google
- bukan akun editor yang terdaftar
- bisa melihat biodata, status auth, dan style aktif
- tidak bisa melihat kontrol perubahan style

### Editor
- sudah login dengan Google
- email terdaftar sebagai editor di backend
- bisa melihat dan memakai `Style Studio`
- bisa mengubah warna dan font website secara global

Catatan penting:
- frontend hanya menampilkan atau menyembunyikan kontrol berdasarkan role
- keamanan utama tetap ditegakkan di backend

## Struktur Folder Penting

```text
Frontend/
└── app/
    ├── api/
    │   ├── auth.ts
    │   ├── backend.ts
    │   └── style.ts
    ├── routes/
    │   ├── home.tsx
    │   └── login-failed.tsx
    ├── app.css
    └── root.tsx
```

## Komponen Penting

### `app/routes/home.tsx`
Halaman utama yang berisi:
- biodata anggota
- kartu autentikasi
- style snapshot
- `Style Studio`
- preview perubahan style

### `app/api/backend.ts`
Helper fetch ke backend menggunakan `VITE_BACKEND_URL`.

### `app/api/auth.ts`
Fungsi untuk:
- mengambil session user dari `/auth/me`
- logout ke `/auth/logout`

### `app/api/style.ts`
Fungsi untuk:
- mengambil style global dari `/api/style`
- mengubah warna
- mengubah font

### `app/app.css`
Menangani style visual utama website.

## Environment Variable

Frontend menggunakan:

```env
VITE_BACKEND_URL="http://localhost:4000"
```

Nilai ini penting jika frontend dan backend dipisah deployment.

Contoh:
- lokal: `http://localhost:4000`
- production: `https://api.domain-kamu.com`

## Cara Menjalankan Lokal

1. Install dependency
2. Pastikan `.env` frontend berisi `VITE_BACKEND_URL`
3. Jalankan development server

Perintah:

```bash
npm install
npm run dev
```

Frontend akan berjalan di:

```text
http://localhost:5173
```

## Build Production

```bash
npm run build
```

Untuk menjalankan hasil build:

```bash
npm start
```

## Koneksi ke Backend

Frontend bergantung pada backend untuk:
- login Google
- logout
- cek session user
- ambil style global
- update style global

Flow singkat:
1. user klik `Login dengan Google`
2. browser diarahkan ke `${BACKEND_URL}/auth/google`
3. setelah login berhasil, backend mengembalikan user ke frontend
4. frontend memanggil `/auth/me` untuk mengambil session aktif
5. frontend memanggil `/api/style` untuk menampilkan style global

## Perilaku Style Global

Style website bersifat global:
- jika editor mengubah warna atau font, perubahan disimpan di database
- semua user akan melihat style terbaru, termasuk guest
- perubahan tetap bertahan walaupun editor logout

## Catatan Keamanan di Frontend

- frontend tidak menyimpan token auth di localStorage atau sessionStorage
- session dikelola backend melalui cookie `httpOnly`
- frontend tidak menegakkan keamanan utama sendiri
- semua endpoint sensitif tetap divalidasi di backend
- data style publik sudah dibatasi agar tidak mengekspos email editor terakhir

## Catatan Deploy

Jika frontend dan backend dipisah deployment:
- set `VITE_BACKEND_URL` ke domain backend
- pastikan backend mengizinkan origin frontend di CORS
- pastikan URL sukses login dan gagal login di backend mengarah kembali ke domain frontend
