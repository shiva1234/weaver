"use client";

import { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import SortBar from "@/components/SortBar";
import FilterChips from "@/components/FilterChips";
import LeftFilters from "@/components/LeftFilters";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { getProducts, Product } from "@/lib/api";

type Dir = "asc" | "desc";
type SortKey = "price" | "name";

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
  const [data, setData] = useState<{
    content: Product[]; page: number; totalPages: number; totalElements: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res: any = await getProducts({ page, size, sort, dir, query, minPrice, maxPrice, color, fabric });

      // normalize backend keys -> UI shape
      const items: Product[] = res.items ?? res.content ?? [];
      const pageNo: number = res.page ?? 1;
      const pageSize: number = res.pageSize ?? size;
      const totalItems: number = res.totalItems ?? res.totalElements ?? 0;

      setData({
        content: items,
        page: pageNo,
        totalPages: res.totalPages ?? Math.max(1, Math.ceil(totalItems / pageSize)),
        totalElements: totalItems,
      });
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(); /* eslint-disable-next-line */ }, [page, size, sort, dir, query, minPrice, maxPrice, color.join(","), fabric.join(",")]);

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
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Sarees" }
      ]} />

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
            total={data?.totalElements || 0}
            onChange={(s, d)=>{ setSort(s); setDir(d); setPage(1); }}
          />

          <FilterChips
            active={activeChips}
            onRemove={handleRemoveChip}
            onClear={handleClear}
          />

          {loading && <div className="py-20 text-center text-gray-600">Loading…</div>}
          {error && <div className="py-20 text-center text-red-600">{error}</div>}

          {!loading && !error && (
            <>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.content.map((p)=> <ProductCard key={p.id} p={p} />)}
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