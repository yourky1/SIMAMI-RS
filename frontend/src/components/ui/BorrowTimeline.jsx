import { CheckCircle2, Circle } from "lucide-react";

export default function BorrowTimeline({ timeline = [] }) {
  return (
    <div className="space-y-3">
      {timeline.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            {item.done ? <CheckCircle2 className="text-emerald-600" size={20} /> : <Circle className="text-slate-300" size={20} />}
            {index !== timeline.length - 1 && <div className={`mt-1 h-8 w-px ${item.done ? "bg-emerald-200" : "bg-slate-200"}`} />}
          </div>
          <div className="pb-2">
            <p className={`text-sm font-bold ${item.done ? "text-slate-950" : "text-slate-500"}`}>{item.label}</p>
            <p className="text-xs text-slate-400">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
