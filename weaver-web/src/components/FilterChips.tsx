"use client";

export default function FilterChips({
  active,
  onRemove,
  onClear
}: {
  active: { label: string; key: string; value: string }[];
  onRemove: (key: string, value: string) => void;
  onClear: () => void;
}) {
  if (!active.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {active.map((f, i) => (
        <button
          key={i}
          onClick={() => onRemove(f.key, f.value)}
          className="inline-flex items-center gap-1.5 text-xs bg-[var(--color-brand)]/5 border border-[var(--color-brand)]/15 text-[var(--color-brand)] rounded-full px-3 py-1.5 hover:bg-[var(--color-brand)]/10 transition-colors"
          title="Remove filter"
        >
          {f.label}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        onClick={onClear}
        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors ml-1 underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}