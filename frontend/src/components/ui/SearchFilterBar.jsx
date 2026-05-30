import { Filter, Search } from "lucide-react";

export default function SearchFilterBar({ value, onChange, placeholder = "Cari data..." }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          placeholder={placeholder}
        />
      </div>
      <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-white">
        <Filter size={17} /> Filter
      </button>
    </div>
  );
}
