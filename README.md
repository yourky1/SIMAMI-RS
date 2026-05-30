# SIMAMI-RS

SIMAMI-RS adalah aplikasi web fullstack untuk manajemen aset, inventaris, peminjaman, approval, QR Code, mutasi, dan maintenance alat medis rumah sakit.

Versi ini berfokus pada tampilan premium, user friendly, dan pengalaman visual yang lebih kuat.

## Peningkatan Versi Ultimate

- UI premium dengan glassmorphism, gradient, soft shadow, dan layout modern.
- Sidebar kiri tetap diam saat konten kanan discroll.
- Portal admin, petugas, dan teknisi tetap terpisah berdasarkan role.
- Menu berubah otomatis sesuai role.
- Header lebih clean dan modern.
- Dashboard admin dibuat seperti command center.
- Portal petugas dibuat seperti aplikasi internal premium.
- Katalog alat dibuat seperti marketplace internal rumah sakit.
- Card aset visual dan memanjakan mata.
- Timeline peminjaman lebih rapi.
- Modal, form, search bar, badge, dan statistic card halus.
- Tetap responsif untuk desktop, tablet, dan mobile.

## Akun Login Demo

### Administrator

```txt
Email    : admin.simami@permata-medika.id
Password : password
```

Akses:
- Dashboard Admin
- Approval Peminjaman
- Data Aset
- Tambah/Edit/Hapus Aset
- QR Code
- Mutasi Aset
- Maintenance
- Laporan
- Manajemen User
- Pengaturan

### Petugas Bangsal

```txt
Email    : siti@permata-medika.id
Password : password
```

Akses:
- Portal Petugas
- Katalog Alat
- Ajukan Peminjaman
- Peminjaman Saya
- Scan QR
- Profil

### Teknisi

```txt
Email    : budi@permata-medika.id
Password : password
```

Akses:
- Maintenance
- Scan QR
- Detail Aset
- Profil

## Cara Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Jika PowerShell memblokir npm:

```powershell
npm.cmd install
npm.cmd run dev
```

Buka:

```txt
http://localhost:5173
```

## Cara Menjalankan Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend berjalan di:

```txt
http://localhost:5000
```

## Setup Database Supabase

Jalankan di Supabase SQL Editor:

```txt
database/schema.sql
database/seed.sql
```

## Penting Jika Pernah Menjalankan Versi Lama

Bersihkan localStorage agar role/login lama tidak tersimpan:

```txt
Inspect → Application → Local Storage → Clear
```

Atau buka menggunakan Incognito Mode.
