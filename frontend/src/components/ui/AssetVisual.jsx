import { Activity, Armchair, Gauge, HeartPulse, Monitor, Sparkles, Stethoscope, Wind, Zap } from "lucide-react";

const visualMap = {
  oxygen: { icon: Wind, gradient: "from-sky-500 via-cyan-500 to-emerald-500", label: "O₂", glow: "shadow-sky-200" },
  monitor: { icon: Monitor, gradient: "from-blue-500 via-indigo-500 to-violet-600", label: "MON", glow: "shadow-blue-200" },
  defib: { icon: Zap, gradient: "from-rose-500 via-orange-500 to-amber-500", label: "AED", glow: "shadow-rose-200" },
  wheelchair: { icon: Armchair, gradient: "from-amber-500 via-lime-500 to-emerald-500", label: "WC", glow: "shadow-amber-200" },
  pump: { icon: Gauge, gradient: "from-emerald-500 via-teal-500 to-cyan-600", label: "PMP", glow: "shadow-emerald-200" },
  nebulizer: { icon: Wind, gradient: "from-cyan-500 via-sky-500 to-blue-500", label: "NEB", glow: "shadow-cyan-200" },
  ekg: { icon: HeartPulse, gradient: "from-fuchsia-500 via-rose-500 to-orange-500", label: "EKG", glow: "shadow-fuchsia-200" },
  suction: { icon: Activity, gradient: "from-slate-600 via-emerald-700 to-teal-600", label: "SCT", glow: "shadow-slate-200" }
};

export default function AssetVisual({ type = "default", className = "" }) {
  const config = visualMap[type] || { icon: Stethoscope, gradient: "from-slate-600 via-emerald-700 to-teal-600", label: "MED", glow: "shadow-emerald-200" };
  const Icon = config.icon;

  return (
    <div className={`relative overflow-hidden rounded-[1.7rem] bg-gradient-to-br ${config.gradient} p-5 text-white shadow-xl ${config.glow} ${className}`}>
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/18 blur-xl" />
      <div className="absolute -bottom-12 left-8 h-36 w-36 rounded-full bg-white/12 blur-xl" />
      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.24),transparent_35%,rgba(255,255,255,0.09))]" />
      <div className="relative flex h-full min-h-32 flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/18 backdrop-blur ring-1 ring-white/20">
            <Icon size={28} />
          </div>
          <Sparkles size={18} className="text-white/65" />
        </div>
        <div>
          <p className="text-5xl font-black tracking-tight drop-shadow-sm">{config.label}</p>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">Medical Asset</p>
        </div>
      </div>
    </div>
  );
}
