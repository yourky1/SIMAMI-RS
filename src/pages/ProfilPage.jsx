import { useState } from 'react';
import { User, Mail, Phone, Building2, ShieldCheck, KeyRound, Save, CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import { FormInput } from '../components/common/FormInput';
import { useAuth } from '../context/AuthContext';

export default function ProfilPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    telepon: '081234567890',
    unit: user?.unit || '',
  });
  const [passForm, setPassForm] = useState({ lama: '', baru: '', konfirmasi: '' });
  const [passError, setPassError] = useState('');

  const handleSaveProfil = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePass = () => {
    if (passForm.baru !== passForm.konfirmasi) {
      setPassError('Password baru dan konfirmasi tidak cocok.');
      return;
    }
    if (passForm.baru.length < 8) {
      setPassError('Password minimal 8 karakter.');
      return;
    }
    setPassError('');
    setPassForm({ lama: '', baru: '', konfirmasi: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = (nama) => (nama || 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const HAK_AKSES = {
    Administrator: ['Kelola semua data aset', 'Kelola pengguna', 'Lihat seluruh laporan', 'Generate & cetak QR Code', 'Akses dashboard penuh', 'Konfigurasi sistem'],
    'Petugas Bangsal': ['Scan QR Code', 'Catat mutasi & peminjaman', 'Lihat aset di unitnya', 'Lihat riwayat mutasi terkait'],
    Teknisi: ['Lihat daftar aset maintenance', 'Isi hasil servis & pemeriksaan', 'Perbarui status maintenance', 'Lihat riwayat perawatan aset'],
  };

  return (
    <AppLayout title="Profil Pengguna" subtitle="Kelola informasi akun Anda">
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 mb-4 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          Perubahan berhasil disimpan.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: avatar + role info */}
        <div className="space-y-4">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 text-2xl font-bold">{initials(user?.nama)}</span>
            </div>
            <p className="font-bold text-slate-800 text-base">{user?.nama}</p>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
            <div className="mt-3">
              <StatusBadge status={user?.role} showDot={false} />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 text-xs">Unit</span>
                <span className="font-medium text-xs">{user?.unit}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 text-xs">Status Akun</span>
                <StatusBadge status="Aktif" size="xs" />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-700">Hak Akses</p>
            </div>
            <ul className="space-y-1.5">
              {(HAK_AKSES[user?.role] || []).map(h => (
                <li key={h} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: edit forms */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info umum */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <User className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">Informasi Umum</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput label="Nama Lengkap" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} placeholder="Nama lengkap" />
              <FormInput label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@permatamedika.co.id" />
              <FormInput label="No. Telepon" value={form.telepon} onChange={e => setForm(f => ({ ...f, telepon: e.target.value }))} placeholder="08xxxxxxxxxx" />
              <FormInput label="Unit / Bagian" value={form.unit} readOnly className="input-field bg-slate-50 cursor-not-allowed" hint="Hubungi administrator untuk mengubah unit." />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={handleSaveProfil} className="btn-primary">
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
            </div>
          </div>

          {/* Ubah password */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <KeyRound className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-700">Ubah Password</h3>
            </div>
            <div className="space-y-4 max-w-sm">
              <FormInput label="Password Lama" type="password" value={passForm.lama} onChange={e => setPassForm(f => ({ ...f, lama: e.target.value }))} placeholder="Masukkan password saat ini" />
              <FormInput label="Password Baru" type="password" value={passForm.baru} onChange={e => setPassForm(f => ({ ...f, baru: e.target.value }))} placeholder="Minimal 8 karakter" />
              <FormInput label="Konfirmasi Password Baru" type="password" value={passForm.konfirmasi} onChange={e => setPassForm(f => ({ ...f, konfirmasi: e.target.value }))} placeholder="Ulangi password baru" error={passError} />
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={handleChangePass} className="btn-primary">
                <KeyRound className="w-4 h-4" /> Ubah Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
