"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { getProduct } from "@/lib/api";

export default function CartPage() {
  const { items, totalItems, totalPrice, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { customer } = useAuth();
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const ids = [...new Set(items.map((i) => i.productId))];
      const images: Record<string, string> = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const p = await getProduct(id);
            if (p.primaryImage) images[id] = p.primaryImage;
          } catch { /* ignore */ }
        })
      );
      setProductImages(images);
    };
    if (items.length > 0) fetchImages();
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-[var(--color-text-muted)]">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-[var(--color-warm-gray)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text)] mb-2">Your cart is empty</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Explore our handloom collections and add something beautiful.
          </p>
          <Link
            href="/sarees"
            className="inline-block px-6 py-3 bg-[var(--color-brand)] text-white rounded-lg font-medium hover:bg-[var(--color-brand)]/90 transition-colors"
          >
            Browse Sarees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-[var(--color-text)]" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Shopping Cart ({totalItems})
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-[var(--color-text-muted)] hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[var(--color-border)] p-4 flex gap-4"
              >
                <div className="w-20 h-24 bg-[var(--color-warm-gray)] rounded-lg flex-shrink-0 relative overflow-hidden">
                  {productImages[item.productId] && (
                    <Image
                      src={productImages[item.productId]}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[var(--color-text)] truncate">
                    {item.productName}
                  </h3>
                  <p className="text-sm text-[var(--color-gold)] font-semibold mt-1">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-[var(--color-border)] rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2.5 py-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-[var(--color-border)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 sticky top-24">
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Shipping</span>
                  <span className="text-green-600">{totalPrice >= 2999 ? "Free" : "₹99"}</span>
                </div>
                <hr className="border-[var(--color-border)]" />
                <div className="flex justify-between font-semibold text-[var(--color-text)]">
                  <span>Total</span>
                  <span>₹{(totalPrice + (totalPrice >= 2999 ? 0 : 99)).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {customer ? (
                <button className="w-full mt-6 py-3 bg-[var(--color-brand)] text-white rounded-lg font-medium hover:bg-[var(--color-brand)]/90 transition-colors">
                  Proceed to Checkout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full mt-6 py-3 bg-[var(--color-brand)] text-white rounded-lg font-medium hover:bg-[var(--color-brand)]/90 transition-colors text-center"
                >
                  Sign in to Checkout
                </Link>
              )}

              <p className="text-xs text-[var(--color-text-muted)] text-center mt-3">
                Free shipping on orders above ₹2,999
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
