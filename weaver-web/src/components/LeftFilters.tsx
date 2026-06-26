"use client";

import { useEffect, useState } from "react";
import { getCategories, Category } from "@/lib/api";

export default function LeftFilters({
  selected,
  onChange
}: {
  selected: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    color: string[];
    fabric: string[];
    categoryId?: string;
  };
  onChange: (next: Partial<typeof selected>) => void;
}) {
  const [q, setQ] = useState(selected.query || "");
  const [minP, setMinP] = useState<string>(selected.minPrice?.toString() || "");
  const [maxP, setMaxP] = useState<string>(selected.maxPrice?.toString() || "");

  const [categories, setCategories] = useState<Category[]>([]);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCatError("Failed to load categories"));
  }, []);

  const colors = ["red", "maroon", "green", "blue", "gold", "black", "white", "pink", "purple"];
  const fabrics = ["silk", "cotton", "linen", "georgette", "chiffon", "banarasi"];

  const colorMap: Record<string, string> = {
    red: "#DC2626", maroon: "#7B2D26", green: "#16A34A", blue: "#2563EB",
    gold: "#B8956A", black: "#1a1a1a", white: "#ffffff", pink: "#EC4899", purple: "#7C3AED"
  };

  const toggle = (key: "color" | "fabric", val: string) => {
    const cur = new Set(selected[key]);
    if (cur.has(val)) cur.delete(val); else cur.add(val);
    onChange({ [key]: Array.from(cur) });
  };

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-28 space-y-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text)] mb-4">Filters</h2>

        {/* Search */}
        <div className="pb-5 border-b border-[var(--color-border)]">
          <div className="relative">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onChange({ query: q || undefined }); }}
              placeholder="Search products..."
              className="w-full border border-[var(--color-border)] rounded-md px-3 py-2 pl-9 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="pb-5 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">Categories</h3>
          {catError && <p className="text-[11px] text-red-500">{catError}</p>}
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onChange({ categoryId: undefined })}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                  !selected.categoryId
                    ? "bg-[var(--color-brand)]/5 text-[var(--color-brand)] font-medium"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-warm-gray)] hover:text-[var(--color-text)]"
                }`}
              >
                All Products
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => onChange({ categoryId: cat.id })}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                    selected.categoryId === cat.id
                      ? "bg-[var(--color-brand)]/5 text-[var(--color-brand)] font-medium"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-warm-gray)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range */}
        <div className="pb-5 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">Price Range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minP}
              onChange={(e) => setMinP(e.target.value)}
              className="border border-[var(--color-border)] rounded-md px-2.5 py-2 w-full text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] transition-all"
            />
            <span className="text-gray-300 text-xs shrink-0">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxP}
              onChange={(e) => setMaxP(e.target.value)}
              className="border border-[var(--color-border)] rounded-md px-2.5 py-2 w-full text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] transition-all"
            />
          </div>
          <button
            onClick={() => {
              onChange({
                minPrice: minP ? Number(minP) : undefined,
                maxPrice: maxP ? Number(maxP) : undefined
              });
            }}
            className="mt-3 w-full px-3 py-2 rounded-md bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-white text-xs font-medium uppercase tracking-wider transition-colors"
          >
            Apply Price
          </button>
        </div>

        {/* Color */}
        <div className="pb-5 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => toggle("color", c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  selected.color.includes(c)
                    ? "border-[var(--color-brand)] scale-110 shadow-md"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: colorMap[c] }}
                title={c}
                aria-label={c}
              >
                {selected.color.includes(c) && (
                  <svg className="w-3 h-3 mx-auto text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fabric */}
        <div className="pb-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">Fabric</h3>
          <div className="space-y-1.5">
            {fabrics.map(f => (
              <label key={f} className="flex items-center gap-2.5 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={selected.fabric.includes(f)}
                  onChange={() => toggle("fabric", f)}
                  className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-brand)] focus:ring-[var(--color-gold)] focus:ring-offset-0"
                />
                <span className="text-sm text-[var(--color-text-muted)] capitalize group-hover:text-[var(--color-text)] transition-colors">
                  {f}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}