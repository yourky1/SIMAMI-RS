import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Package, CheckCircle2, ArrowLeftRight, Wrench, AlertTriangle, Clock } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import { getDashboardStats, getStatusChartData, riwayatMutasi, jadwalMaintenance, asets } from '../data/dummy';

const monthlyData = [
  { bulan: 'Jan', mutasi: 8, maintenance: 2 },
  { bulan: 'Feb', mutasi: 12, maintenance: 3 },
  { bulan: 'Mar', mutasi: 7, maintenance: 1 },
  { bulan: 'Apr', mutasi: 15, maintenance: 4 },
  { bulan: 'Mei', mutasi: 5, maintenance: 3 },
];

export default function DashboardPage() {
  const stats = getDashboardStats();
  const chartData = getStatusChartData();

  const recentMutasi = riwayatMutasi.slice(0, 4);
  const upcomingMaintenance = jadwalMaintenance
    .filter(m => m.status !== 'Selesai')
    .slice(0, 3);

  return (
    <AppLayout title="Dashboard" subtitle="Ringkasan kondisi aset medis RS Permata Medika">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <StatCard title="Total Aset" value={stats.total} icon={Package} color="slate" />
        <StatCard title="Tersedia" value={stats.tersedia} icon={CheckCircle2} color="primary" subtitle="Siap digunakan" />
        <StatCard title="Dipinjam" value={stats.dipinjam} icon={ArrowLeftRight} color="blue" subtitle="Sedang dimutasikan" />
        <StatCard title="Maintenance" value={stats.maintenance} icon={Wrench} color="amber" subtitle="Dalam perbaikan" />
        <StatCard title="Bermasalah" value={stats.bermasalah} icon={AlertTriangle} color="red" subtitle="Perlu perhatian" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Pie Chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Status Aset</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} unit`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {chartData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Aktivitas Bulanan</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="mutasi" name="Mutasi" fill="#32a86d" radius={[3,3,0,0]} />
              <Bar dataKey="maintenance" name="Maintenance" fill="#2563eb" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Mutasi */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Aktivitas Mutasi Terbaru</h3>
            <a href="/mutasi" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Lihat semua</a>
          </div>
          <div className="divide-y divide-slate-50">
            {recentMutasi.map(m => (
              <div key={m.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{m.namaAset}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {m.lokasiAsal} → {m.lokasiTujuan}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{m.tanggal} · {m.petugas}</p>
                  </div>
                  <StatusBadge status={m.statusKembali} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Maintenance Aktif</h3>
            <a href="/maintenance" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Lihat semua</a>
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingMaintenance.map(m => (
              <div key={m.id} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{m.namaAset}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.jenisMaintenance}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      Teknisi: {m.teknisi}
                    </div>
                  </div>
                  <StatusBadge status={m.status} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
