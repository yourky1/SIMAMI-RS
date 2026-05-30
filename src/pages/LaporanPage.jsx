import { FileBarChart2, Download, FileText, Table2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import { asets, riwayatMutasi, jadwalMaintenance, getDashboardStats } from '../data/dummy';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const lokasData = {};
asets.forEach(a => { lokasData[a.lokasi] = (lokasData[a.lokasi] || 0) + 1; });
const lokasiChart = Object.entries(lokasData).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 8);

export default function LaporanPage() {
  const stats = getDashboardStats();

  const handleExportDummy = (type) => {
    alert(`Fitur export ke ${type} akan terhubung ke backend Node.js + Supabase. Saat ini dalam mode demo.`);
  };

  return (
    <AppLayout title="Laporan & Audit Aset" subtitle="Ringkasan dan laporan kondisi aset medis RS Permata Medika">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Aset Terdaftar', value: stats.total, color: 'text-slate-800' },
          { label: 'Aset Tersedia', value: stats.tersedia, color: 'text-emerald-600' },
          { label: 'Sedang Dipinjam', value: stats.dipinjam, color: 'text-blue-600' },
          { label: 'Perlu Perhatian', value: stats.bermasalah + stats.maintenance, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Laporan per Lokasi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Jumlah Aset per Lokasi</h3>
            <div className="flex gap-2">
              <button onClick={() => handleExportDummy('PDF')} className="btn-secondary py-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <button onClick={() => handleExportDummy('Excel')} className="btn-secondary py-1.5 text-xs">
                <Table2 className="w-3.5 h-3.5" /> Excel
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={lokasiChart} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip />
              <Bar dataKey="value" name="Aset" fill="#32a86d" radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Laporan Status Aset</h3>
            <button onClick={() => handleExportDummy('PDF')} className="btn-secondary py-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="table-header px-4 py-3 text-left">Aset</th>
                  <th className="table-header px-4 py-3 text-left">Lokasi</th>
                  <th className="table-header px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {asets.slice(0, 7).map(a => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5">
                      <p className="text-xs font-medium text-slate-800 leading-snug">{a.nama}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{a.kode}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{a.lokasi}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={a.status} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Laporan Mutasi & Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Laporan Mutasi Terbaru</h3>
            <button onClick={() => handleExportDummy('Excel')} className="btn-secondary py-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {riwayatMutasi.map(m => (
              <div key={m.id} className="px-5 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-800">{m.namaAset}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.lokasiAsal} → {m.lokasiTujuan}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.tanggal}</p>
                  </div>
                  <StatusBadge status={m.statusKembali} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Laporan Maintenance</h3>
            <button onClick={() => handleExportDummy('PDF')} className="btn-secondary py-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {jadwalMaintenance.map(m => (
              <div key={m.id} className="px-5 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-800">{m.namaAset}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.jenisMaintenance}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.tanggalMulai} · {m.teknisi}</p>
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
