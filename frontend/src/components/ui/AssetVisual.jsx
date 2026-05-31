import { Activity, Armchair, Gauge, HeartPulse, Monitor, Stethoscope, Wind, Zap } from "lucide-react";

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
    <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${config.gradient} text-white ${className}`}>
      {/* subtle gloss overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_50%)]" />
      {/* Icon centered */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="grid place-items-center rounded-full bg-white/20 p-3 ring-1 ring-white/30">
          <Icon size={22} />
        </div>
      </div>
      {/* Label chip — bottom left */}
      <div className="absolute bottom-1.5 left-1.5 rounded bg-black/25 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white/90">
        {config.label}
      </div>
    </div>
  );
}
