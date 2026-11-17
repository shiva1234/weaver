import Link from "next/link";
import { getProducts, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await getProducts({ page: 1, size: 6, sort: "sellPrice", dir: "desc" });
    return res.content;
  } catch {
    return [];
  }
}

const brandNotes = [
  {
    title: "Made by hand",
    detail: "The craft",
    quote: "Each piece begins with the patience of a master weaver and the steady rhythm of a handloom.",
  },
  {
    title: "Rooted in place",
    detail: "The heritage",
    quote: "Every weave carries a sense of place, shaped by techniques and colors passed through generations.",
  },
  {
    title: "Made to be kept",
    detail: "The intention",
    quote: "Choose pieces with intention, wear them often, and let them become part of your own story.",
  },
];

const collectionHighlights = [
  { title: "Silk, with a story", detail: "The heirloom edit", image: "photo-1617627143750-d86bc21e42bb" },
  { title: "Softly, every day", detail: "Handloom cottons", image: "photo-1539109136881-3be0616acf4b" },
  { title: "A little celebration", detail: "Festive favorites", image: "photo-1515886657613-9f3515b0c78f" },
  { title: "Color in motion", detail: "New season hues", image: "photo-1529139574466-a303027c1d8b" },
  { title: "Made to be kept", detail: "Artisan-crafted", image: "photo-1524504388940-b1c1722653e1" },
  { title: "Tradition, reimagined", detail: "Modern heirlooms", image: "photo-1483985988355-763728e1935b" },
];

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <section
        className="home-hero relative isolate flex min-h-[520px] items-center overflow-hidden bg-[#e8e4df] sm:min-h-[590px] lg:min-h-[650px]"
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="max-w-xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--color-brand)] sm:text-xs">
              The summer collection · 2026
            </p>
            <h1
              className="max-w-lg text-5xl font-medium leading-[1.04] tracking-[-0.045em] text-[#292521] sm:text-6xl lg:text-[76px]"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Wear a little wonder.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[#5c5650] sm:text-base">
              Discover handwoven pieces made slowly, worn for years, and passed down with love.
            </p>
            <Link
              href="/sarees"
              className="mt-8 inline-flex items-center gap-5 bg-[#292521] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[var(--color-brand)]"
            >
              Shop the collection
              <span aria-hidden="true" className="text-base leading-none">↗</span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[9px] font-medium uppercase tracking-[0.22em] text-[#514a44] sm:flex lg:right-12">
          <span className="h-px w-9 bg-[#514a44]/60" />
          Woven by hand in India
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex items-end justify-between gap-5 sm:mb-12">
            <div>
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                Made to be treasured
              </p>
              <h2 className="section-heading text-[26px] sm:text-3xl">The best products</h2>
            </div>
            <Link
              href="/sarees"
              className="mb-1 shrink-0 border-b border-[#a58b6a] pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#514a44] transition-colors hover:text-[var(--color-brand)]"
            >
              View all
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {featured.map((product) => (
                <ProductCard key={product.id} p={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {collectionHighlights.map((item) => (
                <Link
                  key={item.title}
                  href="/sarees"
                  aria-label={`${item.title}, explore sarees`}
                  className="group relative flex aspect-[4/5] items-end overflow-hidden bg-[#e8e4df]"
                  style={{
                    backgroundImage: `linear-gradient(0deg, rgba(27,24,21,.58), transparent 48%), url('https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=80')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                >
                  <div className="p-4 text-white sm:p-6">
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/75">{item.detail}</p>
                    <h3
                      className="mt-1 text-lg sm:text-xl"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {item.title}
                    </h3>
                    <span className="mt-3 inline-block border-b border-white/60 pb-1 text-[9px] font-semibold uppercase tracking-[0.16em] opacity-0 transition-opacity group-hover:opacity-100">
                      Explore
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#f5f3f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-xl text-center sm:mb-12">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Thoughtful from thread to finish
            </p>
            <h2 className="section-heading text-[26px] sm:text-3xl">Beautifully made, with purpose</h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              A little more meaning in every detail.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {brandNotes.map((note) => (
              <article
                key={note.detail}
                className="flex min-h-[220px] flex-col border border-[#e7e2dc] bg-white p-6 sm:p-7"
              >
                <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">{note.detail}</p>
                <h3 className="mb-3 text-lg text-[#292521]" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  {note.title}
                </h3>
                <p className="flex-1 text-[13px] leading-6 text-[#514a44]">{note.quote}</p>
                <div className="mt-6 flex items-center gap-3 border-t border-[#eeeae5] pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1efeb] text-xs font-medium text-[var(--color-brand)]">
                    W
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-[#292521]">Weaver</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[#8b837b]">
                      Our promise
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
