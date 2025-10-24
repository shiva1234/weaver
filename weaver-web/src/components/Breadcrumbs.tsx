export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-sm text-gray-600 mb-3">
      <ol className="flex flex-wrap gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && <span className="mx-2 text-gray-400">/</span>}
            {it.href ? (
              <a href={it.href} className="hover:underline">{it.label}</a>
            ) : (
              <span className="font-medium">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}