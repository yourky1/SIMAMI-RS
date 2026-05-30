import { Bell, CalendarDays, Menu, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header({ setOpen }) {
  const { user } = useAuth();

  return (
    <header className="z-20 shrink-0 border-b border-white/50 bg-white/75 shadow-sm backdrop-blur-2xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => setOpen(true)} className="rounded-2xl border border-slate-200 bg-white/70 p-2 text-slate-600 shadow-sm lg:hidden">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 ring-1 ring-emerald-200 md:inline-flex">
                {user?.role || "SIMAMI-RS"}
              </span>
              <span className="hidden items-center gap-1 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white md:inline-flex">
                <ShieldCheck size={13} /> Secure Access
              </span>
            </div>
            <p className="mt-1 hidden text-sm text-slate-500 md:block">Selamat bekerja, {user?.name}. Sistem siap, tidak seperti printer rumah sakit biasanya.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-80 xl:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm font-medium outline-none shadow-sm transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100" placeholder="Cari aset, kode QR, unit, petugas..." />
          </div>

          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm md:flex">
            <CalendarDays size={17} className="text-emerald-600" />
            18 Mei 2026
          </div>

          <button className="relative rounded-2xl border border-slate-200 bg-white/90 p-3 text-slate-600 shadow-sm hover:bg-white">
            <Bell size={19} />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="hidden h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white shadow-lg shadow-emerald-200 md:grid">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
