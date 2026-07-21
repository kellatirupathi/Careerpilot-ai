import { Link } from 'react-router-dom';
import { SparklesIcon, CheckIcon } from './ui/Icons.jsx';

/**
 * Split-screen auth shell: brand/marketing panel on the left, form on the right.
 * Fully responsive — the left panel hides on small screens.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-900 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-ink-800 to-ink-900" />
        <div className="absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 backdrop-blur">
              <SparklesIcon />
            </span>
            AI Learning Assistant
          </Link>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight">
              Learn any technical topic, explained simply.
            </h2>
            <ul className="mt-8 space-y-4 text-white/80">
              {[
                'Direct answers, then step-by-step explanations',
                'A practical example every single time',
                'Revision questions to lock in your learning',
                'Your conversations saved and private to you',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15">
                    <CheckIcon width={14} height={14} />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/50">Built for undergraduate students.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="mb-8 flex items-center gap-2 font-semibold text-slate-900 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <SparklesIcon width={18} height={18} />
            </span>
            AI Learning Assistant
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-600">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
