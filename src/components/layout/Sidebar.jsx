import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, QrCode, ScanLine, ArrowLeftRight,
  Wrench, FileBarChart2, Users, Settings, LogOut, Activity, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Data Aset', icon: Package, to: '/aset' },
  { label: 'Generate QR Code', icon: QrCode, to: '/qr-code' },
  { label: 'Scan QR Code', icon: ScanLine, to: '/scan' },
  { label: 'Mutasi Aset', icon: ArrowLeftRight, to: '/mutasi' },
  { label: 'Maintenance', icon: Wrench, to: '/maintenance' },
  { label: 'Laporan', icon: FileBarChart2, to: '/laporan' },
];

const adminItems = [
  { label: 'Manajemen User', icon: Users, to: '/users' },
  { label: 'Pengaturan', icon: Settings, to: '/pengaturan' },
];

export default function Sidebar({ mobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    Administrator: 'text-purple-600 bg-purple-50',
    'Petugas Bangsal': 'text-teal-600 bg-teal-50',
    Teknisi: 'text-indigo-600 bg-indigo-50',
  };

  return (
    <aside className={`${mobile ? 'w-full' : 'w-60'} bg-white border-r border-slate-200 flex flex-col h-full`}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Activity className="w-4.5 h-4.5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-none">SIMAMI-RS</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Permata Medika</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
            {item.label}
          </NavLink>
        ))}

        {user?.role === 'Administrator' && (
          <>
            <div className="pt-3 pb-1 px-3">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Administrasi</p>
            </div>
            {adminItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="border-t border-slate-100 p-3 flex-shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { navigate('/profil'); onClose?.(); }}>
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 text-sm font-semibold">
              {user?.nama?.[0] || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.nama}</p>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleColors[user?.role] || 'text-slate-500 bg-slate-100'}`}>
              {user?.role}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full mt-1 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
