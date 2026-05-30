import { cn } from "../../utils/cn.js";

export default function StatCard({ title, value, note, icon: Icon, tone = "emerald" }) {
  const tones = {
    emerald: "from-emerald-500 to-teal-500 text-emerald-700 bg-emerald-50 ring-emerald-100",
    blue: "from-blue-500 to-cyan-500 text-blue-700 bg-blue-50 ring-blue-100",
    amber: "from-amber-500 to-orange-500 text-amber-700 bg-amber-50 ring-amber-100",
    rose: "from-rose-500 to-pink-500 text-rose-700 bg-rose-50 ring-rose-100"
  };

  const selected = tones[tone] || tones.emerald;
  const [gradientFrom, gradientTo, textClass, bgClass, ringClass] = selected.split(" ");

  return (
    <div className="group relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className={`absolute -right-8 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-12 blur-2xl transition group-hover:opacity-25`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
        </div>
        <div className={cn("rounded-2xl p-3 ring-1", textClass, bgClass, ringClass)}>
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}
