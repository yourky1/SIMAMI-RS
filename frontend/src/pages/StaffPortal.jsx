import { ArrowRight, CalendarClock, CheckCircle2, Clock3, HeartPulse, PackageSearch, QrCode, ShoppingBag, Sparkles, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import AssetVisual from "../components/ui/AssetVisual.jsx";
import BorrowRequestCard from "../components/ui/BorrowRequestCard.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatCard from "../components/ui/StatCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

export default function StaffPortal() {
  const { assets, borrowRequests } = useData();
  const available = assets.filter((asset) => asset.status === "Tersedia").length;
  const waiting = borrowRequests.filter((item) => item.status === "Menunggu Persetujuan").length;
  const activeBorrow = borrowRequests.filter((item) => item.status === "Sedang Dipinjam").length;
  const featuredAssets = assets.filter((asset) => asset.status === "Tersedia").slice(0, 3);

  return (
    <div>
      <div className="premium-dark relative mb-7 overflow-hidden rounded-[2.3rem] p-6 text-white shadow-soft lg:p-9">
        <div className="absolute -right-16 -top-20 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
              <Sparkles size={14} /> Premium Staff Portal
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Pinjam alat medis semudah memilih layanan internal.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
              Cari alat, ajukan peminjaman, pantau approval, scan QR, dan kembalikan alat dari satu tempat. Rasanya seperti aplikasi modern, bukan formulir yang lahir dari printer lelah.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/catalog" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-emerald-50">
                Lihat Katalog Alat <ArrowRight size={18} />
              </Link>
              <Link to="/scan" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
                Scan QR Aset <QrCode size={18} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur">
              <PackageSearch className="text-emerald-200" />
              <p className="mt-5 text-5xl font-black">{available}</p>
              <p className="text-sm text-emerald-50/75">Alat tersedia</p>
            </div>
            <div className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur">
              <Clock3 className="text-amber-200" />
              <p className="mt-5 text-5xl font-black">{waiting}</p>
              <p className="text-sm text-emerald-50/75">Menunggu approval</p>
            </div>
            <div className="rounded-[1.7rem] border border-white/10 bg-white/10 p-5 shadow-lg backdrop-blur sm:col-span-2">
              <HeartPulse className="text-rose-200" />
              <p className="mt-5 text-5xl font-black">{activeBorrow}</p>
              <p className="text-sm text-emerald-50/75">Peminjaman aktif hari ini</p>
            </div>
          </div>
        </div>
      </div>

      <PageHeader
        eyebrow="Staff Experience"
        title="Ringkasan Portal Petugas"
        description="Akses cepat untuk meminjam alat, memantau status pengajuan, dan melihat alat yang paling sering dibutuhkan."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Katalog Aktif" value={assets.length} note="Alat medis terdaftar" icon={Stethoscope} tone="emerald" />
        <StatCard title="Siap Dipinjam" value={available} note="Status tersedia" icon={CheckCircle2} tone="blue" />
        <StatCard title="Deadline Kembali" value="1" note="Perlu dikembalikan besok" icon={CalendarClock} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Alat Siap Dipinjam</h2>
              <p className="text-sm text-slate-500">Rekomendasi cepat untuk petugas</p>
            </div>
            <Link to="/catalog" className="text-sm font-black text-emerald-700">Semua</Link>
          </div>
          <div className="space-y-4">
            {featuredAssets.map((asset) => (
              <Link key={asset.id} to="/catalog" className="group flex gap-4 rounded-[1.6rem] border border-slate-100 bg-white/70 p-3 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-md">
                <AssetVisual type={asset.image} className="h-28 w-28 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={asset.status} />
                    <StatusBadge value={asset.priority} />
                  </div>
                  <h3 className="mt-2 font-black text-slate-950">{asset.name}</h3>
                  <p className="text-sm text-slate-500">{asset.location} • {asset.condition}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl">
            <h2 className="text-xl font-black text-slate-950">Status Peminjaman Terbaru</h2>
            <p className="text-sm text-slate-500">Progres pengajuan dan pengembalian</p>
          </div>
          {borrowRequests.slice(0, 2).map((request) => (
            <BorrowRequestCard key={request.id} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
}
