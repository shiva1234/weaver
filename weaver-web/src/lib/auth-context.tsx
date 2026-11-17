"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type Customer = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  guest: boolean;
};

export type RegisterData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type AuthContextType = {
  customer: Customer | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<void>;
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

  const saveCustomer = (c: Customer) => {
    setCustomer(c);
    localStorage.setItem("weaver_customer", JSON.stringify(c));
  };

  const register = async (data: RegisterData) => {
    const res = await fetch(`${API_BASE}/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        guest: false,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      if (text.includes("uk_customer_email") || text.includes("duplicate") || text.includes("constraint")) {
        throw new Error("An account with this email already exists");
      }
      throw new Error(text || `Registration failed (${res.status})`);
    }
    const cust: Customer = await res.json();

    if (data.addressLine1 && data.city && data.state && data.postalCode && data.country) {
      await fetch(`${API_BASE}/api/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { id: cust.id },
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || "",
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        }),
      });
    }

    saveCustomer(cust);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/customers/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error("Invalid email or password");
    }
    const data: Customer = await res.json();
    saveCustomer(data);
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem("weaver_customer");
    localStorage.removeItem("weaver_guest_token");
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
