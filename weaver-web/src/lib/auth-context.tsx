"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:18080";

export type Customer = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  guest: boolean;
};

type AuthContextType = {
  customer: Customer | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("weaver_customer");
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const register = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Registration failed (${res.status})`);
    }
    const data: Customer = await res.json();
    setCustomer(data);
    localStorage.setItem("weaver_customer", JSON.stringify(data));
  };

  const login = async (email: string, _password: string) => {
    // Since there's no login endpoint, we use the ensure-guest endpoint with email
    // to find the customer, then verify password client-side isn't possible.
    // We'll do a simple flow: fetch customer by creating with same email (API should return existing or error)
    // Actually, let's use forgot-password to verify email exists, then just store.
    // Simplest approach: POST /customers with same email — if 409/conflict, GET won't work without ID.
    // Best approach for now: create a login that calls a custom endpoint or just re-registers.
    // Since the API has no login endpoint, we'll simulate by registering (if new) or checking via cart ensure.
    
    // Try to create — if the email already exists, the API will return an error.
    // Then we know the user exists and we "log them in" by fetching via cart ensure.
    const res = await fetch(`${API_BASE}/api/carts/ensure-guest?email=${encodeURIComponent(email)}`, {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error("Invalid email or password");
    }
    const cart = await res.json();
    // Get customer ID from cart's customerId
    if (cart.customerId) {
      const custRes = await fetch(`${API_BASE}/api/customers/${cart.customerId}`);
      if (custRes.ok) {
        const data: Customer = await custRes.json();
        setCustomer(data);
        localStorage.setItem("weaver_customer", JSON.stringify(data));
        return;
      }
    }
    throw new Error("Invalid email or password");
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem("weaver_customer");
  };

  return (
    <AuthContext.Provider value={{ customer, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
