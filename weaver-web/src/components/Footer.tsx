import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1F1B18] mt-20">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", label: "Free Shipping", sub: "Orders above ₹2,999" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "Authenticity Guaranteed", sub: "100% handloom certified" },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "Easy Returns", sub: "15-day return policy" },
              { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "Secure Payments", sub: "SSL encrypted checkout" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{item.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <h3
              className="text-xl font-semibold tracking-[0.15em] text-white uppercase mb-1"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Weaver
            </h3>
            <p className="text-[10px] tracking-[0.3em] text-[var(--color-gold)] uppercase mb-5 font-medium">
              Handloom Heritage
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Curating the finest handloom textiles from master artisan weavers across India since 2020.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {["Instagram", "Facebook", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[var(--color-gold)]/20 flex items-center justify-center text-gray-500 hover:text-[var(--color-gold)] transition-all"
                  aria-label={social}
                >
                  <span className="text-[10px] font-bold">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Sarees", href: "/sarees" },
                { label: "Lehengas", href: "/sarees" },
                { label: "Kurtis", href: "/sarees" },
                { label: "Dupattas", href: "/sarees" },
                { label: "Fabrics", href: "/sarees" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About Us", "Our Artisans", "Sustainability", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Get early access to new collections and exclusive offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-l-md px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              />
              <button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] text-white text-xs font-medium px-5 py-2.5 rounded-r-md transition-colors uppercase tracking-wider">
                Subscribe
              </button>
            </div>
            <p className="text-[11px] text-gray-600 mt-2">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Weaver. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map((item) => (
              <a key={item} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
