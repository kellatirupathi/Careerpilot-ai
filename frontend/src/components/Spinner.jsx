export default function Spinner({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-sand-500 ${className}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-sand-200 border-t-brand-600" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
