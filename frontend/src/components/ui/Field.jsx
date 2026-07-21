import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons.jsx';

/** Label + input wrapper with inline error text. */
export function Field({ label, error, children, hint }) {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

/** Standard text input. */
export function TextInput({ error, className = '', ...props }) {
  return (
    <input
      {...props}
      className={`field ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-400/15' : ''} ${className}`}
    />
  );
}

/** Password input with a show/hide toggle button. */
export function PasswordInput({ error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`field pr-11 ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-400/15' : ''}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
        className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      >
        {show ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
      </button>
    </div>
  );
}
