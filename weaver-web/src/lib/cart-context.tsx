"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
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
    return cart.id;
  }, [cartId, customer]);

  const fetchItems = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/api/carts/${id}/items`);
    if (res.ok) {
      const data: CartItem[] = await res.json();
      setItems(data);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (cartId) {
      await fetchItems(cartId);
    }
  }, [cartId, fetchItems]);

  // Load cart on mount or when customer changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (customer) {
          const res = await fetch(`${API_BASE}/api/carts/by-customer/${customer.id}`);
          if (res.ok) {
            const cart = await res.json();
            setCartId(cart.id);
            await fetchItems(cart.id);
          }
        } else {
          const guestToken = localStorage.getItem("weaver_guest_token");
          if (guestToken) {
            const res = await fetch(`${API_BASE}/api/carts/guest/${guestToken}`);
            if (res.ok) {
              const cart = await res.json();
              setCartId(cart.id);
              await fetchItems(cart.id);
            }
          }
        }
      } catch {
        // Cart not found — that's fine
      } finally {
        setLoading(false);
      }
    };
    loadCart();
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
    await fetchItems(id);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!cartId) return;
    const res = await fetch(
      `${API_BASE}/api/carts/${cartId}/items/${itemId}?quantity=${quantity}`,
      { method: "PUT" }
    );
    if (!res.ok) throw new Error("Failed to update quantity");
    await fetchItems(cartId);
  };

  const removeItem = async (itemId: string) => {
    if (!cartId) return;
    await fetch(`${API_BASE}/api/carts/${cartId}/items/${itemId}`, { method: "DELETE" });
    await fetchItems(cartId);
  };

  const clearCart = async () => {
    if (!cartId) return;
    await fetch(`${API_BASE}/api/carts/${cartId}/items`, { method: "DELETE" });
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, cartId, totalItems, totalPrice, loading, addToCart, updateQuantity, removeItem, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
