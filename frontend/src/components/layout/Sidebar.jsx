import {
  Activity,
  Camera,
  ChevronRight,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Plus,
  QrCode,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UserCheck,
  UserCog,
  Wrench,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { cn } from "../../utils/cn.js";

const roleMenus = {
  Administrator: {
    label: "Portal Admin",
    note: "Kontrol aset, approval, dan audit",
    items: [
      { to: "/", label: "Dashboard Admin", icon: LayoutDashboard },
      { to: "/approvals", label: "Approval Peminjaman", icon: UserCheck },
      { to: "/assets", label: "Data Aset", icon: PackageCheck },
      { to: "/assets/new", label: "Tambah Aset", icon: Plus },
      { to: "/assets/AST-RO-008", label: "Detail Aset", icon: ClipboardList },
      { to: "/qr", label: "QR Code", icon: QrCode },
      { to: "/mutations", label: "Mutasi Aset", icon: Activity },
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
      { to: "/reports", label: "Laporan", icon: FileBarChart },
      { to: "/users", label: "Manajemen User", icon: UserCog },
      { to: "/settings", label: "Pengaturan", icon: Settings },
      { to: "/profile", label: "Profil", icon: ShieldCheck }
    ]
  },
  "Petugas Bangsal": {
    label: "Portal Petugas",
    note: "Peminjaman alat tanpa ribet",
    items: [
      { to: "/portal", label: "Beranda Petugas", icon: ShoppingBag },
      { to: "/catalog", label: "Katalog Alat", icon: Stethoscope },
      { to: "/my-borrows", label: "Peminjaman Saya", icon: UserCheck },
      { to: "/scan", label: "Scan QR", icon: Camera },
      { to: "/profile", label: "Profil", icon: ShieldCheck }
    ]
  },
  Teknisi: {
    label: "Portal Teknisi",
    note: "Maintenance dan validasi alat",
    items: [
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
      { to: "/scan", label: "Scan QR", icon: Camera },
      { to: "/assets/AST-RO-008", label: "Detail Aset", icon: ClipboardList },
      { to: "/profile", label: "Profil", icon: ShieldCheck }
    ]
  }
};

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const menu = roleMenus[user?.role] || roleMenus["Petugas Bangsal"];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen w-80 shrink-0 transform flex-col border-r border-white/30 bg-slate-950 text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-8 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-24 top-40 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="relative flex h-20 shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-950/30 ring-1 ring-white/20">
            <Stethoscope size={24} />
          </div>
          <div>
            <p className="text-base font-black tracking-tight">SIMAMI-RS</p>
            <p className="text-xs text-emerald-100/75">Permata Medika Asset Suite</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="rounded-xl p-2 text-white/70 hover:bg-white/10 lg:hidden">
          <X size={18} />
        </button>
      </div>

      <div className="relative shrink-0 px-4 pb-4">
        <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/10 p-4 shadow-lg backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/20">
              <Sparkles size={19} />
            </div>
            <div>
              <p className="text-sm font-black">{menu.label}</p>
              <p className="mt-1 text-xs leading-5 text-white/65">{menu.note}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="premium-scrollbar relative min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <p className="px-3 pb-2 pt-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/40">
          Menu {user?.role}
        </p>
        <div className="space-y-1.5">
          {menu.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-bold transition",
                  isActive
                    ? "bg-white text-slate-950 shadow-lg shadow-black/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl transition", isActive ? "bg-emerald-50 text-emerald-700" : "bg-white/10 text-white/70 group-hover:bg-white/15 group-hover:text-white")}>
                    <item.icon size={18} />
                  </div>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <ChevronRight size={16} className={cn("transition", isActive ? "text-emerald-600" : "text-white/30 group-hover:text-white/70")} />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="relative shrink-0 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-3 backdrop-blur">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-cyan-400 font-black text-slate-950">
            {user?.name?.slice(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black">{user?.name}</p>
            <p className="truncate text-xs text-white/55">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            title="Keluar"
            className="rounded-xl p-2 text-white/55 hover:bg-white/10 hover:text-rose-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
