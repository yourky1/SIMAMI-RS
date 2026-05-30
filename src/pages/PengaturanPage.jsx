import { useState } from 'react';
import { Settings, Building2, Bell, Database, Shield, Save, CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { FormInput, FormSelect, FormTextarea } from '../components/common/FormInput';

export default function PengaturanPage() {
  const [saved, setSaved] = useState(false);
  const [sistem, setSistem] = useState({
    namaRS: 'RS Permata Medika',
    alamat: 'Jl. Raya Permata No. 45, Semarang, Jawa Tengah 50241',
    teleponRS: '(024) 8765-4321',
    emailRS: 'info@permatamedika.co.id',
    websiteRS: 'www.permatamedika.co.id',
    namaAdmin: 'Admin Sistem SIMAMI-RS',
    versi: '1.0.0',
  });
  const [notif, setNotif] = useState({
    maintenanceH7: true,
    maintenanceH1: true,
    asetRusak: true,
    kalibrasiBelumDilakukan: true,
    mutasiTidakKembali: false,
  });
  const [backup, setBackup] = useState({
    frekuensi: 'Harian',
    waktu: '02:00',
    retensi: '30',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  );

  const Section = ({ icon: Icon, title, children }) => (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
        <div className="w-7 h-7 bg-slate-100 rounded-md flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <AppLayout title="Pengaturan Sistem" subtitle="Konfigurasi SIMAMI-RS RS Permata Medika">
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 mb-4 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          Pengaturan berhasil disimpan.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section icon={Building2} title="Informasi Rumah Sakit">
          <div className="space-y-3">
            <FormInput label="Nama Rumah Sakit" value={sistem.namaRS} onChange={e => setSistem(s => ({ ...s, namaRS: e.target.value }))} />
            <FormTextarea label="Alamat" value={sistem.alamat} onChange={e => setSistem(s => ({ ...s, alamat: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Telepon" value={sistem.teleponRS} onChange={e => setSistem(s => ({ ...s, teleponRS: e.target.value }))} />
              <FormInput label="Email" value={sistem.emailRS} onChange={e => setSistem(s => ({ ...s, emailRS: e.target.value }))} />
            </div>
            <FormInput label="Website" value={sistem.websiteRS} onChange={e => setSistem(s => ({ ...s, websiteRS: e.target.value }))} />
          </div>
        </Section>

        <Section icon={Bell} title="Notifikasi & Peringatan">
          <div className="space-y-3">
            {[
              { key: 'maintenanceH7', label: 'Peringatan maintenance 7 hari sebelum jadwal', desc: 'Kirim notifikasi H-7 sebelum jadwal maintenance' },
              { key: 'maintenanceH1', label: 'Peringatan maintenance 1 hari sebelum jadwal', desc: 'Kirim notifikasi H-1 sebelum jadwal maintenance' },
              { key: 'asetRusak', label: 'Notifikasi aset berstatus Rusak', desc: 'Beri tahu admin ketika ada aset berstatus rusak berat' },
              { key: 'kalibrasiBelumDilakukan', label: 'Peringatan kalibrasi terlewat', desc: 'Notifikasi jika jadwal kalibrasi tidak dilakukan' },
              { key: 'mutasiTidakKembali', label: 'Pengingat peminjaman melewati target kembali', desc: 'Ingatkan petugas ketika aset belum dikembalikan' },
            ].map(item => (
              <div key={item.key} className="flex items-start justify-between gap-3 py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={notif[item.key]} onChange={v => setNotif(n => ({ ...n, [item.key]: v }))} />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Database} title="Backup & Retensi Data">
          <div className="space-y-3">
            <FormSelect label="Frekuensi Backup" value={backup.frekuensi} onChange={e => setBackup(b => ({ ...b, frekuensi: e.target.value }))}>
              <option>Harian</option>
              <option>Mingguan</option>
              <option>Bulanan</option>
            </FormSelect>
            <FormInput label="Waktu Backup" type="time" value={backup.waktu} onChange={e => setBackup(b => ({ ...b, waktu: e.target.value }))} hint="Disarankan pada dini hari saat trafik rendah." />
            <FormInput label="Retensi Data (hari)" type="number" value={backup.retensi} onChange={e => setBackup(b => ({ ...b, retensi: e.target.value }))} hint="Data backup akan otomatis dihapus setelah periode ini." />
            <button className="btn-secondary w-full justify-center mt-2">
              <Database className="w-4 h-4" /> Backup Sekarang
            </button>
          </div>
        </Section>

        <Section icon={Shield} title="Keamanan & Sesi">
          <div className="space-y-3">
            {[
              { label: 'Batas sesi aktif (menit)', type: 'number', placeholder: '60', hint: 'Pengguna akan logout otomatis setelah tidak aktif.' },
              { label: 'Percobaan login maksimal', type: 'number', placeholder: '5', hint: 'Akun akan dikunci sementara setelah melampaui batas ini.' },
            ].map(f => (
              <FormInput key={f.label} label={f.label} type={f.type} placeholder={f.placeholder} hint={f.hint} />
            ))}
            <div className="bg-slate-50 rounded-lg p-3 mt-2">
              <p className="text-xs font-semibold text-slate-600">Versi Sistem</p>
              <p className="text-sm font-mono text-slate-800 mt-0.5">SIMAMI-RS v{sistem.versi}</p>
              <p className="text-xs text-slate-400 mt-1">Build: 2026.05.18 · Node.js + React + Supabase</p>
            </div>
          </div>
        </Section>
      </div>

      <div className="flex justify-end mt-4">
        <button onClick={handleSave} className="btn-primary px-6">
          <Save className="w-4 h-4" /> Simpan Semua Pengaturan
        </button>
      </div>
    </AppLayout>
  );
}
