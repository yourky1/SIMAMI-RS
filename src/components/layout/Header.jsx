import { useState } from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const notifs = [
  { id: 1, text: 'Maintenance Bedside Monitor PM-BM-004 sedang berjalan.', time: '2 jam lalu', read: false },
  { id: 2, text: 'Nebulizer PM-NB-007 perlu kalibrasi — jadwal terlewat.', time: '1 hari lalu', read: false },
  { id: 3, text: 'Suction Pump PM-SUC-010 menunggu suku cadang.', time: '2 hari lalu', read: true },
];

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

  const unread = notifs.filter(n => !n.read).length;

  return (
    <>
      {/* Mobile sidebar overlay */}
      {showMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobile(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            <Sidebar mobile onClose={() => setShowMobile(false)} />
          </div>
        </div>
      )}

      <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
        <button onClick={() => setShowMobile(true)} className="lg:hidden text-slate-500 hover:text-slate-700 p-1">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          {title && (
            <div>
              <h1 className="text-sm font-semibold text-slate-800 truncate">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none flex-1 w-full" placeholder="Cari aset, lokasi..." />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="relative p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-4.5 h-4.5" strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 card shadow-lg z-40 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Notifikasi</p>
                <button onClick={() => setShowNotif(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              {notifs.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 ${!n.read ? 'bg-primary-50/40' : ''}`}>
                  <p className="text-sm text-slate-700 leading-snug">{n.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <span className="text-primary-700 text-xs font-bold">{user?.nama?.[0] || 'A'}</span>
        </div>
      </header>
    </>
  );
}
