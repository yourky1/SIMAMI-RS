import { useState } from 'react';
import { Plus, Wrench, Clock, Eye, ChevronRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../components/common/FormInput';
import { jadwalMaintenance, asets } from '../data/dummy';

export default function MaintenancePage() {
  const [data, setData] = useState(jadwalMaintenance);
  const [filterStatus, setFilterStatus] = useState('');
  const [detail, setDetail] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({
    asetId: '', jenisMaintenance: 'Pemeliharaan Preventif', teknisi: '',
    tanggalMulai: '', deskripsiMasalah: '', tindakan: '', prioritas: 'Sedang', catatan: '',
  });

  const filtered = data.filter(m => !filterStatus || m.status === filterStatus);

  const statusOrder = ['Sedang Dikerjakan', 'Menunggu Suku Cadang', 'Terjadwal', 'Selesai'];
  const sorted = [...filtered].sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  const handleSave = () => {
    const aset = asets.find(a => a.id === form.asetId);
    if (!aset) return;
    const newItem = {
      id: `MTC-${String(data.length + 1).padStart(3, '0')}`,
      asetId: form.asetId,
      namaAset: aset.nama,
      kodeAset: aset.kode,
      ...form,
      status: 'Terjadwal',
      unitTeknisi: 'Elektromedis',
      hasilPemeriksaan: '',
      biaya: 0,
      tanggalSelesai: null,
    };
    setData(prev => [newItem, ...prev]);
    setAddModal(false);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setData(prev => prev.map(m => m.id === id ? {
      ...m, status: newStatus,
      tanggalSelesai: newStatus === 'Selesai' ? new Date().toISOString().split('T')[0] : m.tanggalSelesai,
    } : m));
    if (detail?.id === id) setDetail(d => ({ ...d, status: newStatus }));
  };

  const statusColors = {
    'Sedang Dikerjakan': 'border-l-blue-500',
    'Menunggu Suku Cadang': 'border-l-orange-500',
    'Terjadwal': 'border-l-slate-300',
    'Selesai': 'border-l-emerald-500',
  };

  return (
    <AppLayout title="Maintenance Aset" subtitle="Jadwal, riwayat, dan status perbaikan alat medis">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select className="input-field w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Semua Status</option>
          {statusOrder.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => setAddModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Tambah Jadwal
        </button>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Sedang Dikerjakan', count: data.filter(m => m.status === 'Sedang Dikerjakan').length, color: 'text-blue-600' },
          { label: 'Menunggu Suku Cadang', count: data.filter(m => m.status === 'Menunggu Suku Cadang').length, color: 'text-orange-600' },
          { label: 'Terjadwal', count: data.filter(m => m.status === 'Terjadwal').length, color: 'text-slate-600' },
          { label: 'Selesai', count: data.filter(m => m.status === 'Selesai').length, color: 'text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="card px-4 py-3">
            <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {sorted.map(m => (
          <div key={m.id} className={`card border-l-4 p-4 ${statusColors[m.status] || 'border-l-slate-200'}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-semibold text-slate-800">{m.namaAset}</p>
                  <span className="text-xs font-mono text-slate-400">{m.kodeAset}</span>
                  <StatusBadge status={m.prioritas} showDot={false} size="xs" />
                </div>
                <p className="text-xs text-slate-600 font-medium">{m.jenisMaintenance}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{m.deskripsiMasalah}</p>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {m.tanggalMulai} · Teknisi: {m.teknisi}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={m.status} />
                <button onClick={() => setDetail(m)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-700 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detail Maintenance" size="lg"
        footer={
          detail?.status !== 'Selesai' ? (
            <button className="btn-primary" onClick={() => handleUpdateStatus(detail.id, 'Selesai')}>
              <Wrench className="w-4 h-4" /> Tandai Selesai
            </button>
          ) : null
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-slate-800 text-base">{detail.namaAset}</p>
                <p className="text-xs font-mono text-slate-500">{detail.kodeAset} · {detail.id}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={detail.prioritas} showDot={false} />
                <StatusBadge status={detail.status} />
              </div>
            </div>
            {[
              ['Jenis Maintenance', detail.jenisMaintenance],
              ['Teknisi', `${detail.teknisi} (${detail.unitTeknisi})`],
              ['Tanggal Mulai', detail.tanggalMulai],
              ['Tanggal Selesai', detail.tanggalSelesai || 'Belum selesai'],
              ['Tindakan', detail.tindakan],
              ['Estimasi Biaya', detail.biaya ? `Rp ${detail.biaya.toLocaleString('id-ID')}` : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-400 font-medium w-36 flex-shrink-0">{k}</span>
                <span className="text-sm text-slate-700 font-medium text-right flex-1">{v}</span>
              </div>
            ))}
            {detail.deskripsiMasalah && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">Deskripsi Masalah</p>
                <p className="text-sm text-red-800 leading-relaxed">{detail.deskripsiMasalah}</p>
              </div>
            )}
            {detail.hasilPemeriksaan && (
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Hasil Pemeriksaan</p>
                <p className="text-sm text-slate-700 leading-relaxed">{detail.hasilPemeriksaan}</p>
              </div>
            )}
            {detail.catatan && (
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-amber-700 mb-1">Catatan</p>
                <p className="text-sm text-amber-800 leading-relaxed">{detail.catatan}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Tambah Jadwal Maintenance" size="lg"
        footer={<>
          <button className="btn-secondary" onClick={() => setAddModal(false)}>Batal</button>
          <button className="btn-primary" onClick={handleSave}>Simpan</button>
        </>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect label="Aset" required value={form.asetId} onChange={e => setForm(f => ({ ...f, asetId: e.target.value }))}>
            <option value="">Pilih aset...</option>
            {asets.map(a => <option key={a.id} value={a.id}>{a.nama} ({a.kode})</option>)}
          </FormSelect>
          <FormSelect label="Jenis Maintenance" value={form.jenisMaintenance} onChange={e => setForm(f => ({ ...f, jenisMaintenance: e.target.value }))}>
            <option>Pemeliharaan Preventif</option>
            <option>Perbaikan Korektif</option>
            <option>Kalibrasi Periodik</option>
            <option>Inspeksi Rutin</option>
          </FormSelect>
          <FormInput label="Teknisi" required value={form.teknisi} onChange={e => setForm(f => ({ ...f, teknisi: e.target.value }))} placeholder="Nama teknisi penanggung jawab" />
          <FormSelect label="Prioritas" value={form.prioritas} onChange={e => setForm(f => ({ ...f, prioritas: e.target.value }))}>
            <option>Tinggi</option>
            <option>Sedang</option>
            <option>Rendah</option>
          </FormSelect>
          <FormInput label="Tanggal Mulai" type="date" required value={form.tanggalMulai} onChange={e => setForm(f => ({ ...f, tanggalMulai: e.target.value }))} />
          <div className="sm:col-span-2">
            <FormTextarea label="Deskripsi Masalah" value={form.deskripsiMasalah} onChange={e => setForm(f => ({ ...f, deskripsiMasalah: e.target.value }))} placeholder="Jelaskan masalah atau tujuan maintenance..." />
          </div>
          <div className="sm:col-span-2">
            <FormInput label="Rencana Tindakan" value={form.tindakan} onChange={e => setForm(f => ({ ...f, tindakan: e.target.value }))} placeholder="cth. Penggantian baterai + uji fungsi" />
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
