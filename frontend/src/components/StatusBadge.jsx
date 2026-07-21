const STYLES = {
  idle: 'bg-sand-100 text-sand-500',
  sending: 'bg-amber-100 text-amber-700',
  generating: 'bg-brand-50 text-brand-700',
  saving: 'bg-brand-50 text-brand-700',
  completed: 'bg-emerald-50 text-emerald-700',
  failed: 'bg-red-50 text-red-700',
};

const LABELS = {
  idle: 'Idle',
  sending: 'Sending',
  generating: 'Generating',
  saving: 'Saving',
  completed: 'Done',
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
