import { Filter, Search } from "lucide-react";

export default function SearchFilterBar({ value, onChange, placeholder = "Cari data..." }) {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={15}
        />
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          placeholder={placeholder}
        />
      </div>
      <button className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
        <Filter size={14} />
        Filter
      </button>
    </div>
  );
}
