import { Bell, Menu, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const today = new Date().toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

export default function Header({ setOpen }) {
  const { user } = useAuth();

  return (
    <header className="z-20 shrink-0 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
        {/* Left: hamburger + role info */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 lg:hidden"
          >
            <Menu size={18} />
          </button>
          <div className="hidden min-w-0 md:block">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
                <ShieldCheck size={11} />
                {user?.role || "SIMAMI-RS"}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-400">
              Selamat bekerja,{" "}
              <span className="font-medium text-slate-600">{user?.name}</span>
            </p>
          </div>
        </div>

        {/* Right: search + date + notif + avatar */}
        <div className="flex items-center gap-2">
          <div className="relative hidden w-72 xl:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />
            <input
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              placeholder="Cari aset, kode QR, unit..."
            />
          </div>

          <div className="hidden items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 md:flex">
            {today}
          </div>

          <button className="relative rounded-md border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-1 ring-white" />
          </button>

          <div className="hidden h-8 w-8 place-items-center rounded-md bg-teal-600 text-xs font-semibold text-white md:grid">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
