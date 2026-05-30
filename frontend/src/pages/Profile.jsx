import PageHeader from "../components/ui/PageHeader.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Profil Pengguna" description="Informasi akun aktif dan hak akses dalam sistem." />
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-emerald-100 text-3xl font-black text-emerald-700">{user?.name?.slice(0, 2).toUpperCase()}</div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">{user?.name}</h2>
            <p className="mt-1 text-slate-500">{user?.role} • {user?.unit}</p>
            <div className="mt-3"><StatusBadge value="Aktif" /></div>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</p><p className="mt-1 font-semibold text-slate-900">{user?.email}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Role</p><p className="mt-1 font-semibold text-slate-900">{user?.role}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Login terakhir</p><p className="mt-1 font-semibold text-slate-900">18 Mei 2026, 10.30</p></div>
        </div>
      </div>
    </div>
  );
}
