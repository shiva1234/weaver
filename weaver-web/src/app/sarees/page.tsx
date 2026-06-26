"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SortBar from "@/components/SortBar";
import FilterChips from "@/components/FilterChips";
import LeftFilters from "@/components/LeftFilters";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getProducts, Product, PageResponse } from "@/lib/api";

type Dir = "asc" | "desc";
type SortKey = "sellPrice" | "name";

export default function SareesPage() {
  const [page, setPage] = useState(1);
  const [size] = useState(24);
  const [sort, setSort] = useState<SortKey>("sellPrice");
  const [dir, setDir] = useState<Dir>("desc");

  const [query, setQuery] = useState<string>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [color, setColor] = useState<string[]>([]);
  const [fabric, setFabric] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageResponse<Product> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({
        page, size, sort, dir, query, minPrice, maxPrice, categoryId
      });
      setData(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, size, sort, dir, query, minPrice, maxPrice, categoryId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeChips = useMemo(() => {
    const chips: { label: string; key: string; value: string }[] = [];
    if (query) chips.push({ label: `"${query}"`, key: "query", value: query });
    if (minPrice != null) chips.push({ label: `Min ₹${minPrice.toLocaleString()}`, key: "minPrice", value: String(minPrice) });
    if (maxPrice != null) chips.push({ label: `Max ₹${maxPrice.toLocaleString()}`, key: "maxPrice", value: String(maxPrice) });
    color.forEach(c => chips.push({ label: c, key: "color", value: c }));
    fabric.forEach(f => chips.push({ label: f, key: "fabric", value: f }));
    return chips;
  }, [query, minPrice, maxPrice, color, fabric]);

  const handleRemoveChip = (key: string, value: string) => {
    if (key === "query") setQuery(undefined);
    else if (key === "minPrice") setMinPrice(undefined);
    else if (key === "maxPrice") setMaxPrice(undefined);
    else if (key === "categoryId") setCategoryId(undefined);
    else if (key === "color") setColor(prev => prev.filter(v => v !== value));
    else if (key === "fabric") setFabric(prev => prev.filter(v => v !== value));
    setPage(1);
  };

  const handleClear = () => {
    setQuery(undefined); setMinPrice(undefined); setMaxPrice(undefined); setCategoryId(undefined);
    setColor([]); setFabric([]); setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <div className="flex gap-10">
        <LeftFilters
          selected={{ query, minPrice, maxPrice, color, fabric, categoryId }}
          onChange={(n) => {
            if ("query" in n) setQuery(n.query);
            if ("minPrice" in n) setMinPrice(n.minPrice);
            if ("maxPrice" in n) setMaxPrice(n.maxPrice);
            if ("categoryId" in n) setCategoryId(n.categoryId);
            if ("color" in n) setColor(n.color as string[]);
            if ("fabric" in n) setFabric(n.fabric as string[]);
            setPage(1);
          }}
        />

        <section className="flex-1 min-w-0">
          <SortBar
            sort={sort}
            dir={dir}
            total={data?.totalItems ?? 0}
            onChange={(s, d) => { setSort(s as SortKey); setDir(d); setPage(1); }}
          />

          <FilterChips active={activeChips} onRemove={handleRemoveChip} onClear={handleClear} />

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-[3/4] shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 shimmer rounded w-full" />
                    <div className="h-3 shimmer rounded w-2/3" />
                    <div className="h-4 shimmer rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <button onClick={fetchData} className="mt-3 text-sm text-[var(--color-brand)] hover:underline">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {data?.content.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-warm-gray)] mb-4">
                    <svg className="w-7 h-7 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <p className="text-[var(--color-text)] font-medium text-lg">No products found</p>
                  <p className="text-[var(--color-text-muted)] text-sm mt-1">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {data?.content.map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
              )}
              <Pagination
                page={data?.page || 1}
                totalPages={data?.totalPages || 1}
                onPage={(p) => setPage(p)}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}