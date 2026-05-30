import { useState } from 'react';
import { ScanLine, CheckCircle2, ArrowLeftRight, MapPin, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { FormInput, FormSelect, FormTextarea } from '../components/common/FormInput';
import { asets, LOKASI } from '../data/dummy';

export default function ScanPage() {
  const [mode, setMode] = useState('idle'); // 'idle' | 'scanning' | 'found' | 'notfound'
  const [manualCode, setManualCode] = useState('');
  const [found, setFound] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ lokasiTujuan: '', tujuan: 'Mutasi Aset', catatan: '' });
  const [saved, setSaved] = useState(false);

  const simulateScan = (code) => {
    const target = code || manualCode;
    if (!target.trim()) return;
    const aset = asets.find(a => a.kode === target.trim() || a.id === target.trim());
    if (aset) {
      setFound(aset);
      setMode('found');
    } else {
      setMode('notfound');
    }
  };

  const simulateCameraScan = () => {
    setMode('scanning');
    setTimeout(() => {
      // Simulasi scan aset random
      const demo = asets[Math.floor(Math.random() * 3)];
      setFound(demo);
      setMode('found');
    }, 2000);
  };

  const handleSaveMutasi = () => {
    setSaved(true);
    setModalOpen(false);
    setTimeout(() => setSaved(false), 4000);
  };

  const reset = () => {
    setMode('idle');
    setFound(null);
    setManualCode('');
    setSaved(false);
  };

  return (
    <AppLayout title="Scan QR Code Aset" subtitle="Identifikasi aset medis menggunakan kamera atau kode manual">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Success banner */}
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Transaksi mutasi berhasil disimpan.</p>
              <p className="text-xs text-emerald-600">Riwayat mutasi telah diperbarui.</p>
            </div>
          </div>
        )}

        {/* Scanner area */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Area Scan</h3>
          </div>

          {mode === 'idle' && (
            <div className="p-5 space-y-4">
              {/* Camera scan */}
              <div className="relative bg-slate-900 rounded-xl overflow-hidden h-52 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                    <ScanLine className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white text-sm font-medium">Kamera belum aktif</p>
                  <p className="text-slate-400 text-xs mt-1">Klik tombol di bawah untuk memulai scan</p>
                </div>
                {/* Corner guides */}
                {['top-3 left-3 border-t-2 border-l-2','top-3 right-3 border-t-2 border-r-2','bottom-3 left-3 border-b-2 border-l-2','bottom-3 right-3 border-b-2 border-r-2'].map((c,i) => (
                  <div key={i} className={`absolute w-6 h-6 border-primary-400 ${c}`} />
                ))}
              </div>
              <button onClick={simulateCameraScan} className="btn-primary w-full justify-center py-2.5">
                <ScanLine className="w-4 h-4" /> Aktifkan Kamera & Scan
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <p className="text-xs text-slate-400 font-medium">atau input manual</p>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1 font-mono"
                  placeholder="Masukkan kode aset (cth. PM-DF-003)"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && simulateScan()}
                />
                <button onClick={() => simulateScan()} className="btn-secondary whitespace-nowrap">Cari</button>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 font-semibold mb-1.5">Kode aset tersedia untuk demo:</p>
                <div className="flex flex-wrap gap-1.5">
                  {asets.slice(0,6).map(a => (
                    <button key={a.id} onClick={() => simulateScan(a.kode)}
                      className="text-xs bg-white border border-slate-200 rounded px-2 py-1 font-mono hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors">
                      {a.kode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === 'scanning' && (
            <div className="p-5">
              <div className="relative bg-slate-900 rounded-xl overflow-hidden h-52 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-white text-sm font-medium">Memindai QR Code...</p>
                  <p className="text-slate-400 text-xs mt-1">Arahkan kamera ke stiker QR aset</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent animate-pulse" />
                {['top-3 left-3 border-t-2 border-l-2','top-3 right-3 border-t-2 border-r-2','bottom-3 left-3 border-b-2 border-l-2','bottom-3 right-3 border-b-2 border-r-2'].map((c,i) => (
                  <div key={i} className={`absolute w-6 h-6 border-primary-400 ${c}`} />
                ))}
              </div>
            </div>
          )}

          {mode === 'notfound' && (
            <div className="p-5 text-center space-y-4">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Aset Tidak Ditemukan</p>
                <p className="text-sm text-slate-500 mt-1">Kode <span className="font-mono">{manualCode}</span> tidak terdaftar dalam sistem.</p>
              </div>
              <button onClick={reset} className="btn-secondary mx-auto">Coba Lagi</button>
            </div>
          )}

          {mode === 'found' && found && (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm font-semibold">Scan berhasil — aset ditemukan</p>
              </div>

              {/* Aset info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">{found.nama}</p>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{found.kode}</p>
                  </div>
                  <StatusBadge status={found.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">Lokasi Saat Ini</p>
                    <p className="text-slate-700 font-semibold mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {found.lokasi}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Kondisi</p>
                    <div className="mt-0.5"><StatusBadge status={found.kondisi} showDot={false} size="xs" /></div>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Penanggung Jawab</p>
                    <p className="text-slate-700 font-semibold mt-0.5">{found.penanggungJawab}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Nomor Inventaris</p>
                    <p className="text-slate-700 font-mono mt-0.5">{found.nomorInventaris}</p>
                  </div>
                </div>
                {found.catatan && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{found.catatan}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setModalOpen(true)} className="btn-primary flex-1 justify-center">
                  <ArrowLeftRight className="w-4 h-4" /> Catat Mutasi / Peminjaman
                </button>
                <button onClick={reset} className="btn-secondary">Scan Lagi</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mutasi Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Catat Mutasi / Peminjaman Aset"
        footer={<>
          <button className="btn-secondary" onClick={() => setModalOpen(false)}>Batal</button>
          <button className="btn-primary" onClick={handleSaveMutasi}>Simpan Transaksi</button>
        </>}
      >
        {found && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-3 text-sm">
              <p className="font-semibold text-slate-800">{found.nama}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">{found.kode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Lokasi Asal" value={found.lokasi} readOnly className="input-field bg-slate-50" />
              <FormSelect label="Lokasi Tujuan" required value={form.lokasiTujuan} onChange={e => setForm(f => ({ ...f, lokasiTujuan: e.target.value }))}>
                <option value="">Pilih lokasi tujuan...</option>
                {LOKASI.filter(l => l !== found.lokasi).map(l => <option key={l}>{l}</option>)}
              </FormSelect>
            </div>
            <FormSelect label="Tujuan Pemindahan" value={form.tujuan} onChange={e => setForm(f => ({ ...f, tujuan: e.target.value }))}>
              <option>Mutasi Aset</option>
              <option>Peminjaman Sementara</option>
              <option>Maintenance</option>
              <option>Pengisian / Kalibrasi</option>
              <option>Pengembalian</option>
            </FormSelect>
            <FormTextarea label="Catatan" placeholder="Keterangan tambahan untuk mutasi ini..." value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} />
            <FormInput label="Nama Petugas" placeholder="Nama petugas yang melakukan mutasi" />
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
