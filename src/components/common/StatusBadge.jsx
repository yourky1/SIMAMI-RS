const configs = {
  // Status aset
  'Tersedia':             { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Dipinjam':             { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  'Maintenance':          { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Rusak':                { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
  'Perlu Kalibrasi':      { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  // Status maintenance & mutasi (shared)
  'Selesai':              { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Sedang Dikerjakan':    { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  'Terjadwal':            { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400' },
  'Menunggu Suku Cadang': { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  'Belum Dikembalikan':   { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Dalam Proses':         { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  // Kondisi
  'Baik':                 { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Cukup':                { bg: 'bg-yellow-50',  text: 'text-yellow-700',  dot: 'bg-yellow-500' },
  'Rusak Ringan':         { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500' },
  'Rusak Berat':          { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
  // Prioritas
  'Tinggi':               { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500' },
  'Sedang':               { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Rendah':               { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400' },
  // User
  'Aktif':                { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Nonaktif':             { bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400' },
  // Role
  'Administrator':        { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500' },
  'Petugas Bangsal':      { bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500' },
  'Teknisi':              { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-500' },
};

const defaultConfig = { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };

export default function StatusBadge({ status, showDot = true, size = 'sm' }) {
  const cfg = configs[status] || defaultConfig;
  const sizeClass = size === 'xs' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium ${cfg.bg} ${cfg.text} ${sizeClass}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />}
      {status}
    </span>
  );
}
