import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
        <h1 className="text-4xl font-black text-slate-950">404</h1>
        <p className="mt-2 text-slate-500">Halaman tidak ditemukan.</p>
        <Link to="/" className="mt-6 inline-block rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Kembali ke Dashboard</Link>
      </div>
    </div>
  );
}
