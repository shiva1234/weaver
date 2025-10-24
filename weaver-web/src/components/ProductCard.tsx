import { Product } from "@/lib/api";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group relative rounded-xl bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      {p.badge && (
        <span className="absolute top-2 left-2 z-10 bg-black text-white text-xs px-2 py-1 rounded">
          {p.badge}
        </span>
      )}
      <img
        src={p.image || "/placeholder.png"}
        alt={p.name}
        className="h-64 w-full object-cover group-hover:scale-[1.02] transition"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-medium line-clamp-1">{p.name}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{p.description}</p>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="text-lg font-semibold">₹{p.price.toLocaleString()}</div>
          {/* Optional compare-at price / discount */}
        </div>
      </div>
    </div>
  );
}