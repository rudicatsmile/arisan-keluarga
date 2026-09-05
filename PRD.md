# ArisanKeluarga

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*

- **Nama Aplikasi**: ArisanKeluarga
- **Penjelasan Singkat**: ArisanKeluarga adalah aplikasi web pengelolaan keuangan arisan kelompok secara digital — mulai dari pencatatan iuran bulanan, pengeluaran dana sosial, struktur pohon anggota, data keluarga, hingga rencana lokasi pertemuan lengkap dengan peta.
- **Masalah yang Diselesaikan**:
  - Pencatatan iuran arisan masih tersebar di buku tulis, WhatsApp, atau catatan pribadi bendahara sehingga mudah hilang dan sulit diaudit.
  - Rekap keuangan per anggota dan total kas arisan sulit disajikan secara cepat saat dibutuhkan.
  - Data anggota arisan tidak terpusat, belum ada pohon organisasi/susunan pengurus yang rapi, dan tidak ada dokumentasi struktur keluarga anggota.
  - Pengeluaran dana sosial seperti santunan sakit, bantuan, dan hadiah sering tidak tercatat atau tidak bisa dipertanggungjawabkan.
  - Informasi jadwal dan lokasi arisan sering berubah-ubah dan tersebar di chat sehingga anggota bingung menentukan tempat.
- **Pengguna Aplikasi**:
  - **Super Admin** — pemilik/pengurus utama aplikasi; mengelola seluruh data, role, dan pengaturan sistem.
  - **Administrator** — pengurus inti yang mencatat pembayaran iuran, mencatat biaya sosial, mengelola anggota, serta mengatur lokasi arisan.
  - **Reviewer** — pihak pengawas/auditor internal yang melihat dan memverifikasi laporan keuangan tanpa mengubah data transaksi.
  - **Anggota** — peserta arisan yang dapat melihat jadwal, lokasi, pohon anggota, keluarga bahagia, serta riwayat pembayaran iuran pribadi.
- **Target Keberhasilan**:
  - 100% pembayaran iuran arisan tercatat digital setiap periode.
  - Laporan rekap keuangan dan iuran per anggota dapat disajikan kurang dari 5 menit.
  - Tidak ada lagi data arisan yang hilang atau bersifat ganda.
  - Seluruh anggota dapat mengenal satu sama lain beserta keluarga melalui menu Keluarga Bahagia.
  - Setiap lokasi dan jadwal arisan selalu diketahui anggota sebelum hari-H pelaksanaan.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak.*

### ✅ Yang Dikerjakan:
- Login menggunakan **WhatsApp OTP** melalui layanan **Wablas**.
- Manajemen role fleksibel: Super Admin, Administrator, Reviewer, dan Anggota.
- Manajemen anggota lengkap dengan foto, nama, jabatan, nomor WhatsApp, dan susunan pohon anggota.
- Pencatatan iuran arisan per periode dengan metode **Transfer Manual** dan unggah bukti bayar.
- Halaman hasil pembayaran iuran masing-masing anggota.
- Pencatatan biaya pengeluaran dana sosial: **Sakit**, **Bantuan**, **Hadiah**, dan **Lainnya**.
- Kelola rencana lokasi arisan beserta peta dan histori lokasi.
- Menu **Keluarga Bahagia** untuk menampilkan hubungan keluarga anggota arisan.
- Dashboard administrator dengan prioritas: Rekap Keuangan & Iuran Per Anggota, Pohon Anggota & Keluarga Bahagia, Rencana Lokasi Arisan & Peta, dan Persetujuan/Pencatatan Biaya Sosial.

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Sistem pembayaran otomatis melalui payment gateway (Midtrans, Xendit, dll.) — karena memilih Transfer Manual.
- Pendaftaran mandiri / open registration untuk publik — akun hanya dibuat oleh Super Admin/Administrator.
- Aplikasi mobile native (Android/iOS) — versi awal berupa **responsive web app**.
- Fitur undian arisan/pemenang arisan otomatis.
- Modul tanya jawab, forum, atau media sosial komunitas.
- Notifikasi push ke perangkat HP; cukup notifikasi WhatsApp.

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna.*

### A. Public Area (Tanpa Login)
| URL | Nama Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/` | Beranda | Landing page berisi profil ArisanKeluarga, keunggulan fitur, foto kegiatan, dan tombol **Masuk**. |
| `/login` | Halaman Login WhatsApp OTP | Form input nomor WhatsApp dan form input 6 digit OTP. |

### B. Area Khusus Anggota (Semua Akun yang Sudah Login)
| URL | Nama Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/dashboard` | Dashboard Utama | Ringkasan status iuran saya, total kas arisan, jadwal terdekat, dan pengumuman singkat. |
| `/anggota` | Pohon Anggota | Menampilkan susunan/pohon anggota dengan foto, nama, jabatan, dan relasi atasan-bawahan. |
| `/anggota/[id]` | Profil Anggota | Detail anggota: foto, nama, jabatan, no. WhatsApp, alamat, keluarga, dan riwayat pembayaran. |
| `/anggota/[id]/pembayaran` | Hasil Pembayaran Arisan | Ringkasan total iuran, kekurangan bayar, dan riwayat pembayaran seorang anggota. |
| `/keluarga-bahagia` | Keluarga Bahagia | Peta/daftar keluarga seluruh anggota; anggota melihat siapa anak, istri/suami, orang tua, dsb. |
| `/lokasi-arisan` | Lokasi & Histori Arisan | Daftar lokasi rencana arisan berikutnya, peta, dan histori lokasi pertemuan sebelumnya. |
| `/iuran-saya` | Pembayaran Iuran Saya | Daftar semua kewajiban iuran saya pada setiap periode; dapat **unggah bukti transfer**. |

### C. Area Back Office (Admin, Reviewer, dan Super Admin)
| URL | Nama Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/admin/dashboard` | Dashboard Back Office | Rekap keuangan global: total dana masuk, total dana keluar, saldo, anggota belum bayar, dan pengeluaran sosial terakhir. |
| `/admin/keuangan` | Rekap Keuangan | Grafik dan tabel rekap iuran per anggota, total iuran per periode, dan saldo kas arisan. |
| `/admin/anggota` | Kelola Anggota | CRUD anggota, set role, set jabatan, atur parent pohon, aktif/nonaktif akun. |
| `/admin/verifikasi-iuran` | Verifikasi Iuran | Daftar pembayaran berstatus PENDING; Admin melihat bukti transfer dan mengubahnya menjadi PAID. |
| `/admin/biaya-sosial` | Kelola Biaya Sosial | Pencatatan langsung pengeluaran untuk santunan sakit, bantuan, hadiah, dan lainnya. |
| `/admin/lokasi` | Kelola Lokasi Arisan | Tambah, ubah, tandai selesai, atau batalkan jadwal lokasi arisan. |
| `/admin/pengaturan` | Pengaturan Sistem | Pengaturan nama arisan, nomor rekening tujuan transfer, nama pemilik rekening, bank, dan kontak WhatsApp pengurus. |

> **Catatan Reviewer**: Reviewer diperbolehkan membuka halaman `/admin/*` dalam **mode baca**. Tombol tambah/edit/simpan otomatis disembunyikan atau dinonaktifkan, namun Reviewer tetap dapat menekan tombol **“Tandai Sudah Diperiksa”** untuk keperluan audit.

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*

- **Skema Warna**:
  - Primary / Biru Utama: `#2563EB` — `HSL(221.2, 83.2%, 53.3%)`
  - Primary Foreground: `#FFFFFF`
  - Secondary: `#F1F5F9` — `HSL(210, 40%, 96%)`
  - Accent: `#EEF2FF` — `HSL(226, 100%, 97%)`
  - Background: `#FFFFFF`
  - Muted Foreground: `#64748B` — `HSL(215, 20.2%, 65%)`
  - Border: `#E2E8F0` — `HSL(214.3, 31.8%, 91.4%)`
  - Destructive: `#EF4444`
  - Success / Sukses: `#16A34A`
- **Tipografi**:
  - Gunakan font **Inter** untuk seluruh teks heading dan body, di-load melalui `next/font/google`.
  - Skala heading: `text-2xl font-bold tracking-tight` untuk halaman, `text-lg font-semibold` untuk judul kartu.
  - Angka nominal keuangan harus menggunakan font tabular/angka monospace agar rata saat membentuk tabel — misal dengan bantuan `tabular-nums`.
- **Aturan Komponen**:
  - Halaman memakai komponen **shadcn/ui**: `Button`, `Card`, `Input`, `Dialog`, `Table`, `Badge`, `Tabs`, `DropdownMenu`, `Avatar`, `Sonner/Toast`, `Skeleton`.
  - Sudut membulat `rounded-lg` / `rounded-xl`.
  - Kartu biasa memiliki `bg-white border border-slate-200 shadow-sm`.
  - Kartu yang bisa diklik memiliki `hover:shadow-md hover:-translate-y-0.5 transition`.
  - Tombol utama: `bg-blue-600 hover:bg-blue-700 text-white`.
  - Tombol berbahaya/destructive: `bg-red-600`.
  - Badge status:
    - `LUNAS`: hijau (`bg-emerald-100 text-emerald-700`)
    - `MENUNGGU`: kuning (`bg-amber-100 text-amber-700`)
    - `BELUM BAYAR`: abu-abu/merah (`bg-slate-100` / `bg-red-100`)
    - `DIJADWALKAN`: biru (`bg-blue-100 text-blue-700`)
  - Ikon menggunakan **Lucide Icons**.
- **Nuansa & Vibe**:
  - Clean, modern, banyak ruang putih (`whitespace`).
  - Bernuansa hangat dan kekeluargaan, tetapi tetap profesional untuk pengelolaan keuangan.
  - Interaktif dengan micro-animation ringan: hover, munculnya dialog, *toast* notifikasi sukses.
  - Halaman login menggunakan kartu di tengah layar dan menampilkan logo ArisanKeluarga.

---

## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*

| Menu / Halaman | Publik (Tanpa Login) | Anggota | Reviewer | Administrator | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Landing `/` & `/login` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Dashboard Anggota `/dashboard` | ❌ | ✅ | ✅ | ✅ | ✅ |
| Pohon Anggota `/anggota` | ❌ | ✅ | ✅ | ✅ | ✅ |
| Profil Anggota `/anggota/[id]` | ❌ | Hanya milik sendiri | ✅ | ✅ | ✅ |
| Hasil Pembayaran `/anggota/[id]/pembayaran` | ❌ | Hanya milik sendiri | ✅ | ✅ | ✅ |
| Keluarga Bahagia `/keluarga-bahagia` | ❌ | ✅ (edit data keluarga sendiri) | ✅ (baca) | ✅ | ✅ |
| Lokasi Arisan `/lokasi-arisan` | ❌ | ✅ | ✅ | ✅ | ✅ |
| Rekap Keuangan `/admin/keuangan` | ❌ | ❌ | ✅ (baca) | ✅ | ✅ |
| Kelola Anggota `/admin/anggota` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Verifikasi Iuran `/admin/verifikasi-iuran` | ❌ | ❌ | Periksa hanya | ✅ | ✅ |
| Kelola Biaya Sosial `/admin/biaya-sosial` | ❌ | ❌ | ✅ (baca/audit) | ✅ | ✅ |
| Kelola Lokasi `/admin/lokasi` | ❌ | ❌ | ❌ | ✅ | ✅ |
| Pengaturan Sistem & Role `/admin/pengaturan` | ❌ | ❌ | ❌ | Sebagian | ✅ |

> Semua akun yang dibuat **adalah anggota arisan**; perbedaan `role` hanya menentukan hak akses terhadap menu dan pengelolaan aplikasi. Setiap role tetap muncul pada pohon anggota dan memiliki kewajiban iuran.

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Login dengan WhatsApp OTP (Wablas)
- **Cara Kerja**:
  1. Pengguna membuka halaman `/login`.
  2. Pengguna memasukkan nomor WhatsApp yang sudah terdaftar oleh Administrator.
  3. Sistem memeriksa apakah nomor aktif dan terdaftar di database.
  4. Sistem membuat kode OTP 6 digit, menyimpannya dengan aman, lalu mengirimkannya melalui **WhatsApp Gateway Wablas**.
  5. Pengguna memasukkan OTP.
  6. Jika benar, sistem membuat sesi login dan mengarahkan pengguna ke halaman sesuai role.
- **Aturan Sistem**:
  - Jika nomor tidak terdaftar, tampilkan pesan *“Nomor WhatsApp belum terdaftar. Silakan hubungi Administrator ArisanKeluarga.”*
  - OTP hanya berlaku **5 menit**.
  - Maksimal 3x percobaan OTP; setelah itu OTP hangus dan pengguna harus meminta OTP baru.
  - Tombol “Kirim Ulang OTP” baru aktif setelah **30 detik**.
  - Kode OTP tidak boleh pernah dikembalikan dalam response API/log.
  - Setelah login berhasil, halaman `/login` tidak lagi boleh diakses.

### B. Manajemen Anggota & Pohon Keanggotaan
- **Cara Kerja**:
  1. Administrator atau Super Admin membuka `/admin/anggota`.
  2. Administrator membuat akun anggota baru dengan nama, nomor WhatsApp, foto, alamat, jabatan arisan, status aktif, dan `parent_id` dalam pohon.
  3. Sistem membuat akun yang dapat login via WhatsApp OTP.
  4. Halaman `/anggota` menampilkan pohon/susunan keanggotaan dalam bentuk kartu.
  5. Saat kartu anggota diklik, muncul profil lengkap anggota.
- **Aturan Sistem**:
  - Kolom **Jabatan** bersifat organisasi arisan: Pembina, Ketua, Sekretaris, Bendahara, atau Anggota.
  - Kolom **Role** menentukan hak akses sistem: Super Admin, Administrator, Reviewer, atau Anggota.
  - Satu anggota hanya bisa memiliki satu `parent_id`.
  - Nomor WhatsApp harus unik dan valid format internasional (`628xxxx`).
  - Foto default `/images/avatar-default.png` bila belum diunggah.

### C. Iuran Arisan & Pembayaran Transfer Manual
- **Cara Kerja**:
  1. Administrator membuka periode baru arisan (misal: “Periode 12 – Juni 2026”) dan menentukan nominal iuran, tanggal mulai, serta batas bayar.
  2. Sistem otomatis membuat catatan **BELUM BAYAR** untuk setiap anggota aktif pada periode tersebut.
  3. Anggota membuka `/iuran-saya`, melihat tagihan, lalu mentransfer ke rekening resmi arisan.
  4. Anggota mengunggah bukti transfer gambar/PDF pada halaman tersebut.
  5. Status berubah menjadi **MENUNGGU VERIFIKASI (PENDING)**.
  6. Administrator mendapat notifikasi WhatsApp bahwa ada bukti bayar baru.
  7. Administrator membuka `/admin/verifikasi-iuran`, melihat rincian bukti transfer, lalu menekan tombol **TERVERIFIKASI LUNAS**.
  8. Sistem mengirim notifikasi WhatsApp ke anggota bahwa pembayarannya sudah diterima.
  9. Halaman hasil pembayaran anggota otomatis diperbarui.
- **Aturan Sistem**:
  - Periode iuran hanya bisa dibuka oleh Administrator atau Super Admin.
  - Jika periode dibuka, sistem membuat `periodPayments` sebanyak anggota aktif.
  - Satu anggota hanya boleh memiliki 1 catatan pembayaran per periode (unique `periodId + memberId`).
  - Pembayaran yang diunggah harus foto dengan format `.jpg`, `.jpeg`, `.png`, atau `.webp`; maksimal **2MB**.
  - Administrator yang memverifikasi akan tercatat di field `verifiedById`.

### D. Pengeluaran Biaya Sosial
- **Cara Kerja**:
  1. Saat ada anggota sakit, membutuhkan bantuan, atau berhak menerima hadiah, Administrator mencatatnya langsung di halaman `/admin/biaya-sosial`.
  2. Administrator memilih kategori: **Sakit**, **Bantuan**, **Hadiah**, atau **Lainnya**.
  3. Administrator memilih anggota penerima, memasukkan nominal, deskripsi keperluan, tanggal, dan bukti pendukung.
  4. Sistem langsung mencatat sebagai pengeluaran kas arisan.
  5. Reviewer dapat meninjau pengeluaran tersebut dan menandainya sebagai **“sudah diperiksa”** untuk keperluan audit.
- **Aturan Sistem**:
  - Pencatatan biaya sosial **dilakukan langsung oleh Administrator**, tidak ada alur persetujuan berjenjang digital.
  - Aksi hapus pada biaya sosial hanya dimiliki Super Admin, atau Administrator untuk data yang dibuatnya pada hari yang sama.
  - Kategori wajib diisi.
  - Nominal harus lebih dari 0.
  - Bukti pendukung berupa foto/screenshot wajib dilampirkan untuk nominal di atas batas yang ditentukan Administrator (default: Rp500.000).

### E. Lokasi Arisan & Histori Lokasi
- **Cara Kerja**:
  1. Administrator membuka `/admin/lokasi`.
  2. Administrator memilih nama anggota tuan rumah, nama lokasi, alamat lengkap, tanggal/jam pertemuan, dan menandai titik lokasi pada peta.
  3. Anggota membuka `/lokasi-arisan`.
  4. Anggota melihat kartu jadwal lokasi terdekat beserta peta dan tombol “Buka Navigasi” ke Google Maps/Waze.
  5. Setelah pertemuan selesai, Administrator mengubah status menjadi **SELESAI**.
  6. Lokasi tersebut otomatis pindah ke tab **Histori Lokasi**.
- **Aturan Sistem**:
  - Lokasi harus memiliki latitude dan longitude agar peta tidak error.
  - Status lokasi: `DIJADWALKAN`, `SELESAI`, `DIBATALKAN`.
  - Anggota hanya dapat melihat, tidak bisa menambah/mengubah lokasi.
  - Histori lokasi menampilkan nama tuan rumah, alamat, tanggal, dan koordinat.

### F. Keluarga Bahagia
- **Cara Kerja**:
  1. Anggota dapat mengelola data keluarganya sendiri melalui halaman `/keluarga-bahagia` (klik tombol “Kelola Keluarga Saya”).
  2. Anggota menambahkan nama anggota keluarga, hubungan: Suami, Istri, Anak, Bapak, Ibu, Saudara, atau Lainnya.
  3. Anggota lain dapat melihat data keluarga setiap anggota sehingga saling mengenal.
  4. Administrator dapat melengkapi data keluarga dari anggota baru saat pertama kali dibukukan.
- **Aturan Sistem**:
  - Anggota hanya dapat menambah/mengedit data keluarga miliknya sendiri.
  - Administrator dan Super Admin dapat mengelola data keluarga seluruh anggota.
  - Reviewer hanya dapat melihat.
  - Field `userId` wajib disi sebagai pemilik data keluarga.

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout**: Header/Navbar di atas berisi logo dan tombol **“Masuk”**, serta Footer di bawah.
- **App Layout (setelah login)**:
  - **Sidebar kiri** (fixed) dengan logo ArisanKeluarga, menu utama, dan menu kelola admin.
  - **Header atas** berisi halaman saat ini, nama pengguna, avatar, tombol notifikasi, dan menu logout.
  - **Konten** memiliki area `max-w-7xl mx-auto p-4 lg:p-8`.
- Pada mode mobile, sidebar berubah menjadi **drawer** yang muncul dari kiri dengan tombol hamburger.

### Bagan Alur Autentikasi & Navigasi
```mermaid
flowchart TD
    A[Pengunjung / Non Login] --> B[Landing page /]
    B --> C[Login /login]
    C --> D{Kode OTP valid?}
    D -- Tidak --> C
    D -- Ya --> E{Cek Role Login}
    E -- ANGGOTA --> F[Dashboard Anggota /dashboard]
    E -- REVIEWER --> G[Dashboard Audit /admin/dashboard Mode Baca]
    E -- ADMINISTRATOR --> H[Dashboard Back Office /admin/dashboard]
    E -- SUPER_ADMIN --> H
    F --> F1[Iuran Saya /iuran-saya]
    F --> F2[Pohon Anggota /anggota]
    F --> F3[Keluarga Bahagia /keluarga-bahagia]
    F --> F4[Lokasi Arisan /lokasi-arisan]
    H --> H1[Kelola Anggota /admin/anggota]
    H --> H2[Verifikasi Iuran /admin/verifikasi-iuran]
    H --> H3[Biaya Sosial /admin/biaya-sosial]
    H --> H4[Kelola Lokasi /admin/lokasi]
    H --> H5[Pengaturan /admin/pengaturan]
```

### Bagan Alur Pembayaran Iuran
```mermaid
flowchart TD
    A[Admin Buka Periode Iuran] --> B[Sistem Generate Tagihan untuk semua Anggota]
    B --> C[Anggota Login]
    C --> D[Lihat Iuran Saya]
    D --> E[Transfer Manual ke Rekening Arisan]
    E --> F[Unggah Bukti Transfer]
    F --> G[Status MENUNGGU]
    G --> H[Admin Buka Verifikasi Iuran]
    H --> I{Valid?}
    I -- Ya --> J[Status LUNAS di periode tersebut]
    I -- Tidak --> K[Tolak dengan Catatan]
    K --> L[Anggota Unggah Ulang]
    J --> M[Kirim Notifikasi WA ke Anggota]
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*

- **SEO**:
  - Landing page `/` wajib menggunakan `<title>` dinamis, meta description, canonical URL, dan Open Graph (OG).
  - Halaman selain `/` bersifat internal dan wajib diberi tag `noindex, nofollow`.
  - Setiap halaman dapat memiliki `metadata` dinamis dari nama halaman.
- **Keamanan**:
  - Seluruh server-side action wajib memvalidasi **role pengguna** sebelum melakukan operasi.
  - Gunakan cookie sesi `HttpOnly`, `Secure`, `SameSite=Lax`.
  - Semua input form wajib divalidasi menggunakan **Zod**.
  - Sanitasi seluruh output untuk mencegah **XSS**.
  - Proteksi **CSRF** dilakukan otomatis oleh Next.js Server Actions, sedangkan untuk route handler manual perlu pengecekan header `origin` dan `referer`.
  - OTP disimpan dalam bentuk **hash** (Argon2/bcrypt), tidak menyimpan plaintext.
  - Rate-limit untuk pengiriman OTP: minimal jeda 30 detik dan maksimal 5 kali dalam 10 menit.
  - Jangan pernah menampilkan nomor rekening arisan kepada non-anggota karena seluruh data `/iuran`, `/anggota`, dan `/biaya-sosial` bersifat privat.
- **Performa**:
  - Gunakan `<Image>` Next.js untuk semua foto profil dan bukti bayar.
  - Gunakan lazy loading untuk peta (`react-leaflet`).
  - Gunakan halaman server component untuk data yang bersifat read-only.
  - Gunakan caching pada query data publik/statis.
  - Database diakses melalui pooling URL Neon PostgreSQL dan query dioptimalkan menggunakan index.
  - Foto dan bukti transfer disimpan di BUNNY CDN, bukan di server Vercel.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*

- **Gaya Bahasa**: Profesional, ramah, dan membumi. Menggunakan kata sapaan “Anda” dan “Kami”.
  - Contoh copy utama:
    - *“ArisanKeluarga membantu pengurus dan anggota mengelola keuangan arisan dengan transparan.”*
    - *“Halo, Bu Ratna! Iuran periode ini belum Anda bayar. Silakan transfer sebelum tanggal 5.”*
    - *“Saldo kas ArisanKeluarga saat ini: Rp6.250.000 dari 36 anggota aktif.”*
- **Instruksi Data Dummy**:
  - **JANGAN PERNAH menggunakan “Lorem Ipsum”.**
  - Gunakan nama, jabatan, alamat, dan nominal dalam bahasa Indonesia yang natural.
  - Contoh data anggota:
    1. **H. Bambang Sutrisno** — Role: Super Admin, Jabatan: Ketua, Telepon: `6281234000010`
    2. **Ibu Ratna Kusuma** — Role: Administrator, Jabatan: Bendahara, Telepon: `6281234000011`
    3. **Pak Agus Wijaya** — Role: Administrator, Jabatan: Sekretaris
    4. **Bu Dewi Anggraini** — Role: Anggota, Jabatan: Anggota
    5. **Mas Eko Prasetyo** — Role: Anggota, Jabatan: Anggota
  - Contoh rincian keluarga:
    - **H. Bambang Sutrisno**: Istri: Rina Marlina; Anak: Aditya Sutrisno; Anak: Salsabila Sutrisno.
    - **Bu Dewi Anggraini**: Suami: Hendra Gunawan; Anak: Kenzie Pratama; Anak: Aurel Putri.
  - Contoh data pembayaran:
    - Periode Januari 2026: 5 anggota LUNAS, 1 anggota MENUNGGU.
    - Nominal iuran: Rp150.000 per orang.
    - Saldo awal periode: Rp900.000.
    - Pengeluaran: Santunan sakit Ibu Ratna sebesar Rp500.000.
  - Contoh data lokasi:
    - “Arisan Keliling di Rumah H. Bambang Sutrisno, Jl. Melati No. 12, Bandung. Lat: -6.9175, Long: 107.6191.”

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*

### Keputusan Arsitektur Penting
- **Next.js 15 App Router** dengan React Server Components.
- Bahasa: **TypeScript** + **Zod** untuk validasi.
- UI: **Tailwind CSS v3.4 + shadcn/ui + Lucide Icons**.
- Database: **Neon PostgreSQL + Drizzle ORM**.
- Autentikasi: **WhatsApp OTP** menggunakan **Wablas API** dan custom JWT session.
- Penyimpanan aset: **Bunny Storage + Bunny CDN**.
- Peta: **Leaflet / react-leaflet** dengan tile dari **OpenStreetMap** (tanpa API key).
- **Catatan**: Sesuai klarifikasi user bahwa metode autentikasi adalah **WhatsApp OTP**, maka *Clerk Auth tidak digunakan*. Seluruh stack lain tetap mengikuti standar Eduwebmu.
- Transport data menggunakan **Server Actions** untuk mutasi dan **Server Components** untuk pembacaan.

### Struktur Folder yang Disarankan
```bash
src/
├── app/
│   ├── (public)/page.tsx          # Landing
│   ├── (public)/login/page.tsx
│   ├── (app)/dashboard/page.tsx   # Shell untuk member
│   ├── (app)/anggota/page.tsx
│   ├── (app)/anggota/[id]/page.tsx
│   ├── (app)/anggota/[id]/pembayaran/page.tsx
│   ├── (app)/keluarga-bahagia/page.tsx
│   ├── (app)/lokasi-arisan/page.tsx
│   ├── (app)/iuran-saya/page.tsx
│   ├── (admin)/admin/dashboard/page.tsx
│   ├── (admin)/admin/keuangan/page.tsx
│   ├── (admin)/admin/anggota/page.tsx
│   ├── (admin)/admin/verifikasi-iuran/page.tsx
│   ├── (admin)/admin/biaya-sosial/page.tsx
│   ├── (admin)/admin/lokasi/page.tsx
│   └── (admin)/admin/pengaturan/page.tsx
├── components/
├── db/
│   ├── schema.ts
│   └── seed.ts
├── lib/
│   ├── auth.ts
│   ├── session.ts
│   ├── whatsapp.ts
│   ├── upload.ts
│   └── validations.ts
└── middleware.ts
```

### Variabel Lingkungan (`.env.example`)
```env
# Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/arisan?sslmode=require

# Secret untuk JWT session
AUTH_SECRET=ubah-dengan-string-acak-panjang

# Wablas - WhatsApp Gateway
WABLAS_API_URL=https://solo.wablas.com
WABLAS_TOKEN=isi-token-wablas-anda

# Bunny CDN untuk upload foto / bukti bayar
BUNNY_STORAGE_HOSTNAME=brs-xxxxxxxx.bunnycdn.com
BUNNY_STORAGE_PASSWORD=isi-password-storage
BUNNY_CDN_HOSTNAME=https://nama-pull-zone.b-cdn.net
BUNNY_STORAGE_ZONE_NAME=nama-storage-zone

# OpenStreetMap (tidak wajib API key, langsung pakai default)
NEXT_PUBLIC_MAP_TILE_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Struktur Skema Database Nyata
```typescript
// src/db/schema.ts
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  doublePrecision,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ===================== ENUM =====================
export const roleEnum = pgEnum("role_enum", [
  "SUPER_ADMIN",
  "ADMINISTRATOR",
  "REVIEWER",
  "ANGGOTA",
]);

export const positionEnum = pgEnum("position_enum", [
  "PEMBINA",
  "KETUA",
  "SEKRETARIS",
  "BENDAHARA",
  "ANGGOTA",
]);

export const paymentStatusEnum = pgEnum("payment_status_enum", [
  "UNPAID",
  "PENDING",
  "PAID",
]);

export const periodStatusEnum = pgEnum("period_status_enum", [
  "OPEN",
  "CLOSED",
]);

export const expenseCategoryEnum = pgEnum("expense_category_enum", [
  "SAKIT",
  "BANTUAN",
  "HADIAH",
  "LAINNYA",
]);

export const relationshipEnum = pgEnum("relationship_enum", [
  "SUAMI",
  "ISTRI",
  "ANAK",
  "BAPAK",
  "IBU",
  "SAUDARA",
  "LAINNYA",
]);

export const meetingStatusEnum = pgEnum("meeting_status_enum", [
  "PLANNED",
  "DONE",
  "CANCELLED",
]);

// ===================== USERS =====================
// CATATAN: Semua akun adalah anggota arisan.
// Role menentukan hak akses aplikasi, position menentukan jabatan di pohon arisan.
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  role: roleEnum("role").notNull().default("ANGGOTA"),
  position: positionEnum("position").notNull().default("ANGGOTA"),
  photoUrl: text("photo_url"),
  gender: varchar("gender", { length: 12 }),
  birthDate: timestamp("birth_date", { mode: "date" }),
  address: text("address"),
  occupation: varchar("occupation", { length: 150 }),
  parentId: uuid("parent_id").references((): any => users.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== OTP WHATSAPP =====================
export const otpCodes = pgTable(
  "otp_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phone: varchar("phone", { length: 20 }).notNull(),
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("otp_phone_idx").on(table.phone)]
);

// ===================== PERIODE IURAN =====================
export const arisanPeriods = pgTable("arisan_periods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  iuranAmount: integer("iuran_amount").notNull(),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  status: periodStatusEnum("status").notNull().default("OPEN"),
  description: text("description"),
  createdById: uuid("created_by_id").references((): any => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== PEMBAYARAN IURAN =====================
export const periodPayments = pgTable(
  "period_payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    periodId: uuid("period_id")
      .notNull()
      .references((): any => arisanPeriods.id, { onDelete: "cascade" }),
    memberId: uuid("member_id")
      .notNull()
      .references((): any => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    status: paymentStatusEnum("status").notNull().default("UNPAID"),
    transferProofUrl: text("transfer_proof_url"),
    note: text("note"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    verifiedById: uuid("verified_by_id").references((): any => users.id),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("period_payment_unique").on(table.periodId, table.memberId),
    index("payment_member_idx").on(table.memberId),
    index("payment_period_idx").on(table.periodId),
  ]
);

// ===================== BIAYA SOSIAL =====================
export const socialExpenses = pgTable("social_expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: expenseCategoryEnum("category").notNull(),
  recipientId: uuid("recipient_id").references((): any => users.id),
  amount: integer("amount").notNull(),
  expenseDate: timestamp("expense_date", { mode: "date" }).notNull(),
  description: text("description").notNull(),
  proofUrl: text("proof_url"),
  recordedById: uuid("recorded_by_id").references((): any => users.id),
  reviewedById: uuid("reviewed_by_id").references((): any => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== LOKASI / JADWAL ARISAN =====================
export const arisanMeetings = pgTable("arisan_meetings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  hostMemberId: uuid("host_member_id")
    .notNull()
    .references((): any => users.id),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: meetingStatusEnum("status").notNull().default("PLANNED"),
  notes: text("notes"),
  createdById: uuid("created_by_id")
    .notNull()
    .references((): any => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ===================== KELUARGA BAHAGIA =====================
export const familyMembers = pgTable(
  "family_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references((): any => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    relationship: relationshipEnum("relationship").notNull(),
    photoUrl: text("photo_url"),
    birthDate: timestamp("birth_date", { mode: "date" }),
    gender: varchar("gender", { length: 12 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("family_member_user_idx").on(table.userId)]
);

// ===================== PENGATURAN APLIKASI =====================
export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### Konfigurasi Drizzle
```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut dengan format checklist agar AI Coding Assistant dapat mengeksekusi fase demi fase.*

### Fase 1: Fondasi Proyek, UI/UX, & Semua Halaman (Dummy Data)
*Tujuan: Membangun seluruh antarmuka visual secara lengkap dan responsif menggunakan data dummy sebelum menyentuh database.*

- [ ] **Task 1.1 (Foundations & Design System)**: Setup Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, lucide-react, dan file `globals.css` berisi CSS variable warna sesuai Bab 4. Buat komponen dasar: `Button`, `Input`, `Card`, `Badge`, `Dialog`, `Table`, `Tabs`, `Textarea`, `Avatar`, `DropdownMenu`, `Label`, `Sonner`.
- [ ] **Task 1.2 (Layouts & Navigasi)**: Buat `Root Layout` dengan metadata landing, `Public Layout` berisi Header (logo + tombol Masuk) dan Footer, serta `App Layout` berisi Sidebar kiri yang responsif (mobile drawer), Header atas dengan profil, dan konten `max-w`.
- [ ] **Task 1.3 (Landing Page & Login Dummy)**: Buat halaman `/` yang menampilkan hero, keunggulan fitur, foto sample, dan CTA login. Buat halaman `/login` dengan form 2 langkah dummy: input nomor WA lalu input OTP, lengkap dengan timer “Kirim Ulang OTP” (masih tanpa koneksi API nyata).
- [ ] **Task 1.4 (Halaman Anggota & Pohon)**: Buat halaman `/dashboard`, `/anggota`, `/anggota/[id]`, dan `/anggota/[id]/pembayaran` dengan data dummy. Pohon anggota menggunakan komponen tree custom yang menampilkan avatar, nama, jabatan. Halaman hasil pembayaran menampilkan ringkasan status LUNAS/BELUM dan tabel riwayat pembayaran.
- [ ] **Task 1.5 (Keluarga Bahagia, Lokasi, Iuran)**: Buat halaman `/keluarga-bahagia`, `/lokasi-arisan`, dan `/iuran-saya`. Halaman lokasi berisi peta Leaflet dummy, kartu jadwal terdekat, dan histori. Halaman iuran berisi tagihan dummy dan tombol unggah bukti transfer.
- [ ] **Task 1.6 (Halaman Admin Back Office Dummy)**: Buat halaman `/admin/dashboard`, `/admin/keuangan`, `/admin/anggota`, `/admin/verifikasi-iuran`, `/admin/biaya-sosial`, `/admin/lokasi`, dan `/admin/pengaturan` lengkap dengan modal form, tabel CRUD dummy, filter status, dan search bar.
- [ ] **Task 1.7 (Responsive & Visual QA Dummy)**: Pastikan seluruh halaman di Fase 1 tampil sempurna di mobile, tablet, dan desktop. Tidak boleh ada halaman kosong/placeholder dan tidak boleh ada teks “Lorem Ipsum”.

### Fase 2: Database, Autentikasi WhatsApp OTP, & Integrasi Data Dinamis
*Tujuan: Menghidupkan seluruh halaman dengan database Neon PostgreSQL dan sistem login WhatsApp OTP nyata melalui Wablas.*

- [ ] **Task 2.1 (Database Schema & Migrations)**: Implementasikan `src/db/schema.ts` sesuai Bab 10, jalankan migrasi dengan Drizzle Kit ke Neon PostgreSQL, dan buat script `src/db/seed.ts` berisi data dummy berbahasa Indonesia yang natural.
- [ ] **Task 2.2 (Service WhatsApp & OTP)**: Buat `lib/whatsapp.ts` untuk mengirim pesan Wablas, buat `lib/auth.ts` untuk generate & verifikasi OTP, hash OTP, session cookie `HttpOnly`, serta `middleware.ts` untuk proteksi route sesuai role `SUPER_ADMIN`, `ADMINISTRATOR`, `REVIEWER`, dan `ANGGOTA`.
- [ ] **Task 2.3 (Halaman Login Real)**: Hubungkan halaman `/login` ke Server Actions `/api/auth/request-otp` dan `/api/auth/verify-otp`. Pastikan nomor harus terdaftar, OTP hanya 5 menit, maksimal 3 percobaan, dan tombol kirim ulang aktif setelah 30 detik.
- [ ] **Task 2.4 (CRUD Server Actions: Users & Anggota)**: Buat Server Action untuk menambah, mengubah, menonaktifkan, dan menghapus anggota, termasuk mengubah `role`, `position`, `parentId`, upload foto ke Bunny CDN, dan update pohon anggota.
- [ ] **Task 2.5 (CRUD Server Actions: Periode & Iuran)**: Buat Server Action untuk:
  - Membuka periode arisan baru.
  - Generate `periodPayments` otomatis untuk semua user aktif.
  - Mengunggah bukti transfer oleh anggota.
  - Memverifikasi pembayaran oleh admin.
  - Menghapus periode beserta relasi pembayarannya.
- [ ] **Task 2.6 (CRUD Server Actions: Biaya Sosial, Lokasi, Keluarga, Settings)**: Buat Server Action CRUD untuk `socialExpenses`, `arisanMeetings`, `familyMembers`, dan `appSettings`, termasuk upload bukti dukung ke Bunny CDN dan update koordinat latitude/longitude.
- [ ] **Task 2.7 (Frontend Data Binding)**: Hubungkan seluruh halaman dari Fase 1 dengan Server Actions dan database — dashboard, pohon anggota, hasil pembayaran, iuran saya, rekap keuangan, verifikasi iuran, biaya sosial, lokasi, keluarga bahagia, dan pengaturan.
- [ ] **Task 2.8 (Authorization & Role Guard)**: Pastikan anggota hanya dapat melihat pembayaran miliknya sendiri; Reviewer hanya melihat/mengaudit back office; Administrator tidak bisa menghapus Super Admin; hanya Super Admin yang bisa mengubah role pengguna lain.

### Fase 3: Integrasi Notifikasi WhatsApp, Keamanan, SEO, & Deployment
*Tujuan: Menyempurnakan integrasi Wablas untuk notifikasi, menguatkan keamanan, optimasi performa, dan rilis ke production.*

- [ ] **Task 3.1 (Notifikasi WhatsApp Otomatis)**: Integrasikan pengiriman notifikasi WhatsApp melalui Wablas untuk event: buat tagihan periode, ada bukti bayar baru, verifikasi pembayaran, pembatalan/tolak pembayaran, jadwal arisan baru, dan pengingat batas bayar H-3.
- [ ] **Task 3.2 (Upload File & Bunny CDN Hardening)**: Pastikan seluruh foto profil, bukti transfer, dan bukti biaya sosial tersimpan di Bunny Storage dengan path unik. Validasi tipe file dan ukuran file maksimal 2MB.
- [ ] **Task 3.3 (SEO & Metadata)**: Terapkan dynamic metadata untuk landing page; seluruh halaman internal menggunakan `noindex, nofollow`. Pastikan seluruh `title`, `description`, dan Open Graph memakai data dinamis asli.
- [ ] **Task 3.4 (Security & Rate-Limiting)**: Pasang validasi Zod menyeluruh di semua Server Actions, pencegahan XSS, proteksi CSRF route handler, rate-limit OTP, dan secret management dengan `.env.production`.
- [ ] **Task 3.5 (End-to-End Testing & Bugfix)**: Lakukan uji alur lengkap: login OTP → lihat tagihan → upload bukti → verifikasi admin → tampil di rekap keuangan. Uji alur biaya sosial, kelola lokasi, pohon anggota, dan keluarga bahagia di semua role. Perbaiki semua error dan responsive glitches.
- [ ] **Task 3.6 (Production Build & Deployment)**: Verifikasi kelulusan `npm run build`, atur environment production di Vercel/Neon/Bunny/Wablas, lakukan migrasi database produksi, seed akun Super Admin awal, dan deploy aplikasi. Setelah deploy, lakukan smoke test.

---

## 12. Master Starter Prompt (Siap Coding untuk AI Agent)
*Salin prompt di bawah ini ke AI Coding Assistant (Google Antigravity / Cursor / Claude Code / GitHub Copilot / Roo Code / dll.) untuk memulai pengerjaan:*

```markdown
Halo! Kamu berperan sebagai Senior Fullstack Architect dan Lead Developer.

Saya ingin membangun aplikasi web "ArisanKeluarga" berdasarkan dokumen PRD berikut.

Silakan baca file @PRD.md

ATURAN EKSEKUSI (WAJIB DIPATUHI):
1. JANGAN PERNAH membuat seluruh kode aplikasi sekaligus dalam satu putaran agar tidak terjadi error atau kehabisan context window.
2. Kerjakan secara BERTAHAP PER FASE sesuai Bab 11 PRD.
3. Fase 1: Selesaikan seluruh task 1.1 sampai 1.7 secara tuntas dalam satu putaran kerja, lalu BERHENTI.
4. Setelah Fase 1 selesai, laporkan apa saja yang telah dikerjakan, halaman apa saja yang sudah dibuat, dan minta konfirmasi saya sebelum melanjutkan ke Fase 2.
5. Patuhi Tech Stack, Database Schema, dan UI/UX Design System di dalam PRD ini.
6. JANGAN PERNAH menggunakan "Lorem Ipsum"; semua dummy-text harus berbahasa Indonesia dan relevan dengan arisan.
7. JANGAN membuat halaman placeholder atau "Sedang dalam pengembangan". Semua halaman harus selesai penuh dengan data dummy maupun data asli.

Jika kamu sudah membaca dan memahami PRD, berikan ringkasan singkat pemahamanmu lalu langsung mulai Fase 1 dari Task 1.1. Bekerjalah sampai Fase 1 selesai, kemudian tunggu konfirmasi saya.
```

---

**Dokumen ini siap digunakan sebagai acuan tunggal untuk membangun ArisanKeluarga dari nol hingga production. Selamat membangun!**
