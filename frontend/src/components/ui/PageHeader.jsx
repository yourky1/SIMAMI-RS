export default function PageHeader({ title, description, action, eyebrow = "SIMAMI-RS" }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-3 inline-flex rounded-full bg-white/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 ring-1 ring-emerald-200 backdrop-blur">
          {eyebrow}
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
