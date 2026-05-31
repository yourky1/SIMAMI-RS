export default function PageHeader({ title, description, action, eyebrow = "SIMAMI-RS" }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
      <div>
        <div className="mb-2 inline-flex rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-teal-700 ring-1 ring-teal-200">
          {eyebrow}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
