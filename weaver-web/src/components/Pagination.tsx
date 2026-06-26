"use client";

export default function Pagination({
  page, totalPages, onPage
}: {
  page: number; totalPages: number; onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Show max 7 page buttons with ellipsis
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, -1, totalPages];
    if (page >= totalPages - 3) return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, -1, page - 1, page, page + 1, -2, totalPages];
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-md hover:border-[var(--color-gold)] hover:text-[var(--color-brand)] disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
      >
        Previous
      </button>
      {getPages().map((p, i) =>
        p < 0 ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-9 h-9 text-sm rounded-md transition-all font-medium ${
              p === page
                ? "bg-[var(--color-brand)] text-white shadow-sm"
                : "border border-[var(--color-border)] hover:border-[var(--color-gold)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-4 py-2 text-sm border border-[var(--color-border)] rounded-md hover:border-[var(--color-gold)] hover:text-[var(--color-brand)] disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
      >
        Next
      </button>
    </div>
  );
}