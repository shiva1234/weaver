"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProduct, Product } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-3">
            <div className="aspect-[4/5] shimmer rounded-lg" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => <div key={i} className="aspect-square shimmer rounded-md" />)}
            </div>
          </div>
          <div className="space-y-5 pt-2">
            <div className="h-5 shimmer rounded w-1/4" />
            <div className="h-8 shimmer rounded w-3/4" />
            <div className="h-4 shimmer rounded w-1/3" />
            <div className="h-10 shimmer rounded w-1/4 mt-6" />
            <div className="h-24 shimmer rounded w-full mt-6" />
            <div className="h-12 shimmer rounded w-1/2 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium text-lg">{error || "Product not found"}</p>
        <Link href="/sarees" className="mt-4 inline-block text-sm text-[var(--color-brand)] hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const discount = product.vendorPrice > product.sellPrice
    ? Math.round(((product.vendorPrice - product.sellPrice) / product.vendorPrice) * 100)
    : 0;

  const images = product.images?.length > 0 ? product.images : [product.primaryImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/sarees" },
          { label: product.name }
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative aspect-[4/5] bg-[var(--color-warm-gray)] rounded-lg overflow-hidden">
            <Image
              src={images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-[var(--color-brand)] text-white text-xs font-semibold px-3 py-1.5 rounded">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-[var(--color-brand)] shadow-md"
                      : "border-transparent hover:border-[var(--color-gold)]"
                  }`}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 lg:pt-2">
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="text-[11px] uppercase tracking-wider text-[var(--color-gold)] font-medium bg-[var(--color-gold)]/5 px-2.5 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="text-2xl lg:text-3xl font-semibold text-[var(--color-text)] leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          {product.ratingAvg > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.ratingAvg) ? "text-amber-400 fill-current" : "text-gray-200 fill-current"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-[var(--color-text-muted)]">
                {product.ratingAvg.toFixed(1)} · {product.ratingCount} reviews
              </span>
            </div>
          )}

          {/* Price */}
          <div className="bg-[var(--color-warm-gray)] rounded-lg px-5 py-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[var(--color-text)]">
                ₹{product.sellPrice.toLocaleString()}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-[var(--color-text-muted)] line-through">
                    ₹{product.vendorPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-brand)]">
                    Save ₹{(product.vendorPrice - product.sellPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Inclusive of all taxes · Free shipping</p>
          </div>

          {/* Material */}
          {product.material && (
            <div className="flex items-center gap-3 py-2">
              <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-medium">Material</span>
              <span className="text-sm text-[var(--color-text)] font-medium bg-[var(--color-warm-gray)] px-3 py-1 rounded-full">
                {product.material}
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="border border-[var(--color-border)] rounded-lg p-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-4">
                Specifications
              </h3>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <dt className="text-xs text-[var(--color-text-muted)] capitalize">{key.replace(/_/g, " ")}</dt>
                    <dd className="text-sm text-[var(--color-text)] font-medium mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Stock Status */}
          <div>
            {product.stockQty === 0 ? (
              <p className="inline-flex items-center gap-2 text-sm text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Out of Stock
              </p>
            ) : product.stockQty < 10 ? (
              <p className="inline-flex items-center gap-2 text-sm text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Only {product.stockQty} left in stock
              </p>
            ) : (
              <p className="inline-flex items-center gap-2 text-sm text-green-700 font-medium bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                In Stock
              </p>
            )}
          </div>

          {/* Quantity & Actions */}
          {product.stockQty > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-sm text-[var(--color-text-muted)] font-medium">Quantity</label>
                <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2.5 text-sm hover:bg-[var(--color-warm-gray)] transition-colors font-medium"
                  >
                    −
                  </button>
                  <span className="px-5 py-2.5 text-sm border-x border-[var(--color-border)] min-w-[48px] text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                    className="px-4 py-2.5 text-sm hover:bg-[var(--color-warm-gray)] transition-colors font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    if (!product) return;
                    setAddingToCart(true);
                    try {
                      await addToCart(product.id, product.name, product.sellPrice, quantity);
                      setAddedToCart(true);
                      setTimeout(() => setAddedToCart(false), 2000);
                    } catch {
                      // handle error silently
                    } finally {
                      setAddingToCart(false);
                    }
                  }}
                  disabled={addingToCart}
                  className="flex-1 btn-primary py-4 text-sm disabled:opacity-50"
                >
                  {addingToCart ? "Adding..." : addedToCart ? "✓ Added to Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-14 flex items-center justify-center border rounded-[var(--radius)] transition-all ${
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-[var(--color-border)] hover:border-[var(--color-gold)] text-[var(--color-text-muted)] hover:text-red-400"
                  }`}
                  aria-label="Add to wishlist"
                >
                  <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Care Instructions */}
          {product.careInstructions && (
            <div className="border border-[var(--color-border)] rounded-lg p-5 mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Care Instructions
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{product.careInstructions}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
