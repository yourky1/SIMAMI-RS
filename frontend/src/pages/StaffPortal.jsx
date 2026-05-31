import { ArrowRight, CalendarClock, CheckCircle2, Clock3, HeartPulse, PackageSearch, QrCode, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import AssetVisual from "../components/ui/AssetVisual.jsx";
import BorrowRequestCard from "../components/ui/BorrowRequestCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

export default function StaffPortal() {
  const { assets, borrowRequests } = useData();
  const available = assets.filter((a) => a.status === "Tersedia").length;
  const waiting = borrowRequests.filter((r) => r.status === "Menunggu Persetujuan").length;
  const activeBorrow = borrowRequests.filter((r) => r.status === "Sedang Dipinjam").length;
  const featuredAssets = assets.filter((a) => a.status === "Tersedia").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* ── Hero Section ── */}
      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-6 text-white lg:p-8">
        {/* Accent glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          {/* Left: text */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-teal-600/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-teal-300 ring-1 ring-teal-500/30">
              Staff Portal
            </span>
            <h1 className="mt-4 max-w-lg text-2xl font-semibold leading-snug tracking-tight text-white md:text-3xl">
              Pinjam alat medis semudah memilih layanan internal.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              Cari alat, ajukan peminjaman, pantau approval, scan QR, dan kembalikan alat dari satu tempat.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
              >
                Lihat Katalog Alat <ArrowRight size={15} />
              </Link>
              <Link
                to="/scan"
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
              >
                Scan QR Aset <QrCode size={15} />
              </Link>
            </div>
          </div>

          {/* Right: stat mini-cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <PackageSearch size={18} className="text-teal-400" />
              <p className="mt-3 text-3xl font-semibold text-white">{available}</p>
              <p className="mt-0.5 text-xs text-slate-400">Alat tersedia</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
              <Clock3 size={18} className="text-amber-400" />
              <p className="mt-3 text-3xl font-semibold text-white">{waiting}</p>
              <p className="mt-0.5 text-xs text-slate-400">Menunggu approval</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 sm:col-span-2">
              <HeartPulse size={18} className="text-rose-400" />
              <p className="mt-3 text-3xl font-semibold text-white">{activeBorrow}</p>
              <p className="mt-0.5 text-xs text-slate-400">Peminjaman aktif hari ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary ── */}
      <PageHeader
        eyebrow="Staff Experience"
        title="Ringkasan Portal Petugas"
        description="Akses cepat untuk meminjam alat, memantau status pengajuan, dan melihat alat yang paling sering dibutuhkan."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard title="Katalog Aktif" value={assets.length} note="Alat medis terdaftar" icon={Stethoscope} tone="teal" />
        <StatCard title="Siap Dipinjam" value={available} note="Status tersedia" icon={CheckCircle2} tone="emerald" />
        <StatCard title="Deadline Kembali" value="1" note="Perlu dikembalikan besok" icon={CalendarClock} tone="amber" />
      </div>

      {/* ── Main content ── */}
      <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        {/* Alat Siap Dipinjam */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Alat Siap Dipinjam</h2>
              <p className="text-xs text-slate-400">Rekomendasi cepat untuk petugas</p>
            </div>
            <Link to="/catalog" className="text-xs font-medium text-teal-600 hover:text-teal-700">
              Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {featuredAssets.map((asset) => (
              <Link
                key={asset.id}
                to="/catalog"
                className="flex gap-3 rounded-lg border border-slate-100 p-3 transition hover:border-teal-200 hover:bg-teal-50"
              >
                {/* Asset visual — ukuran lebih kecil */}
                <div className="h-16 w-16 shrink-0">
                  <AssetVisual type={asset.image} className="h-16 w-16" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge value={asset.status} />
                    <StatusBadge value={asset.priority} />
                  </div>
                  <p className="mt-1.5 font-semibold text-slate-900">{asset.name}</p>
                  <p className="text-xs text-slate-500">{asset.location} • {asset.condition}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Status Peminjaman Terbaru */}
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900">Status Peminjaman Terbaru</h2>
            <p className="text-xs text-slate-400">Progres pengajuan dan pengembalian</p>
          </div>
          {borrowRequests.slice(0, 2).map((request) => (
            <BorrowRequestCard key={request.id} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
}
