"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SortBar from "@/components/SortBar";
import FilterChips from "@/components/FilterChips";
import LeftFilters from "@/components/LeftFilters";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getProducts, Product } from "@/lib/api";

type Dir = "asc" | "desc";
type SortKey = "price" | "name";

type PageDto<T> = {
  items: T[];        // or 'content' if that’s what your API returns
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function SareesPage() {
  const [page, setPage] = useState(1);
  const [size] = useState(24);
  const [sort, setSort] = useState<SortKey>("price");
  const [dir, setDir] = useState<Dir>("desc");

  const [query, setQuery] = useState<string>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [color, setColor] = useState<string[]>([]);
  const [fabric, setFabric] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PageDto<Product> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // extract complex expressions for deps
  const colorKey  = useMemo(() => color.join(","), [color]);
  const fabricKey = useMemo(() => fabric.join(","), [fabric]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({
        page, size, sort, dir, query, minPrice, maxPrice,
        // if backend supports these:
        // color, fabric
      });

      // map to our PageDto<Product>
      const items = (res.items ?? res.content) as Product[];
      const pageNum = res.page ?? res.currentPage ?? page;

      setData({
        items,
        page: pageNum,
        pageSize: res.pageSize ?? size,
        totalItems: res.totalItems ?? res.totalElements ?? items.length,
        totalPages: res.totalPages ?? 1,
        hasNext: res.hasNext ?? (pageNum < (res.totalPages ?? 1)),
        hasPrev: res.hasPrev ?? (pageNum > 1),
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, size, sort, dir, query, minPrice, maxPrice, colorKey, fabricKey]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeChips = useMemo(() => {
    const chips: {label:string; key:string; value:string}[] = [];
    if (query) chips.push({label:`Search: ${query}`, key:"query", value:query});
    if (minPrice != null) chips.push({label:`Min ₹${minPrice}`, key:"minPrice", value:String(minPrice)});
    if (maxPrice != null) chips.push({label:`Max ₹${maxPrice}`, key:"maxPrice", value:String(maxPrice)});
    color.forEach(c=>chips.push({label:`Color: ${c}`, key:"color", value:c}));
    fabric.forEach(f=>chips.push({label:`Fabric: ${f}`, key:"fabric", value:f}));
    return chips;
  }, [query, minPrice, maxPrice, color, fabric]);

  const handleRemoveChip = (key: string, value: string) => {
    if (key === "query") setQuery(undefined);
    else if (key === "minPrice") setMinPrice(undefined);
    else if (key === "maxPrice") setMaxPrice(undefined);
    else if (key === "color") setColor(prev => prev.filter(v => v !== value));
    else if (key === "fabric") setFabric(prev => prev.filter(v => v !== value));
    setPage(1);
  };

  const handleClear = () => {
    setQuery(undefined); setMinPrice(undefined); setMaxPrice(undefined);
    setColor([]); setFabric([]); setPage(1);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sarees" }]} />
      <div className="flex gap-6">
        <LeftFilters
          selected={{ query, minPrice, maxPrice, color, fabric }}
          onChange={(n) => {
            if ("query" in n) setQuery(n.query);
            if ("minPrice" in n) setMinPrice(n.minPrice);
            if ("maxPrice" in n) setMaxPrice(n.maxPrice);
            if ("color" in n) setColor(n.color as string[]);
            if ("fabric" in n) setFabric(n.fabric as string[]);
            setPage(1);
          }}
        />
        <section className="flex-1">
          <SortBar
            sort={sort}
            dir={dir}
            total={data?.totalItems ?? 0}
            onChange={(s, d)=>{ setSort(s); setDir(d); setPage(1); }}
          />

          <FilterChips active={activeChips} onRemove={handleRemoveChip} onClear={handleClear} />

          {loading && <div className="py-20 text-center text-gray-600">Loading…</div>}
          {error && <div className="py-20 text-center text-red-600">{error}</div>}

          {!loading && !error && (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.items.map((p)=> <ProductCard key={p.id} p={p} />)}
              </div>
              <Pagination
                page={data?.page || 1}
                totalPages={data?.totalPages || 1}
                onPage={(p)=>setPage(p)}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}