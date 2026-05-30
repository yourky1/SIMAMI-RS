import { Activity, AlertTriangle, ArrowRight, BarChart3, CalendarClock, CheckCircle2, Clock3, PackageCheck, Plus, ShoppingBag, Sparkles, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/ui/PageHeader.jsx";
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
  const available = assets.filter((asset) => asset.status === "Tersedia").length;
  const borrowed = assets.filter((asset) => ["Dipakai", "Dipinjam"].includes(asset.status)).length;
  const maintenance = assets.filter((asset) => asset.status === "Maintenance").length;
  const waiting = borrowRequests.filter((item) => item.status === "Menunggu Persetujuan").length;

  return (
    <div>
      <div className="mb-7 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="premium-dark relative overflow-hidden rounded-[2.2rem] p-7 text-white shadow-soft lg:p-8">
          <div className="absolute -right-16 -top-20 h-80 w-80 rounded-full bg-emerald-300/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-cyan-300/12 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-100">
              <Sparkles size={14} /> Admin Intelligence Center
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Semua aset medis, peminjaman, dan maintenance dalam satu kendali.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85">
              Dashboard premium untuk melihat kesehatan inventaris rumah sakit secara cepat, jelas, dan tidak membuat admin ingin kembali ke Excel. Walau Excel tentu masih merasa paling berjasa.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/approvals" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg hover:bg-emerald-50">
                Kelola Approval <ArrowRight size={18} />
              </Link>
              <Link to="/assets/new" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
                Tambah Aset <Plus size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur-xl">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-amber-300/25 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700 ring-1 ring-amber-100">
              <Clock3 />
            </div>
            <div>
              <p className="text-sm font-black text-slate-500">Butuh keputusan</p>
              <p className="text-4xl font-black text-slate-950">{waiting}</p>
            </div>
          </div>
          <p className="relative mt-5 text-sm leading-7 text-slate-500">Pengajuan peminjaman menunggu keputusan admin. Kalau dibiarkan, alatnya tetap diam, manusia tetap bertanya, dan sistem tetap menghela napas.</p>
          <Link to="/approvals" className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 hover:bg-emerald-700">
            Review Sekarang <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      <PageHeader
        eyebrow="Executive Overview"
        title="Dashboard Ketersediaan Aset"
        description="Pantau lokasi, status, mutasi, peminjaman, dan jadwal maintenance alat medis secara ringkas."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Aset" value={assets.length} note="Tercatat di sistem" icon={PackageCheck} />
        <StatCard title="Aset Tersedia" value={available} note="Siap digunakan" icon={CheckCircle2} tone="blue" />
        <StatCard title="Dipakai / Dipinjam" value={borrowed} note="Dalam transaksi aktif" icon={Activity} tone="amber" />
        <StatCard title="Maintenance" value={maintenance} note="Perlu teknisi" icon={Wrench} tone="rose" />
        <StatCard title="Pengajuan Baru" value={waiting} note="Menunggu approval" icon={ShoppingBag} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Aktivitas Operasional Bulanan</h2>
              <p className="text-sm text-slate-500">Mutasi, maintenance, dan peminjaman alat</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 ring-1 ring-emerald-100">
              <BarChart3 size={22} />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="mutasi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.28}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="maintenance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="pinjam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.22}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="mutasi" stroke="#059669" strokeWidth={3} fill="url(#mutasi)" />
                <Area type="monotone" dataKey="maintenance" stroke="#2563eb" strokeWidth={3} fill="url(#maintenance)" />
                <Area type="monotone" dataKey="pinjam" stroke="#f59e0b" strokeWidth={3} fill="url(#pinjam)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl">
          <h2 className="text-xl font-black text-slate-950">Perlu Perhatian</h2>
          <p className="text-sm text-slate-500">Prioritas operasional hari ini</p>
          <div className="mt-5 space-y-3">
            <div className="rounded-3xl border border-rose-100 bg-rose-50/80 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-1 text-rose-600" size={20} />
                <div><p className="font-black text-rose-900">Defibrillator butuh kalibrasi</p><p className="text-sm leading-6 text-rose-700">Lokasi: Ruang Operasi. Teknisi sudah dijadwalkan.</p></div>
              </div>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-amber-50/80 p-4">
              <div className="flex gap-3">
                <CalendarClock className="mt-1 text-amber-600" size={20} />
                <div><p className="font-black text-amber-900">Approval peminjaman aktif</p><p className="text-sm leading-6 text-amber-700">{waiting} pengajuan menunggu keputusan.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur-xl">
        <h2 className="text-xl font-black text-slate-950">Mutasi Terbaru</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <tbody className="divide-y divide-slate-100">
              {mutations.slice(0, 4).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="whitespace-nowrap py-4 font-black text-slate-900">{row.id}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold">{row.assetName}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">{row.fromLocation} → {row.toLocation}</td>
                  <td className="whitespace-nowrap px-4 py-4"><StatusBadge value={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
