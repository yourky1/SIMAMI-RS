import { cn } from "../../utils/cn.js";

const inputClass = "w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-400";

export default function FormInput({ label, as = "input", className = "", children, ...props }) {
  const Component = as;

  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <Component className={cn(inputClass, className)} {...props}>
        {children}
      </Component>
    </label>
  );
}
