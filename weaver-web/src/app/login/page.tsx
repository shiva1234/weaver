"use client";

import { useState } from "react";
import { useAuth, RegisterData } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass =
  "w-full border border-[var(--color-border)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all";

export default function LoginPage() {
  const { customer, register, login, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [reg, setReg] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const updateReg = (field: keyof RegisterData, value: string) =>
    setReg((prev) => ({ ...prev, [field]: value }));

  if (customer) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-8 text-center">
          <div className="w-16 h-16 bg-[var(--color-brand)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--color-brand)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[var(--color-text)] mb-1">
            Welcome, {customer.firstName || customer.email.split("@")[0]}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">{customer.email}</p>
          <button
            onClick={() => { logout(); }}
            className="w-full py-3 bg-[var(--color-brand)] text-white rounded-lg font-medium hover:bg-[var(--color-brand)]/90 transition-colors"
          >
            Sign Out
          </button>
          <Link href="/" className="block mt-4 text-sm text-[var(--color-gold)] hover:underline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(reg);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span
              className="text-3xl font-semibold tracking-[0.15em] text-[var(--color-brand)] uppercase"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Weaver
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-8">
          <h1 className="text-xl font-semibold text-[var(--color-text)] text-center mb-1">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] text-center mb-6">
            {mode === "login"
              ? "Welcome back to Weaver"
              : "Join us for exclusive handloom collections"}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={inputClass} placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={inputClass} placeholder="••••••••" minLength={6} />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--color-brand)] text-white rounded-lg font-medium hover:bg-[var(--color-brand)]/90 transition-colors disabled:opacity-50">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* ─── REGISTER FORM ─── */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Personal Details */}
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">
                  Personal Details
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" required value={reg.firstName} onChange={(e) => updateReg("firstName", e.target.value)} className={inputClass} placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" required value={reg.lastName} onChange={(e) => updateReg("lastName", e.target.value)} className={inputClass} placeholder="Doe" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input type="tel" required value={reg.phone} onChange={(e) => updateReg("phone", e.target.value)} className={inputClass} placeholder="+91 98765 43210" />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" required value={reg.email} onChange={(e) => updateReg("email", e.target.value)} className={inputClass} placeholder="your@email.com" />
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input type="password" required minLength={6} value={reg.password} onChange={(e) => updateReg("password", e.target.value)} className={inputClass} placeholder="Min 6 characters" />
                </div>
              </fieldset>

              {/* Address (Optional) */}
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-3">
                  Address <span className="text-[10px] font-normal normal-case tracking-normal">(optional)</span>
                </legend>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Address Line 1</label>
                    <input type="text" value={reg.addressLine1} onChange={(e) => updateReg("addressLine1", e.target.value)} className={inputClass} placeholder="123 Silk Lane" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Address Line 2</label>
                    <input type="text" value={reg.addressLine2} onChange={(e) => updateReg("addressLine2", e.target.value)} className={inputClass} placeholder="Apt, suite, floor" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">City</label>
                      <input type="text" value={reg.city} onChange={(e) => updateReg("city", e.target.value)} className={inputClass} placeholder="Varanasi" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">State</label>
                      <input type="text" value={reg.state} onChange={(e) => updateReg("state", e.target.value)} className={inputClass} placeholder="Uttar Pradesh" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Postal Code</label>
                      <input type="text" value={reg.postalCode} onChange={(e) => updateReg("postalCode", e.target.value)} className={inputClass} placeholder="221001" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Country</label>
                      <input type="text" value={reg.country} onChange={(e) => updateReg("country", e.target.value)} className={inputClass} placeholder="India" />
                    </div>
                  </div>
                </div>
              </fieldset>

              <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--color-brand)] text-white rounded-lg font-medium hover:bg-[var(--color-brand)]/90 transition-colors disabled:opacity-50">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                className="text-[var(--color-gold)] font-medium hover:underline"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
