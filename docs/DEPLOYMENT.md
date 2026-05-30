# Deployment SIMAMI-RS

## Frontend

Rekomendasi: Vercel atau Netlify.

1. Build frontend:

```bash
cd frontend
npm install
npm run build
```

2. Deploy folder `dist`.

3. Set environment:

```txt
VITE_API_BASE_URL=https://domain-api-anda.com/api
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Backend

Rekomendasi: Railway, Render, VPS, atau Docker.

1. Install dependency:

```bash
cd backend
npm install
```

2. Set `.env`.

3. Jalankan:

```bash
npm start
```

## Database

Gunakan Supabase PostgreSQL.

1. Jalankan `database/schema.sql`.
2. Jalankan `database/seed.sql`.
3. Aktifkan Row Level Security jika sudah memakai Supabase Auth produksi.

## Catatan Produksi

- Ganti JWT_SECRET.
- Jangan expose Service Role Key ke frontend.
- Tambahkan rate limit untuk endpoint login.
- Gunakan HTTPS.
- Backup database otomatis.
- Uji QR scanner di perangkat Android dan iOS.
