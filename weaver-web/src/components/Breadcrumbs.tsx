import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && (
              <svg className="w-3.5 h-3.5 mx-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
            {it.href ? (
              <Link href={it.href} className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors">
                {it.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-[var(--color-text)]">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}