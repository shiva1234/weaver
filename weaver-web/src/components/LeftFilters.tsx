"use client";

import { useState } from "react";

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
  };
  onChange: (next: Partial<typeof selected>) => void;
}) {
  const [q, setQ] = useState(selected.query || "");
  const [minP, setMinP] = useState<string>(selected.minPrice?.toString() || "");
  const [maxP, setMaxP] = useState<string>(selected.maxPrice?.toString() || "");

  const colors = ["red","maroon","green","blue","gold","black","white","pink","purple"];
  const fabrics = ["silk","cotton","linen","georgette","chiffon","banarasi"];

  const toggle = (key: "color" | "fabric", val: string) => {
    const cur = new Set(selected[key]);
    if (cur.has(val)) cur.delete(val); else cur.add(val);
    onChange({ [key]: Array.from(cur) });
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-5">
        {/* Search */}
        <div className="border rounded-lg p-4">
          <div className="text-sm font-semibold mb-2">Search</div>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="e.g. banarasi"
              className="border rounded px-2 py-1 w-full"
            />
            <button
              onClick={()=>onChange({ query: q })}
              className="px-3 py-1 rounded bg-black text-white"
            >
              Go
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="border rounded-lg p-4">
          <div className="text-sm font-semibold mb-2">Price</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minP}
              onChange={(e)=>setMinP(e.target.value)}
              className="border rounded px-2 py-1 w-24"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxP}
              onChange={(e)=>setMaxP(e.target.value)}
              className="border rounded px-2 py-1 w-24"
            />
            <button
              onClick={()=>{
                onChange({
                  minPrice: minP ? Number(minP) : undefined,
                  maxPrice: maxP ? Number(maxP) : undefined
                });
              }}
              className="ml-auto px-3 py-1 rounded bg-gray-900 text-white"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Color */}
        <div className="border rounded-lg p-4">
          <div className="text-sm font-semibold mb-2">Color</div>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => {
              const active = selected.color.includes(c);
              return (
                <button
                  key={c}
                  onClick={()=>toggle("color", c)}
                  className={`px-3 py-1 rounded-full border text-sm ${active ? "bg-black text-white" : "bg-white"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fabric */}
        <div className="border rounded-lg p-4">
          <div className="text-sm font-semibold mb-2">Fabric</div>
          <div className="flex flex-wrap gap-2">
            {fabrics.map(f => {
              const active = selected.fabric.includes(f);
              return (
                <button
                  key={f}
                  onClick={()=>toggle("fabric", f)}
                  className={`px-3 py-1 rounded-full border text-sm ${active ? "bg-black text-white" : "bg-white"}`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}