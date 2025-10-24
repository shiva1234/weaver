"use client";

export default function FilterChips({
  active,
  onRemove,
  onClear
}: {
  active: { label: string; key: string; value: string }[];
  onRemove: (key: string, value: string) => void;
  onClear: () => void;
}) {
  if (!active.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {active.map((f, i) => (
        <button
          key={i}
          onClick={()=>onRemove(f.key, f.value)}
          className="text-sm bg-gray-100 border rounded-full px-3 py-1 hover:bg-gray-200"
          title="Remove filter"
        >
          {f.label} ✕
        </button>
      ))}
      <button onClick={onClear} className="text-sm text-blue-700 hover:underline">
        Clear all
      </button>
    </div>
  );
}