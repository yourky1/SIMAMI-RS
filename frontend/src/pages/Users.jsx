import { Plus } from "lucide-react";
import { useState } from "react";
import FormInput from "../components/ui/FormInput.jsx";
import Modal from "../components/ui/Modal.jsx";
import PageHeader from "../components/ui/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useData } from "../context/DataContext.jsx";

export default function Users() {
  const { users, createUser } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Petugas Bangsal", unit: "", email: "" });

  function submit(event) {
    event.preventDefault();
    createUser(form);
    setOpen(false);
    setForm({ name: "", role: "Petugas Bangsal", unit: "", email: "" });
  }

  return (
    <div>
      <PageHeader
        title="Manajemen User"
        description="Kelola akun dan hak akses Administrator, Petugas Bangsal, dan Teknisi agar sistem tidak berubah menjadi pesta bebas akses."
        action={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"><Plus size={17} /> Tambah User</button>}
      />

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-4">Nama</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Unit</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-bold text-slate-950">{user.name}</td>
                <td className="px-5 py-4 text-slate-600">{user.role}</td>
                <td className="px-5 py-4 text-slate-600">{user.unit}</td>
                <td className="px-5 py-4 text-slate-600">{user.email}</td>
                <td className="px-5 py-4"><StatusBadge value={user.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Tambah User" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <FormInput label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <FormInput label="Role" as="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option>Administrator</option>
            <option>Petugas Bangsal</option>
            <option>Teknisi</option>
          </FormInput>
          <FormInput label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
          <button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white">Simpan User</button>
        </form>
      </Modal>
    </div>
  );
}
