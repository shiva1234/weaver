"use client";

export default function Pagination({
  page, totalPages, onPage
}: {
  page: number; totalPages: number; onPage: (p: number)=>void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={()=>onPage(Math.max(1, page-1))}
        disabled={page<=1}
        className="px-3 py-2 border rounded disabled:opacity-50"
      >
        ← Prev
      </button>
      <span className="text-sm">Page {page} / {totalPages}</span>
      <button
        onClick={()=>onPage(Math.min(totalPages, page+1))}
        disabled={page>=totalPages}
        className="px-3 py-2 border rounded disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
}