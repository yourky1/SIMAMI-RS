import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Wrench, ArrowLeftRight, Clock, Calendar, MapPin, User, Tag, Hash } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import { asets, riwayatMutasi, jadwalMaintenance } from '../data/dummy';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-7 h-7 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium">{label}</p>
        <p className="text-sm text-slate-800 mt-0.5 font-medium">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function DetailAsetPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const aset = asets.find(a => a.id === id);

  if (!aset) return (
    <AppLayout title="Aset Tidak Ditemukan">
      <div className="text-center py-20">
        <p className="text-slate-400 text-sm">Aset dengan ID <code>{id}</code> tidak ditemukan.</p>
        <button onClick={() => navigate('/aset')} className="btn-secondary mt-4">Kembali ke Daftar Aset</button>
      </div>
    </AppLayout>
  );

  const mutasiAset = riwayatMutasi.filter(m => m.asetId === id);
  const maintenanceAset = jadwalMaintenance.filter(m => m.asetId === id);

  const fmt = (n) => n ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n) : '—';

  return (
    <AppLayout title={aset.nama} subtitle={`${aset.kode} · ${aset.nomorInventaris}`}>
      <button onClick={() => navigate('/aset')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Aset
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header card */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={aset.status} />
                  <StatusBadge status={aset.kondisi} showDot={false} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{aset.nama}</h2>
                <p className="text-slate-500 text-sm mt-1">{aset.merk} {aset.model}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/qr-code?id=${aset.id}`)} className="btn-secondary">
                  <QrCode className="w-4 h-4" /> QR Code
                </button>
                <button onClick={() => navigate('/mutasi', { state: { asetId: aset.id } })} className="btn-primary">
                  <ArrowLeftRight className="w-4 h-4" /> Mutasi
                </button>
              </div>
            </div>

            {aset.catatan && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <p className="text-xs font-semibold text-amber-700 mb-0.5">Catatan</p>
                <p className="text-sm text-amber-800">{aset.catatan}</p>
              </div>
            )}
          </div>

          {/* Detail info */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Informasi Aset</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <div>
                <InfoRow icon={Hash} label="Kode Aset" value={aset.kode} />
                <InfoRow icon={Tag} label="Nomor Inventaris" value={aset.nomorInventaris} />
                <InfoRow icon={Tag} label="Nomor Seri" value={aset.nomorSeri} />
                <InfoRow icon={Tag} label="Kategori" value={aset.kategori} />
                <InfoRow icon={Tag} label="Merk / Model" value={`${aset.merk} ${aset.model}`} />
              </div>
              <div>
                <InfoRow icon={MapPin} label="Lokasi Saat Ini" value={aset.lokasi} />
                <InfoRow icon={User} label="Penanggung Jawab" value={aset.penanggungJawab} />
                <InfoRow icon={Tag} label="Unit" value={aset.unitPenanggung} />
                <InfoRow icon={Calendar} label="Tanggal Pengadaan" value={aset.tanggalPengadaan} />
                <InfoRow icon={Tag} label="Nilai Pengadaan" value={fmt(aset.nilaiPengadaan)} />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div>
                <p className="font-medium">Maintenance Terakhir</p>
                <p className="text-slate-700 mt-0.5">{aset.maintenanceTerakhir || '—'}</p>
              </div>
              <div>
                <p className="font-medium">Maintenance Berikutnya</p>
                <p className={`mt-0.5 font-medium ${new Date(aset.maintenanceBerikutnya) < new Date() ? 'text-red-600' : 'text-slate-700'}`}>
                  {aset.maintenanceBerikutnya || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Mutasi history */}
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Riwayat Mutasi</h3>
            </div>
            {mutasiAset.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">Belum ada riwayat mutasi untuk aset ini.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {mutasiAset.map(m => (
                  <div key={m.id} className="px-5 py-3.5">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{m.lokasiAsal} → {m.lokasiTujuan}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{m.tujuan}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{m.tanggal} {m.jam} · {m.petugas}</p>
                      </div>
                      <StatusBadge status={m.statusKembali} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Maintenance */}
        <div className="space-y-4">
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Riwayat Maintenance</h3>
            </div>
            {maintenanceAset.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">Belum ada riwayat maintenance.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {maintenanceAset.map(m => (
                  <div key={m.id} className="px-5 py-3.5">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <p className="text-sm font-medium text-slate-800">{m.jenisMaintenance}</p>
                      <StatusBadge status={m.status} size="xs" />
                    </div>
                    <p className="text-xs text-slate-500">{m.teknisi} · {m.tanggalMulai}</p>
                    {m.hasilPemeriksaan && <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{m.hasilPemeriksaan}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <p className="text-xs text-slate-400 font-medium mb-1">Terakhir Diperbarui</p>
            <p className="text-sm text-slate-700 font-medium">{aset.terakhirDiperbarui}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
