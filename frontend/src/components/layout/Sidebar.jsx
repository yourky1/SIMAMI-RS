import {
  Activity,
  Camera,
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
      { to: "/", label: "Dashboard", icon: LayoutDashboard },
      { to: "/approvals", label: "Approval Peminjaman", icon: UserCheck },
      { to: "/assets", label: "Data Aset", icon: PackageCheck },
      { to: "/assets/new", label: "Tambah Aset", icon: Plus },
      { to: "/qr", label: "QR Code Manager", icon: QrCode },
      { to: "/mutations", label: "Mutasi Aset", icon: Activity },
      { to: "/maintenance", label: "Maintenance", icon: Wrench },
      { to: "/reports", label: "Laporan", icon: FileBarChart },
      { to: "/users", label: "Manajemen User", icon: UserCog },
      { to: "/settings", label: "Pengaturan", icon: Settings },
      { to: "/profile", label: "Profil Saya", icon: ShieldCheck }
    ]
  },
  "Petugas Bangsal": {
    label: "Portal Petugas",
    note: "Peminjaman alat tanpa ribet",
    items: [
      { to: "/portal", label: "Beranda", icon: ShoppingBag },
      { to: "/catalog", label: "Katalog Alat", icon: Stethoscope },
      { to: "/my-borrows", label: "Peminjaman Saya", icon: ClipboardList },
      { to: "/scan", label: "Scan QR", icon: Camera },
      { to: "/profile", label: "Profil Saya", icon: ShieldCheck }
    ]
  },
  Teknisi: {
    label: "Portal Teknisi",
    note: "Maintenance dan validasi alat",
    items: [
      { to: "/maintenance", label: "Jadwal Maintenance", icon: Wrench },
      { to: "/scan", label: "Scan QR Aset", icon: Camera },
      { to: "/profile", label: "Profil Saya", icon: ShieldCheck }
    ]
  }
};

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const menu = roleMenus[user?.role] || roleMenus["Petugas Bangsal"];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 transform flex-col border-r border-slate-800 bg-slate-900 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-teal-600 text-white">
            <Stethoscope size={16} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">SIMAMI-RS</p>
            <p className="text-[10px] text-slate-500">Permata Medika</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 lg:hidden"
        >
          <X size={16} />
        </button>
      </div>

      {/* Role Badge */}
      <div className="shrink-0 px-4 py-3">
        <div className="rounded-md bg-slate-800 px-3 py-2">
          <p className="text-xs font-semibold text-slate-300">{menu.label}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{menu.note}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="premium-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        <div className="space-y-0.5">
          {menu.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-teal-100" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="shrink-0 border-t border-slate-800 p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-teal-700 text-xs font-bold text-white">
            {user?.name?.slice(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-200">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            title="Keluar"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

