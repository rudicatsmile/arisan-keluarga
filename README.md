# ArisanKeluarga — Tata Kelola Keuangan & Silaturahmi Arisan Keluarga

Aplikasi web modern berbasis **Next.js 15 App Router** untuk pengelolaan keuangan arisan paguyuban/keluarga besar secara digital, akuntabel, dan transparan — mulai dari pencatatan iuran bulanan, penyaluran kas sosial (santunan sakit, bantuan, hadiah), susunan pohon silsilah keluarga, hingga jadwal rencana lokasi pertemuan lengkap dengan navigasi peta.

---

## 🌟 Fitur Utama

1. **Autentikasi WhatsApp OTP (Wablas Gateway)**
   - Masuk tanpa kata sandi menggunakan nomor WhatsApp resmi yang didaftarkan pengurus.
   - OTP 6-digit dengan masa berlaku 5 menit, batasan 3x percobaan, dan proteksi rate limiting.
   - Sesi JWT aman tersimpan di cookie `HttpOnly` dengan perlindungan CSRF dan XSS.

2. **Pencatatan Iuran & Transfer Manual**
   - Transparansi tagihan per periode untuk setiap anggota aktif.
   - Informasi rekening resmi kas paguyuban dengan tombol salin cepat.
   - Formulir unggah slip bukti transfer (maksimal 2MB) dengan pratinjau foto.
   - Alur verifikasi pengurus: status berubah dari `BELUM BAYAR` → `PENDING` → `LUNAS`.
   - Notifikasi otomatis WhatsApp saat bukti bayar terkirim dan diverifikasi.

3. **Pohon Anggota & Silsilah Paguyuban**
   - Visualisasi struktur kepengurusan (Ketua, Sekretaris, Bendahara, Pembina, Anggota).
   - Tampilan hierarki pohon (*tree view*) dan mode kisi (*grid view*) dengan pencarian cepat.
   - Profil lengkap tiap anggota beserta data kontak dan riwayat setoran kas.

4. **Direktori Keluarga Bahagia**
   - Mendokumentasikan nama pasangan (Suami/Istri) dan anak-anak dari tiap anggota.
   - Anggota dapat mengelola keluarga pribadinya sendiri; Pengurus dapat mengelola seluruhnya.

5. **Lokasi & Histori Pertemuan Arisan**
   - Jadwal pertemuan rutin berikutnya dilengkapi titik peta OpenStreetMap.
   - Tombol navigasi rute instan ke aplikasi Google Maps dan Waze.
   - Tab arsip histori pertemuan sebelumnya yang telah terlaksana.

6. **Pengeluaran Kas Biaya Sosial**
   - Pencatatan langsung tali asih untuk kategori: **Sakit**, **Bantuan**, **Hadiah**, dan **Lainnya**.
   - Dilengkapi lampiran kuitansi/foto bukti pendukung.
   - Fitur audit pemeriksaan khusus bagi peran **Reviewer (Auditor)**.

7. **Multi-Role & Pembagian Hak Akses**
   - **Super Admin**: Pemilik/ketua utama; kelola semua data, role, dan pengaturan paguyuban.
   - **Administrator**: Pengurus inti (Bendahara/Sekretaris); verifikasi iuran, catat biaya sosial, atur anggota dan lokasi.
   - **Reviewer**: Pengawas/sesepuh keluarga; akses baca (*read-only*) seluruh data keuangan dan menandai "Sudah Diperiksa".
   - **Anggota**: Peserta arisan; melihat jadwal, pohon keluarga, dan mengunggah bukti iuran pribadi.

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 App Router (React 19, TypeScript)
- **Styling**: Tailwind CSS, CSS Variables HSL, lucide-react
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Autentikasi**: Custom JWT Session (`jose`) + WhatsApp OTP Gateway (`Wablas API`)
- **Penyimpanan Berkas**: Bunny Storage + Bunny CDN
- **Peta**: OpenStreetMap Tiles + Leaflet Coordinates

---

## 📦 Akun Demo untuk Pengujian Cepat

Pada halaman login `/login`, Anda dapat mengklik tombol **Uji Coba Cepat (Akun Demo)** atau menggunakan salah satu nomor berikut:

| Nama Pengguna | Jabatan | Role Aplikasi | Nomor WhatsApp |
|:---|:---|:---|:---|
| **H. Bambang Sutrisno** | Ketua | **Super Admin** | `081234000010` |
| **Ibu Ratna Kusuma** | Bendahara | **Administrator** | `081234000011` |
| **Pak Agus Wijaya** | Sekretaris | **Administrator** | `081234000012` |
| **Hj. Siti Aminah** | Pembina | **Reviewer (Auditor)** | `081234000015` |
| **Bu Dewi Anggraini** | Anggota | **Anggota** | `081234000013` |
| **Mas Eko Prasetyo** | Anggota | **Anggota** | `081234000014` |

> **Kode OTP Simulasi**: Gunakan kode **`123456`** atau kode 6 digit yang dikirimkan.

---

## 🛠️ Panduan Menjalankan Proyek Secara Lokal

### 1. Kloning & Pemasangan Dependensi
```bash
cd d:/project/web/arisan-keluarga
npm install
```

### 2. Pengaturan Variabel Lingkungan
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan konfigurasi:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/arisan?sslmode=require
AUTH_SECRET=arisankeluarga_super_secret_jwt_key_2026_bani_sutrisno
WABLAS_API_URL=https://solo.wablas.com
WABLAS_TOKEN=isi-token-wablas-anda
```

### 3. Migrasi Database (Jika Menggunakan Neon PostgreSQL)
```bash
npx drizzle-kit push
npm run seed  # Menjalankan src/db/seed.ts
```

### 4. Menjalankan Server Development
```bash
npm run dev
```
Buka peramban di `http://localhost:3000`.

### 5. Kompilasi Produksi (Production Build)
```bash
npm run build
npm start
```

---

## 🔒 Kebijakan Keamanan & Kepatuhan Data

- **Tanpa Plaintext OTP**: Seluruh kode OTP di-hash satu arah menggunakan `bcryptjs`.
- **Proteksi Brute-force**: Maksimal 3 kali percobaan salah sebelum OTP dibatalkan otomatis.
- **Rate-Limiting**: Jeda pengiriman minimal 30 detik antar permintaan, dan maksimal 5 kali dalam 10 menit.
- **Privasi Finansial**: Informasi mutasi dan nomor rekening arisan hanya dapat diakses oleh anggota resmi yang telah terdaftar. Seluruh rute aplikasi internal dilindungi oleh Edge Middleware dengan tag `noindex, nofollow`.

---

© 2026 ArisanKeluarga. Dibangun dengan cinta untuk mempererat tali silaturahmi keluarga.
