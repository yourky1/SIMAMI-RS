import { cn } from "../../utils/cn.js";

export default function StatCard({ title, value, note, icon: Icon, tone = "teal" }) {
  const tones = {
    teal:    { text: "text-teal-700",    bg: "bg-teal-50",    ring: "ring-teal-200" },
    blue:    { text: "text-blue-700",    bg: "bg-blue-50",    ring: "ring-blue-200" },
    amber:   { text: "text-amber-700",   bg: "bg-amber-50",   ring: "ring-amber-200" },
    rose:    { text: "text-rose-700",    bg: "bg-rose-50",    ring: "ring-rose-200" },
    emerald: { text: "text-emerald-700", bg: "bg-emerald-50", ring: "ring-emerald-200" }
  };

  const { text, bg, ring } = tones[tone] || tones.teal;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <div className={cn("rounded-md p-2.5 ring-1", text, bg, ring)}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
