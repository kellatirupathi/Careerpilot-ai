import { Link } from 'react-router-dom';
import { SparklesIcon } from './ui/Icons.jsx';

/**
 * Auth shell. Quiet editorial panel on the left (a single real quote / product
 * moment), the form on the right. The left panel hides on small screens.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Left: calm brand panel */}
      <div className="relative hidden flex-col justify-between bg-ink p-12 text-sand-100 lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold text-white">Learnwell</span>
        </Link>

        <blockquote className="max-w-md">
          <p className="font-display text-2xl leading-snug text-white">
            “It finally explained recursion in a way that stuck — the example did it.”
          </p>
          <footer className="mt-4 text-sm text-sand-400">A second-year CS student</footer>
        </blockquote>

        <div className="flex items-center gap-2 text-sm text-sand-400">
          <SparklesIcon width={16} height={16} className="text-brand-400" />
          Answers structured for learning, not just correctness.
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-sand-50 px-6 py-12">
        <div className="w-full max-w-sm animate-fade-up">
          <Link to="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <SparklesIcon width={16} height={16} />
            </span>
            <span className="font-display text-lg font-semibold text-ink">Learnwell</span>
          </Link>

          <h1 className="text-[26px] font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[15px] text-sand-600">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-8 text-center text-sm text-sand-600">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
