"use client";

type Dir = "asc" | "desc";

export default function SortBar({
  sort, dir, onChange,
  total
}: {
  sort: string; dir: Dir; total: number;
  onChange: (s: string, d: Dir) => void;
}) {
  return (
    <div className="sticky top-[116px] z-10 bg-white/95 backdrop-blur-md border border-[var(--color-border)] rounded-lg px-5 py-3 mb-5 flex items-center justify-between">
      <p className="text-sm text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{total}</span> products found
      </p>
      <div className="flex items-center gap-3">
        <label className="text-xs text-[var(--color-text-muted)] font-medium">Sort by</label>
        <select
          value={sort}
          onChange={(e) => onChange(e.target.value, dir)}
          className="border border-[var(--color-border)] rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] cursor-pointer"
        >
          <option value="sellPrice">Price</option>
          <option value="name">Name</option>
        </select>
        <select
          value={dir}
          onChange={(e) => onChange(sort, e.target.value as Dir)}
          className="border border-[var(--color-border)] rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] cursor-pointer"
        >
          <option value="desc">High → Low</option>
          <option value="asc">Low → High</option>
        </select>
      </div>
    </div>
  );
}