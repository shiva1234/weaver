"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { href: "/sarees", label: "Sarees" },
  { href: "/fabrics", label: "Fabrics" },
  { href: "/dupattas", label: "Dupattas" },
  { href: "/stoles", label: "Stoles" },
  { href: "/home-decor", label: "Home Decor" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { customer } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Announcement bar */}
      <div className="bg-[var(--color-brand)] text-white text-[11px] text-center py-2 tracking-[0.15em] uppercase font-light">
        Free Shipping on Orders Above ₹2,999 &nbsp;·&nbsp; Authentic Handloom Guarantee
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 text-[var(--color-text)] hover:text-[var(--color-brand)]"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <span
              className="text-2xl lg:text-[26px] font-semibold tracking-[0.15em] text-[var(--color-brand)] uppercase"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Weaver
            </span>
            <span className="text-[9px] tracking-[0.4em] text-[var(--color-gold)] uppercase -mt-0.5 font-medium">
              Handloom Heritage
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-[13px] tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-brand)] transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[var(--color-gold)] group-hover:w-2/3 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-warm-gray)] transition-all"
              aria-label="Search"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              href="/login"
              className="p-2.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-warm-gray)] transition-all hidden sm:flex items-center gap-1.5"
              aria-label="Account"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {customer && (
                <span className="text-xs font-medium text-[var(--color-brand)] max-w-[60px] truncate">
                  {customer.firstName || customer.email.split("@")[0]}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="p-2.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-warm-gray)] transition-all relative"
              aria-label="Cart"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--color-brand)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-[var(--color-border)] shadow-lg z-50">
          <div className="max-w-2xl mx-auto px-4 py-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for sarees, fabrics, styles..."
                className="w-full border border-[var(--color-border)] rounded-lg px-4 py-3 pl-11 text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all"
                autoFocus
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--color-border)] bg-white">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-warm-gray)] rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
