"use client";

import { useState, useMemo, useEffect } from "react";
import { staticMenu } from "@/lib/menu-data";
import type { Category } from "@/lib/menu-data";

const navItems = staticMenu.map((c) => ({ id: c.id, label: c.title }));

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("beverages");
  const [menu, setMenu] = useState<Category[]>(staticMenu);

  // Silently load CMS data if available (sqlite locally, static fallback on Vercel)
  useEffect(() => {
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.categories?.length) {
          const normalized: Category[] = data.categories.map((c: any) => ({
            id: c.id,
            title: c.title,
            subtitle: c.subtitle,
            count: (c.subcategories || []).reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0),
            subcategories: (c.subcategories || []).map((s: any) => ({
              label: s.label || undefined,
              items: (s.items || []).map((it: any) => ({ name: it.name, price: it.price, note: it.note || undefined })),
            })),
          }));
          setMenu(normalized);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return menu;
    const q = query.toLowerCase();
    return menu
      .map((cat) => ({
        ...cat,
        subcategories: cat.subcategories
          .map((sub) => ({
            ...sub,
            items: sub.items.filter((it) => it.name.toLowerCase().includes(q)),
          }))
          .filter((sub) => sub.items.length > 0),
      }))
      .filter((cat) => cat.subcategories.length > 0);
  }, [query, menu]);

  const totalItems = useMemo(() => menu.reduce((acc, c) => acc + c.count, 0), [menu]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Auto-scroll the horizontal nav so the active pill stays visible
  useEffect(() => {
    const navEl = document.querySelector(`[data-nav-id="${activeId}"]`);
    navEl?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  const scrollTo = (id: string) => {
    setActiveId(id);
    // also nudge nav immediately so click feels instant even before observer fires
    document.querySelector(`[data-nav-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* HERO — all green at top, dots, square edges (no bottom rounding) */}
      <section className="relative bg-[var(--green)] flex flex-col items-center justify-center px-6 py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative w-full max-w-[680px] flex flex-col items-center">
          {/* Pill logo */}
          <div className="w-full rounded-[56px] border border-white/90 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-12 flex flex-col items-center justify-center text-center">
            <h1
              className="text-white font-black leading-[0.9] tracking-[-0.02em] text-[2.2rem] sm:text-[3.4rem] lg:text-[4.2rem]"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 900, letterSpacing: "-0.03em" }}
            >
              ΜΠΕΛΦΑΣΤ
            </h1>
            <p className="mt-3 text-white/95 text-[0.72rem] sm:text-[0.9rem] font-medium tracking-[0.6em] pl-[0.6em]">URBAN PUB</p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="text-white/80 text-[11px] tracking-[0.3em] uppercase font-medium">Βασιλέως Κωνσταντίνου 26, Ξάνθη</p>
            <div className="h-px w-12 bg-white/30" />
            <p className="text-white/60 text-xs tracking-wide font-light">Product catalogue — authentic pub menu</p>
          </div>
        </div>
      </section>

      <div className="h-[10px] w-full bg-[var(--cream)]" />

      {/* Sticky catalog bar — elegant, rounded */}
      <div className="sticky top-0 z-30 bg-[var(--cream)]/95 backdrop-blur-md border-b border-black/80 sm:mx-3 sm:rounded-b-2xl sm:border-x sm:shadow-sm">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-3.5 gap-4">
            <div className="flex items-center gap-3">
              <p className="hidden sm:block text-[11px] tracking-[0.18em] font-medium text-black">PRODUCT CATALOG</p>
              <p className="sm:hidden text-[11px] tracking-[0.18em] font-medium">CATALOG</p>
              <span className="hidden sm:inline h-3 w-px bg-black/20" />
              <p className="text-[11px] tracking-wide text-black/60">{totalItems} items • 9 categories</p>
            </div>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.2-4.2m1.8-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search whisky, gin, beer..."
                className="h-8 w-[180px] sm:w-[260px] rounded-full border border-black/15 bg-white pl-8 pr-3 text-[13px] placeholder:text-black/40 focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-hide -mx-1 px-1 scroll-smooth">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-nav-id={item.id}
                onClick={() => scrollTo(item.id)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.08em] transition-all ${
                  activeId === item.id
                    ? "bg-[var(--green)] text-white border-[var(--green)] shadow-sm"
                    : "bg-white text-black/70 border-black/10 hover:border-black/20 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
            {query && (
              <button onClick={() => setQuery("")} className="whitespace-nowrap ml-2 text-xs font-medium text-[var(--green)] hover:underline">
                Clear ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-black/70">No results for “{query}”</p>
            <p className="mt-2 text-sm text-black/50">Try searching “Gin”, “Tullamore” or “IPA”</p>
            <button onClick={() => setQuery("")} className="mt-6 rounded-full bg-[var(--green)] px-6 py-2.5 text-sm font-medium text-white">
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {filtered.map((category, idx) => (
              <section key={category.id} id={category.id} className="scroll-mt-28 rounded-2xl bg-white/80 border border-black/5 p-5 sm:p-7 shadow-sm backdrop-blur-sm">
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-4 mb-6 sm:mb-8">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="hidden sm:inline text-[10px] font-medium tracking-[0.2em] text-black/30">0{idx + 1}</span>
                      <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-normal tracking-[-0.02em] leading-none text-black">{category.title}</h2>
                    </div>
                    {category.subtitle && (
                      <p className="mt-1.5 text-[11px] tracking-[0.14em] uppercase text-black/40 font-medium ml-0 sm:ml-7">{category.subtitle}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-black/[0.04] border border-black/5 px-2.5 py-1 text-[10px] font-medium tracking-wide text-black/50">
                    {category.subcategories.reduce((a, s) => a + s.items.length, 0)} items
                  </span>
                </div>

                <div className="space-y-8">
                  {category.subcategories.map((sub) => (
                    <div key={sub.label ?? "main"}>
                      {sub.label && (
                        <h3 className="mb-4 inline-flex items-center gap-2">
                          <span className="h-px w-6 bg-[var(--green)]/30" />
                          <span className="text-[11px] font-bold tracking-[0.18em] text-[var(--green)]">{sub.label}</span>
                        </h3>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
                        {sub.items.map((item) => (
                          <div key={item.name} className="group flex items-baseline justify-between gap-3 border-b border-black/[0.06] py-3.5 hover:border-black/10 transition-colors">
                            <div className="flex-1 min-w-0 flex items-baseline gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black/80 group-hover:bg-[var(--green)] transition-colors" />
                              <span className="text-[13.5px] sm:text-[14px] leading-snug font-medium text-black tracking-[-0.01em] group-hover:text-[var(--green)] transition-colors">
                                {item.name}
                                {item.note && <span className="ml-2 text-[11px] font-normal text-black/40">— {item.note}</span>}
                              </span>
                            </div>
                            <span className="shrink-0 text-[13.5px] font-semibold tracking-tight text-black tabular-nums">{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-[11px] tracking-[0.16em] font-semibold text-[var(--green)]">VISIT US</p>
                <p className="mt-1.5 font-serif text-xl text-black">Βασιλέως Κωνσταντίνου 26, Ξάνθη</p>
                <p className="mt-1 text-sm text-black/60">Open daily — full menu available at the bar. Prices in €.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                <span className="text-xs font-medium tracking-wide text-black/70">ΜΠΕΛΦΑΣΤ URBAN PUB</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-6 border-t border-black/80 bg-[var(--cream)] sm:rounded-t-2xl sm:mx-3 sm:border-x sm:border-t">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
            <p className="text-[11px] tracking-[0.14em] font-medium text-black">ΜΠΕΛΦΑΣΤ</p>
            <p className="text-[11px] tracking-[0.08em] font-medium text-black/70">ΒΑΣΙΛΕΩΣ ΚΩΝΣΤΑΝΤΙΝΟΥ 26, ΞΑΝΘΗ</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-6 text-[11px] text-black/40">
            <p>Catalogue • {totalItems} items • All prices incl.</p>
            <p>© {new Date().getFullYear()} ΜΠΕΛΦΑΣΤ Urban Pub</p>
          </div>
        </div>
      </footer>
      <div className="h-[12px] w-full bg-[var(--cream-dark)]" />
    </div>
  );
}
