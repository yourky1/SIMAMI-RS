# Dokumentasi API SIMAMI-RS Premium

Base URL:

```txt
http://localhost:5000/api
```

## Auth

### POST /auth/login

Body:

```json
{
  "email": "admin.simami@permata-medika.id",
  "password": "password"
}
```

## Assets

### GET /assets
Mengambil seluruh data aset.

### POST /assets
Membuat data aset baru.

### GET /assets/:id
Mengambil detail aset.

### PUT /assets/:id
Memperbarui data aset.

### DELETE /assets/:id
Menghapus aset.

### GET /assets/:id/qr
Generate QR Code aset dalam format Data URL.

## Borrow Requests

### GET /borrows
Mengambil daftar pengajuan peminjaman alat.

### POST /borrows
Membuat pengajuan peminjaman alat.

Body:

```json
{
  "asset_id": "AST-GUD-031",
  "borrower": "Siti Aminah",
  "borrower_role": "Petugas Bangsal",
  "unit": "Bangsal Mawar",
  "from_location": "Gudang Alat Medis",
  "to_location": "Bangsal Mawar",
  "purpose": "Terapi inhalasi pasien anak.",
  "expected_return": "2026-05-18"
}
```

### PATCH /borrows/:id/status

Body:

```json
{
  "status": "Disetujui"
}
```

Status yang didukung:
- Menunggu Persetujuan
- Disetujui
- Sedang Dipinjam
- Selesai
- Ditolak

## Mutations

### GET /mutations
Mengambil riwayat mutasi aset.

### POST /mutations
Mencatat mutasi atau peminjaman aset.

## Maintenance

### GET /maintenance
Mengambil jadwal dan riwayat maintenance.

### POST /maintenance
Membuat jadwal maintenance.

### PUT /maintenance/:id
Memperbarui hasil maintenance.

## Reports

### GET /reports/summary
Mengambil ringkasan audit aset.

## Users

### GET /users
Mengambil daftar user. Role Administrator.

### POST /users
Membuat user baru. Role Administrator.
