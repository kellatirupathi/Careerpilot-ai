const STYLES = {
  idle: 'bg-slate-100 text-slate-600',
  sending: 'bg-amber-100 text-amber-700',
  generating: 'bg-brand-100 text-brand-700',
  saving: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const LABELS = {
  idle: 'Idle',
  sending: 'Sending…',
  generating: 'Generating…',
  saving: 'Saving…',
  completed: 'Completed',
  failed: 'Failed',
};

export default function StatusBadge({ status = 'idle' }) {
  const style = STYLES[status] || STYLES.idle;
  const label = LABELS[status] || status;
  const animated = ['sending', 'generating', 'saving'].includes(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {animated && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
      {label}
    </span>
  );
}
