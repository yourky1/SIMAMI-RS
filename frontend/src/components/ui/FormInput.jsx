import { cn } from "../../utils/cn.js";

const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-400";

export default function FormInput({ label, as = "input", className = "", children, ...props }) {
  const Component = as;

  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <Component className={cn(inputClass, className)} {...props}>
        {children}
      </Component>
    </label>
  );
}
