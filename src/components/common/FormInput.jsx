export function FormInput({ label, id, required, hint, error, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input id={id} className={`input-field ${error ? 'border-red-400 focus:ring-red-400/30' : ''}`} {...props} />
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function FormSelect({ label, id, required, children, error, hint, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select id={id} className={`input-field ${error ? 'border-red-400' : ''}`} {...props}>
        {children}
      </select>
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function FormTextarea({ label, id, required, hint, error, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea id={id} rows={3} className={`input-field resize-none ${error ? 'border-red-400' : ''}`} {...props} />
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
