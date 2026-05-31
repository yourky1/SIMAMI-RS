import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  PackageCheck,
  Plus,
  ShoppingBag,
  Wrench
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import StatCard from "../components/ui/StatCard.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

const chartData = [
  { month: "Jan", mutasi: 42, maintenance: 11, pinjam: 28 },
  { month: "Feb", mutasi: 51, maintenance: 14, pinjam: 33 },
  { month: "Mar", mutasi: 48, maintenance: 12, pinjam: 29 },
  { month: "Apr", mutasi: 59, maintenance: 17, pinjam: 41 },
  { month: "Mei", mutasi: 66, maintenance: 19, pinjam: 46 }
];

export default function Dashboard() {
  const { assets, mutations, borrowRequests } = useData();
  const available = assets.filter((a) => a.status === "Tersedia").length;
  const borrowed = assets.filter((a) => ["Dipakai", "Dipinjam"].includes(a.status)).length;
  const maintenance = assets.filter((a) => a.status === "Maintenance").length;
  const waiting = borrowRequests.filter((r) => r.status === "Menunggu Persetujuan").length;

  return (
    <div className="space-y-6">
      {/* Hero Section — two-column, no glassmorphism */}
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        {/* Left: Overview card */}
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-md bg-teal-600/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-teal-300 ring-1 ring-teal-500/30">
                Admin Intelligence Center
              </span>
              <h1 className="mt-4 max-w-lg text-2xl font-semibold leading-snug tracking-tight text-white">
                Semua aset medis, peminjaman, dan maintenance dalam satu kendali.
              </h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                Dashboard untuk melihat kesehatan inventaris rumah sakit secara cepat dan jelas.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/approvals"
              className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
            >
              Kelola Approval <ArrowRight size={15} />
            </Link>
            <Link
              to="/assets/new"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
            >
              Tambah Aset <Plus size={15} />
            </Link>
          </div>
        </div>

        {/* Right: Pending approval card */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-amber-50 p-2.5 text-amber-600 ring-1 ring-amber-200">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Butuh keputusan</p>
              <p className="text-3xl font-semibold text-slate-900">{waiting}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Pengajuan peminjaman menunggu keputusan admin. Pastikan tidak ada yang terlewat.
          </p>
          <Link
            to="/approvals"
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Review Sekarang <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Executive Overview
        </p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Total Aset" value={assets.length} note="Tercatat di sistem" icon={PackageCheck} tone="teal" />
          <StatCard title="Tersedia" value={available} note="Siap digunakan" icon={CheckCircle2} tone="emerald" />
          <StatCard title="Dipakai / Dipinjam" value={borrowed} note="Dalam transaksi" icon={Activity} tone="blue" />
          <StatCard title="Maintenance" value={maintenance} note="Perlu teknisi" icon={Wrench} tone="rose" />
          <StatCard title="Pengajuan Baru" value={waiting} note="Menunggu approval" icon={ShoppingBag} tone="amber" />
        </div>
      </div>

      {/* Chart + Alerts */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Chart */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Aktivitas Operasional Bulanan</h2>
              <p className="text-xs text-slate-400">Mutasi, maintenance, dan peminjaman alat</p>
            </div>
            <div className="rounded-md bg-teal-50 p-2 text-teal-700 ring-1 ring-teal-200">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gMutasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gMaintenance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPinjam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
                  }}
                />
                <Area type="monotone" dataKey="mutasi" stroke="#0d9488" strokeWidth={2} fill="url(#gMutasi)" name="Mutasi" />
                <Area type="monotone" dataKey="maintenance" stroke="#3b82f6" strokeWidth={2} fill="url(#gMaintenance)" name="Maintenance" />
                <Area type="monotone" dataKey="pinjam" stroke="#f59e0b" strokeWidth={2} fill="url(#gPinjam)" name="Peminjaman" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-900">Perlu Perhatian</h2>
          <p className="text-xs text-slate-400">Prioritas operasional hari ini</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-md border border-rose-100 bg-rose-50 p-3.5">
              <div className="flex gap-2.5">
                <AlertTriangle className="mt-0.5 shrink-0 text-rose-600" size={16} />
                <div>
                  <p className="text-sm font-semibold text-rose-900">Defibrillator butuh kalibrasi</p>
                  <p className="mt-0.5 text-xs leading-5 text-rose-600">Lokasi: Ruang Operasi. Teknisi terjadwal.</p>
                </div>
              </div>
            </div>
            <div className="rounded-md border border-amber-100 bg-amber-50 p-3.5">
              <div className="flex gap-2.5">
                <CalendarClock className="mt-0.5 shrink-0 text-amber-600" size={16} />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Approval peminjaman aktif</p>
                  <p className="mt-0.5 text-xs leading-5 text-amber-600">
                    {waiting} pengajuan menunggu keputusan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Mutations Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Mutasi Terbaru</h2>
          <Link
            to="/mutations"
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
          >
            Lihat Semua <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">ID</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Aset</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Perpindahan</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {mutations.slice(0, 5).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-medium text-slate-600">{row.id}</td>
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-800">{row.assetName}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-slate-500">
                    {row.fromLocation} → {row.toLocation}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <StatusBadge value={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
