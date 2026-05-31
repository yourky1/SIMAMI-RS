import { cn } from "../../utils/cn.js";

const styles = {
  Tersedia:              "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Dipakai:               "bg-blue-50 text-blue-700 ring-blue-200",
  Dipinjam:              "bg-amber-50 text-amber-700 ring-amber-200",
  Maintenance:           "bg-rose-50 text-rose-700 ring-rose-200",
  Selesai:               "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Belum kembali":       "bg-amber-50 text-amber-700 ring-amber-200",
  "Butuh tindak lanjut": "bg-rose-50 text-rose-700 ring-rose-200",
  Terjadwal:             "bg-sky-50 text-sky-700 ring-sky-200",
  Aktif:                 "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Nonaktif:              "bg-slate-100 text-slate-500 ring-slate-200",
  "Menunggu Persetujuan":"bg-amber-50 text-amber-700 ring-amber-200",
  Disetujui:             "bg-teal-50 text-teal-700 ring-teal-200",
  "Sedang Dipinjam":     "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Ditolak:               "bg-rose-50 text-rose-700 ring-rose-200",
  Kritis:                "bg-orange-50 text-orange-700 ring-orange-200",
  "Sangat Kritis":       "bg-rose-50 text-rose-700 ring-rose-200",
  Normal:                "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function StatusBadge({ value }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1",
        styles[value] ?? "bg-slate-100 text-slate-600 ring-slate-200"
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
      {value}
    </span>
  );
}
