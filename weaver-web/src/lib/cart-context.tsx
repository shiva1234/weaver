"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useAuth } from "./auth-context";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:18080";

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartId: string | null;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (productId: string, productName: string, price: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { customer } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartOwnerKey, setCartOwnerKey] = useState<string | null>(null);
  const ownerKeyRef = useRef<string | null>(null);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;

    let res;
    if (customer) {
      res = await fetch(`${API_BASE}/api/carts/ensure/${customer.id}`, { method: "POST" });
    } else {
      // Guest cart with a stored token
      let guestToken = localStorage.getItem("weaver_guest_token");
      if (guestToken) {
        res = await fetch(`${API_BASE}/api/carts/guest/${guestToken}`);
        if (!res.ok) {
          // Token invalid, create new guest cart
          localStorage.removeItem("weaver_guest_token");
          guestToken = null;
        }
      }
      if (!guestToken) {
        const email = `guest_${Date.now()}@weaver.local`;
        res = await fetch(`${API_BASE}/api/carts/ensure-guest?email=${encodeURIComponent(email)}`, { method: "POST" });
      }
    }

    if (!res || !res.ok) throw new Error("Failed to create cart");
    const cart = await res.json();
    setCartId(cart.id);
    if (cart.guestToken) {
      localStorage.setItem("weaver_guest_token", cart.guestToken);
    }
    ownerKeyRef.current = customer
      ? `customer:${customer.id}`
      : `guest:${cart.guestToken ?? localStorage.getItem("weaver_guest_token") ?? "none"}`;
    setCartOwnerKey(ownerKeyRef.current);
    return cart.id;
  }, [cartId, customer]);

  const fetchItems = useCallback(async (id: string, ownerKey?: string) => {
    const res = await fetch(`${API_BASE}/api/carts/${id}/items`);
    if (res.ok) {
      const data: CartItem[] = await res.json();
      if (!ownerKey || ownerKeyRef.current === ownerKey) {
        setItems(data);
        if (ownerKey) setCartOwnerKey(ownerKey);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    if (cartId) {
      await fetchItems(cartId);
    }
  }, [cartId, fetchItems]);

  // Load cart on mount or when customer changes
  useEffect(() => {
    let cancelled = false;
    const guestToken = customer ? null : localStorage.getItem("weaver_guest_token");
    const ownerKey = customer
      ? `customer:${customer.id}`
      : `guest:${guestToken ?? "none"}`;
    ownerKeyRef.current = ownerKey;
    setItems([]);
    setCartId(null);
    setCartOwnerKey(null);

    const loadCart = async () => {
      setLoading(true);
      try {
        if (customer) {
          const res = await fetch(`${API_BASE}/api/carts/by-customer/${customer.id}`);
          if (res.ok && !cancelled && ownerKeyRef.current === ownerKey) {
            const cart = await res.json();
            setCartId(cart.id);
            await fetchItems(cart.id, ownerKey);
          }
        } else if (guestToken) {
          const res = await fetch(`${API_BASE}/api/carts/guest/${guestToken}`);
          if (res.ok && !cancelled && ownerKeyRef.current === ownerKey) {
            const cart = await res.json();
            setCartId(cart.id);
            await fetchItems(cart.id, ownerKey);
          }
        }
      } catch {
        // Cart not found — that's fine
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadCart();
    return () => {
      cancelled = true;
    };
  }, [customer, fetchItems]);

  const addToCart = async (productId: string, productName: string, price: number, quantity = 1) => {
    void productName;
    void price;
    const id = await ensureCart();
    const res = await fetch(
      `${API_BASE}/api/carts/${id}/items?productId=${productId}&quantity=${quantity}`,
      { method: "POST" }
    );
    if (!res.ok) throw new Error("Failed to add to cart");
    const ownerKey = ownerKeyRef.current;
    await fetchItems(id, ownerKey ?? undefined);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!cartId) return;
    const res = await fetch(
      `${API_BASE}/api/carts/${cartId}/items/${itemId}?quantity=${quantity}`,
      { method: "PUT" }
    );
    if (!res.ok) throw new Error("Failed to update quantity");
    await fetchItems(cartId, ownerKeyRef.current ?? undefined);
  };

  const removeItem = async (itemId: string) => {
    if (!cartId) return;
    await fetch(`${API_BASE}/api/carts/${cartId}/items/${itemId}`, { method: "DELETE" });
    await fetchItems(cartId, ownerKeyRef.current ?? undefined);
  };

  const clearCart = async () => {
    if (!cartId) return;
    await fetch(`${API_BASE}/api/carts/${cartId}/items`, { method: "DELETE" });
    setItems([]);
  };

  const activeOwnerKey = customer ? `customer:${customer.id}` : null;
  const visibleItems = activeOwnerKey && cartOwnerKey !== activeOwnerKey
    ? []
    : cartOwnerKey?.startsWith("customer:") && !activeOwnerKey
      ? []
      : items;
  const visibleTotalItems = visibleItems.reduce((sum, i) => sum + i.quantity, 0);
  const visibleTotalPrice = visibleItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: visibleItems, cartId, totalItems: visibleTotalItems, totalPrice: visibleTotalPrice, loading, addToCart, updateQuantity, removeItem, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
