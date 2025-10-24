"use client";

type SortKey = "price" | "name";
type Dir = "asc" | "desc";

export default function SortBar({
  sort, dir, onChange,
  total
}: {
  sort: SortKey; dir: Dir; total: number;
  onChange: (s: SortKey, d: Dir) => void;
}) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border rounded-lg p-3 mb-4 flex items-center justify-between">
      <div className="text-sm text-gray-600">Showing <b>{total}</b> products</div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort</label>
        <select
          value={sort}
          onChange={(e)=>onChange(e.target.value as SortKey, dir)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
        <select
          value={dir}
          onChange={(e)=>onChange(sort, e.target.value as Dir)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="desc">High → Low</option>
          <option value="asc">Low → High</option>
        </select>
      </div>
    </div>
  );
}