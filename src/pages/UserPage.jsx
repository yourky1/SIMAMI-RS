import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ShieldCheck } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { FormInput, FormSelect } from '../components/common/FormInput';
import { users } from '../data/dummy';

const emptyForm = { nama: '', email: '', telepon: '', role: 'Petugas Bangsal', unit: '', status: 'Aktif', password: '' };

const HAK_AKSES = {
  Administrator: ['Kelola semua data aset', 'Kelola pengguna', 'Lihat seluruh laporan', 'Generate & cetak QR Code', 'Akses dashboard penuh', 'Konfigurasi sistem'],
  'Petugas Bangsal': ['Scan QR Code', 'Catat mutasi & peminjaman', 'Lihat aset di unitnya', 'Lihat riwayat mutasi terkait'],
  Teknisi: ['Lihat daftar aset maintenance', 'Isi hasil servis & pemeriksaan', 'Perbarui status maintenance', 'Lihat riwayat perawatan aset'],
};

export default function UserPage() {
  const [data, setData] = useState(users);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = data.filter(u =>
    !search || u.nama.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.unit.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (u) => { setSelected(u); setForm({ ...u, password: '' }); setModal('edit'); };
  const openDelete = (u) => { setSelected(u); setModal('delete'); };

  const handleSave = () => {
    if (modal === 'add') {
      const newId = `USR-${String(data.length + 1).padStart(3, '0')}`;
      setData(prev => [...prev, { ...form, id: newId, terakhirLogin: '—', avatar: null }]);
    } else {
      setData(prev => prev.map(u => u.id === selected.id ? { ...u, ...form } : u));
    }
    setModal(null);
  };

  const handleDelete = () => {
    setData(prev => prev.filter(u => u.id !== selected.id));
    setModal(null);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const roleColors = { Administrator: 'bg-purple-100 text-purple-700', 'Petugas Bangsal': 'bg-teal-100 text-teal-700', Teknisi: 'bg-indigo-100 text-indigo-700' };
  const initials = (nama) => nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <AppLayout title="Manajemen Pengguna" subtitle="Kelola akun dan hak akses pengguna sistem">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input className="text-sm outline-none flex-1 placeholder-slate-400 bg-transparent"
            placeholder="Cari nama, email, atau unit..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Tambah Pengguna</button>
      </div>

      {/* Role info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {Object.entries(HAK_AKSES).map(([role, hak]) => (
          <div key={role} className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <StatusBadge status={role} showDot={false} />
            </div>
            <ul className="space-y-1">
              {hak.map(h => (
                <li key={h} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Pengguna', 'Role', 'Unit', 'Status', 'Terakhir Login', ''].map(h => (
                  <th key={h} className="table-header px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-700 text-xs font-bold">{initials(u.nama)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{u.nama}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><StatusBadge status={u.role} showDot={false} /></td>
                  <td className="table-cell text-slate-600 text-sm">{u.unit}</td>
                  <td className="table-cell"><StatusBadge status={u.status} /></td>
                  <td className="table-cell text-slate-500 text-xs">{u.terakhirLogin}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openDelete(u)} className="p-1.5 hover:bg-red-50 rounded-md text-slate-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modal === 'add' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Tambah Pengguna' : 'Edit Pengguna'}
        size="md"
        footer={<>
          <button className="btn-secondary" onClick={() => setModal(null)}>Batal</button>
          <button className="btn-primary" onClick={handleSave}>Simpan</button>
        </>}
      >
        <div className="space-y-4">
          <FormInput label="Nama Lengkap" name="nama" required value={form.nama} onChange={handleChange} placeholder="cth. Siti Rahayu, AMK" />
          <FormInput label="Email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="nama@permatamedika.co.id" />
          <FormInput label="No. Telepon" name="telepon" value={form.telepon} onChange={handleChange} placeholder="08xxxxxxxxxx" />
          <div className="grid grid-cols-2 gap-4">
            <FormSelect label="Role" name="role" value={form.role} onChange={handleChange}>
              <option>Administrator</option>
              <option>Petugas Bangsal</option>
              <option>Teknisi</option>
            </FormSelect>
            <FormSelect label="Status" name="status" value={form.status} onChange={handleChange}>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </FormSelect>
          </div>
          <FormInput label="Unit / Bagian" name="unit" value={form.unit} onChange={handleChange} placeholder="cth. Bangsal Mawar, ICU, Elektromedis" />
          {modal === 'add' && (
            <FormInput label="Password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="Minimal 8 karakter" hint="Pengguna dapat mengubah password setelah login pertama." />
          )}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={modal === 'delete'} onClose={() => setModal(null)} title="Hapus Pengguna" size="sm"
        footer={<>
          <button className="btn-secondary" onClick={() => setModal(null)}>Batal</button>
          <button className="btn-danger" onClick={handleDelete}>Hapus</button>
        </>}
      >
        <p className="text-sm text-slate-600">
          Anda akan menghapus akun <span className="font-semibold text-slate-800">{selected?.nama}</span>.
          Pengguna tidak akan dapat mengakses sistem setelah ini.
        </p>
      </Modal>
    </AppLayout>
  );
}
