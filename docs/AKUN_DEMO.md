# 📋 Dokumentasi Akun Pengurus & Anggota Demo
## Platform Tata Kelola Arisan Keluarga Digital

Dokumen ini berisi daftar lengkap akun demo yang telah di-*seed* ke dalam database **Neon PostgreSQL** beserta nomor WhatsApp, peran (*role*), hak akses (*privileges*), panduan login OTP WhatsApp, serta konfigurasi gateway **Wablas**.

---

## 👥 1. Daftar Akun Pengurus & Anggota Keluarga

Seluruh akun di bawah ini telah terdaftar aktif di database Neon PostgreSQL dan siap digunakan untuk pengujian:

| No | Nama Anggota | Jabatan Paguyuban | Hak Akses (*Role*) | Nomor WhatsApp | Keterangan & Wewenang |
|:---:|:---|:---:|:---:|:---:|:---|
| 1 | **H. Bambang Sutrisno** | **KETUA** | `SUPER_ADMIN` | `081234000010` *(6281234000010)* | Kepala keluarga & pimpinan arisan. Hak akses penuh seluruh modul, kelola periode, dan kocokan arisan. |
| 2 | **Ibu Ratna Kusuma** | **BENDAHARA** | `ADMINISTRATOR` | `081234000011` *(6281234000011)* | Pengelola keuangan paguyuban. Verifikasi bukti transfer iuran, kelola pengeluaran sosial, pencairan tarikan. |
| 3 | **Pak Agus Wijaya** | **SEKRETARIS** | `ADMINISTRATOR` | `081234000012` *(628123400012)* | Pengelola administrasi. Pendataan anggota, penetapan lokasi & jadwal pertemuan, broadcast agenda. |
| 4 | **Hj. Siti Aminah** | **PEMBINA** | `REVIEWER` | `081234000015` *(628123400015)* | Sesepuh keluarga. Hak audit laporan keuangan, peninjau bukti transfer, dan persetujuan dana sosial. |
| 5 | **Bu Dewi Anggraini** | **ANGGOTA** | `ANGGOTA` | `081234000013` *(628123400013)* | Anggota aktif. Melihat silsilah, unggah slip transfer iuran, memantau live kocokan, data keluarga bahagia. |
| 6 | **Mas Eko Prasetyo** | **ANGGOTA** | `ANGGOTA` | `081234000014` *(628123400014)* | Anggota aktif (Pemenang Periode 10 - April 2026). |
| 7 | **Rina Marlina** | **ANGGOTA** | `ANGGOTA` | `081234000016` *(628123400016)* | Anggota aktif. Belum pernah menang di siklus putaran ke-1. |
| 8 | **Hendra Gunawan** | **ANGGOTA** | `ANGGOTA` | `081234000017` *(628123400017)* | Anggota aktif. Belum pernah menang di siklus putaran ke-1. |

---

## 🔐 2. Matriks Hak Akses (*Role & Permissions*)

| Fitur / Halaman | `SUPER_ADMIN` (Ketua) | `ADMINISTRATOR` (Bendahara/Sekretaris) | `REVIEWER` (Pembina) | `ANGGOTA` |
|:---|:---:|:---:|:---:|:---:|
| **Dashboard Anggota (`/dashboard`)** | ✅ Ya | ✅ Ya | ✅ Ya | ✅ Ya |
| **Pohon Anggota & Silsilah (`/anggota`)** | ✅ Ya | ✅ Ya | ✅ Ya | ✅ Ya |
| **Keluarga Bahagia (`/keluarga-bahagia`)** | ✅ Kelola Semua | ✅ Kelola Semua | ✅ Lihat | ✅ Milik Sendiri |
| **Lokasi Pertemuan Arisan (`/lokasi-arisan`)** | ✅ Ya | ✅ Ya | ✅ Ya | ✅ Ya |
| **Iuran Saya & Upload Slip (`/iuran-saya`)** | ✅ Ya | ✅ Ya | ✅ Ya | ✅ Ya |
| **Tabung Kocokan Arisan (`/kocokan`)** | 🎯 **Putar & Konfirmasi** | 🎯 **Putar & Konfirmasi** | 👁️ Live Spectator | 👁️ Live Spectator |
| **Dashboard Admin (`/admin/dashboard`)** | ✅ Akses Penuh | ✅ Akses Penuh | ✅ Lihat Ringkasan | ❌ Diblokir |
| **Rekap Keuangan Kas (`/admin/keuangan`)** | ✅ Akses Penuh | ✅ Akses Penuh | ✅ Audit Laporan | ❌ Diblokir |
| **Kelola Anggota (`/admin/anggota`)** | ✅ Tambah/Edit/Hapus | ✅ Tambah/Edit | 👁️ Lihat Daftar | ❌ Diblokir |
| **Verifikasi Bukti Transfer (`/admin/verifikasi-iuran`)** | ✅ Setujui/Tolak | ✅ Setujui/Tolak | 👁️ Tanda Audit | ❌ Diblokir |
| **Biaya Sosial (`/admin/biaya-sosial`)** | ✅ Input & Hapus | ✅ Input Pengeluaran | 👁️ Tanda Audit | ❌ Diblokir |
| **Kelola Lokasi (`/admin/lokasi`)** | ✅ Jadwalkan Baru | ✅ Jadwalkan Baru | 👁️ Lihat Jadwal | ❌ Diblokir |
| **Pengaturan Sistem (`/admin/pengaturan`)** | ✅ Ubah Rekening/WA | ✅ Ubah Rekening/WA | 👁️ Lihat Konfigurasi | ❌ Diblokir |

---

## 📱 3. Cara Masuk / Login ke Aplikasi

Terdapat **2 cara** untuk masuk dan menguji aplikasi:

### Cara 1: Fitur Instan "Ganti Persona" (Paling Cepat Saat Testing)
Di bagian bilah atas (*topbar*) aplikasi:
1. Klik menu dropdown **"Ganti Persona"**.
2. Pilih salah satu profil (misal: *H. Bambang Sutrisno*, *Ibu Ratna Kusuma*, atau *Bu Dewi Anggraini*).
3. Aplikasi akan langsung beralih profil dan menyesuaikan hak akses menu sidebar secara instan tanpa perlu memasukkan nomor telepon atau OTP.

---

### Cara 2: Login Resmi OTP WhatsApp (`/login`)
1. Buka halaman login di [http://localhost:3000/login](http://localhost:3000/login).
2. Masukkan nomor WhatsApp terdaftar (contoh: `081234000010` atau klik salah satu chip akun demo yang tersedia).
3. Klik tombol **"Kirim Kode OTP Masuk"**.
4. **Masukkan Kode OTP 6 Digit**:
   - **Mode Simulasi**: Gunakan kode OTP yang muncul di kotak dialog layar, atau gunakan kode universal: **`123456`**.
   - **Mode Produksi (Wablas Aktif)**: Masukkan 6 digit kode OTP rahasia yang masuk ke WhatsApp nomor HP Anda.
5. Klik **"Verifikasi & Masuk"**.
6. Sistem akan memvalidasi hash OTP, membuat sesi JWT aman dalam *HttpOnly cookie*, dan mengarahkan Anda ke Dashboard sesuai hak akses.

---

## ⚙️ 4. Panduan Aktivasi WhatsApp Gateway Wablas

Sistem ArisanKeluarga menggunakan gateway resmi **Wablas** untuk seluruh pengiriman pesan WhatsApp.

### Lokasi Pengaturan Token:
Buka file [`.env.local`](file:///d:/project/web/arisan-keluarga/.env.local) di root proyek:

```env
# 1. Domain API Server Wablas (sesuaikan dengan subdomain akun Wablas Anda)
WABLAS_API_URL=https://solo.wablas.com

# 2. Token Autentikasi Device Wablas Anda
WABLAS_TOKEN=tempelkan_token_wablas_asli_anda_di_sini
```

> **Catatan Subdomain Wablas**:
> Periksa URL server pada dashboard akun Wablas Anda. Jika akun Anda berada di server lain, ubah `WABLAS_API_URL` (misal: `https://kudus.wablas.com`, `https://jakarta.wablas.com`, atau `https://solo.wablas.com`).

---

### 📲 5. Notifikasi Otomatis yang Didukung Gateway Wablas

Ketika `WABLAS_TOKEN` asli diisi, aplikasi akan secara otomatis mengirim pesan WhatsApp nyata pada 6 kejadian berikut:

1. **Pengiriman OTP Masuk (PRD Bab 6.A)**:
   Mengirim kode 6 digit berlaku 5 menit saat anggota meminta OTP di `/login`.
2. **Notifikasi Bukti Transfer Baru ke Pengurus (PRD Bab 6.C)**:
   Saat anggota mengunggah slip transfer iuran di `/iuran-saya`, pesan otomatis dikirim ke nomor WhatsApp Bendahara agar segera diverifikasi.
3. **Pemberitahuan Status Iuran Lunas ke Anggota (PRD Bab 6.C)**:
   Saat Bendahara menyetujui slip di `/admin/verifikasi-iuran`, notifikasi konfirmasi lunas dikirimkan ke anggota.
4. **Pengumuman Pemenang Kocokan Arisan Resmi (`/kocokan`)**:
   Saat tombol "Tetapkan & Simpan Pemenang" ditekan di tabung kocokan arisan, rincian tarikan kotor, potongan tunggakan, dan dana bersih otomatis dikirimkan ke pemenang.
5. **Broadcast Pembukaan Periode Baru**:
   Notifikasi ke seluruh anggota saat periode arisan bulanan baru dibuka oleh pengurus.
6. **Broadcast Jadwal & Lokasi Silaturahmi**:
   Pengingat agenda pertemuan keluarga beserta alamat tuan rumah dan tautan koordinat peta.

---

### 🧪 6. Cara Menguji WhatsApp Nyata ke Nomor Anda Sendiri

Jika Anda ingin menguji pesan WhatsApp masuk langsung ke nomor HP pribadi Anda:
1. Buka [`.env.local`](file:///d:/project/web/arisan-keluarga/.env.local), masukkan token Wablas asli Anda pada `WABLAS_TOKEN`.
2. Masuk ke menu **Kelola Anggota** ([/admin/anggota](http://localhost:3000/admin/anggota)).
3. Klik tombol edit pada salah satu akun demo (misal: H. Bambang Sutrisno atau Ibu Ratna).
4. Ubah nomor telepon menjadi nomor WhatsApp pribadi Anda (contoh: `0812xxxxxxxx`).
5. Buka `/login` di tab baru (*Incognito*), masukkan nomor HP Anda, dan periksa pesan OTP masuk di aplikasi WhatsApp ponsel Anda!
