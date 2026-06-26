"use client";

import { Product } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ p }: { p: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discount = p.vendorPrice > p.sellPrice
    ? Math.round(((p.vendorPrice - p.sellPrice) / p.vendorPrice) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link
      href={`/products/${p.id}`}
      className="group relative bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 block"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="bg-[var(--color-brand)] text-white text-[10px] font-semibold px-2.5 py-1 rounded">
            -{discount}%
          </span>
        )}
        {p.stockQty > 0 && p.stockQty < 5 && (
          <span className="bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded">
            Few Left
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isWishlisted
            ? "bg-red-50 text-red-500 shadow-sm"
            : "bg-white/80 backdrop-blur-sm text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-400 shadow-sm"
        }`}
        aria-label="Add to wishlist"
      >
        <svg
          className="w-4 h-4"
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative w-full aspect-[3/4] bg-[var(--color-warm-gray)] overflow-hidden">
        {p.primaryImage && !imageError && !p.primaryImage.includes("example.com") ? (
          <Image
            src={p.primaryImage}
            alt={p.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <svg className="w-10 h-10 mx-auto text-[var(--color-gold)]/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">{p.name}</p>
            </div>
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent py-4 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-xs font-medium tracking-wide">Quick View</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        {p.ratingAvg > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(p.ratingAvg) ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">({p.ratingCount})</span>
          </div>
        )}

        {/* Name */}
        <h3 className="text-sm text-[var(--color-text)] leading-snug line-clamp-2 mb-2.5 min-h-[2.5em] font-medium">
          {p.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-[var(--color-text)]">₹{p.sellPrice.toLocaleString()}</span>
          {discount > 0 && (
            <span className="text-xs text-[var(--color-text-muted)] line-through">₹{p.vendorPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Material tag */}
        {p.material && (
          <p className="mt-2 text-[11px] text-[var(--color-gold)] font-medium tracking-wide uppercase">
            {p.material}
          </p>
        )}
      </div>
    </Link>
  );
}