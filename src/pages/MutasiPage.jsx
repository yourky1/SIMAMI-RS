import { useState } from 'react';
import { Search, ArrowRight, Clock, Eye } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { riwayatMutasi } from '../data/dummy';

export default function MutasiPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [detail, setDetail] = useState(null);

  const filtered = riwayatMutasi.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.namaAset.toLowerCase().includes(q) ||
      m.lokasiAsal.toLowerCase().includes(q) || m.lokasiTujuan.toLowerCase().includes(q) ||
      m.petugas.toLowerCase().includes(q);
    const matchStatus = !filterStatus || m.statusKembali === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AppLayout title="Riwayat Mutasi & Peminjaman" subtitle={`${filtered.length} transaksi ditemukan`}>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input className="text-sm outline-none flex-1 placeholder-slate-400 bg-transparent"
            placeholder="Cari nama aset, lokasi, atau petugas..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option>Selesai</option>
          <option>Belum Dikembalikan</option>
          <option>Dalam Proses</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card py-16 text-center text-sm text-slate-400">Tidak ada riwayat mutasi yang sesuai filter.</div>
        ) : filtered.map(m => (
          <div key={m.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <p className="text-sm font-semibold text-slate-800">{m.namaAset}</p>
                  <span className="text-xs font-mono text-slate-400">{m.kodeAset}</span>
                  <StatusBadge status={m.statusKembali} size="xs" />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{m.lokasiAsal}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-xs font-medium">{m.lokasiTujuan}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">{m.tujuan}</p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {m.tanggal} {m.jam} · {m.petugas}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.statusKembali === 'Belum Dikembalikan' && (
                  <p className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">
                    Target kembali: {m.targetKembali}
                  </p>
                )}
                <button onClick={() => setDetail(m)} className="btn-secondary py-1.5">
                  <Eye className="w-3.5 h-3.5" /> Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detail Transaksi Mutasi" size="md">
        {detail && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="font-bold text-slate-800">{detail.namaAset}</p>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{detail.kodeAset}</p>
              <div className="mt-3">
                <StatusBadge status={detail.statusKembali} />
              </div>
            </div>
            {[
              ['ID Transaksi', detail.id],
              ['Tanggal & Jam', `${detail.tanggal} pukul ${detail.jam}`],
              ['Lokasi Asal', detail.lokasiAsal],
              ['Lokasi Tujuan', detail.lokasiTujuan],
              ['Tujuan', detail.tujuan],
              ['Petugas', detail.petugas],
              ['Target Kembali', detail.targetKembali],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-400 font-medium w-32 flex-shrink-0">{k}</span>
                <span className="text-sm text-slate-700 font-medium text-right">{v}</span>
              </div>
            ))}
            {detail.catatan && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-medium mb-1">Catatan</p>
                <p className="text-sm text-slate-600 leading-relaxed">{detail.catatan}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
