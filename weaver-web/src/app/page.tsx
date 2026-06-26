import Link from "next/link";
import { getProducts, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await getProducts({ page: 1, size: 8, sort: "sellPrice", dir: "desc" });
    return res.content;
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#2D2926] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2D2926] via-transparent to-[#2D2926]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <p className="text-[var(--color-gold)] text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Handcrafted with Heritage
            </p>
            <h1
              className="text-4xl lg:text-6xl font-semibold text-white leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Timeless Textiles,<br />Modern Elegance
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-10 max-w-lg">
              Discover authentic handloom sarees and textiles crafted by master artisans from across India.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/sarees" className="btn-primary inline-block">
                Explore Collection
              </Link>
              <Link href="/sarees" className="btn-outline inline-block text-white border-white/30 hover:border-white hover:text-white">
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-heading">Shop by Category</h2>
          <p className="section-subheading">Curated collections for every occasion</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {[
            { name: "Sarees", desc: "Traditional & contemporary", color: "#7B2D26" },
            { name: "Lehengas", desc: "Bridal & festive", color: "#B8956A" },
            { name: "Fabrics", desc: "By the meter", color: "#4A6741" },
            { name: "Dupattas", desc: "Handwoven accents", color: "#3D5A80" },
          ].map((cat) => (
            <Link
              key={cat.name}
              href="/sarees"
              className="group relative rounded-xl overflow-hidden aspect-[3/4] flex items-end"
            >
              <div className="absolute inset-0" style={{ backgroundColor: cat.color }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="relative p-5 lg:p-6 w-full">
                <h3
                  className="text-lg lg:text-xl font-semibold text-white mb-0.5"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {cat.name}
                </h3>
                <p className="text-xs text-white/70">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-heading">Featured Collection</h2>
                <p className="section-subheading">Our most popular picks</p>
              </div>
              <Link href="/sarees" className="text-sm font-medium text-[var(--color-brand)] hover:underline underline-offset-4">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Artisan Crafted",
              desc: "Every piece is handwoven by skilled artisans preserving centuries-old techniques.",
              icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            },
            {
              title: "Authenticity Certified",
              desc: "GI-tagged products with verified origin ensuring genuine handloom quality.",
              icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            },
            {
              title: "Sustainable Fashion",
              desc: "Supporting traditional weaving communities and eco-friendly production methods.",
              icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-8 rounded-xl border border-[var(--color-border)] bg-white">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-warm-gray)] mb-5">
                <svg className="w-6 h-6 text-[var(--color-brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}