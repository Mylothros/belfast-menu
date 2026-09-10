"use client";

import { useState, useMemo, useEffect } from "react";
import { staticMenu } from "@/lib/menu-data";
import type { Category } from "@/lib/menu-data";

const navItems = staticMenu.map((c) => ({ id: c.id, label: c.title }));

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("beverages");
  const [menu, setMenu] = useState<Category[]>(staticMenu);
  const [source, setSource] = useState<"static" | "payload" | "static-fallback-vercel-no-db">("static");
  const [payloadLive, setPayloadLive] = useState(false);

  // Fetch from Payload callback (works locally via sqlite, falls back on Vercel)
  useEffect(() => {
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.categories?.length) {
          // normalize payload categories to Category type (payload array has no count, recalc)
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
          if (data.source === "payload") {
            setSource("payload");
            setPayloadLive(true);
          } else if (data.source === "static-fallback-vercel-no-db") {
            setSource("static-fallback-vercel-no-db");
            setPayloadLive(false);
          } else {
            setSource("static");
          }
        }
      })
      .catch(() => {
        // stay static
      });
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

  const scrollTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] future-grid">
      {/* System bar */}
      <div className="w-full border-b border-[var(--green)]/10 bg-[var(--cream)]/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2 text-[10px] tracking-[0.16em] font-mono">
          <span className="flex items-center gap-2 text-[var(--green)]/70">
            <span className={`h-1.5 w-1.5 rounded-full ${payloadLive ? "bg-[var(--lime)] shadow-[0_0_8px_#d9ff66]" : "bg-amber-400"}`} />
            {payloadLive ? "CMS LIVE // PAYLOAD" : "STATIC MODE"}
            <span className="hidden sm:inline opacity-40">—</span>
            <span className="hidden sm:inline opacity-60">XANTHI • 26 VAS. KONSTANTINOU</span>
          </span>
          <span className="flex items-center gap-2">
            <a href="/admin" className="rounded-full border border-[var(--green)]/15 bg-white px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] hover:bg-[var(--green)] hover:text-white transition-colors">
              MANAGE → /admin
            </a>
            <a href="/api/catalog" className="hidden sm:inline opacity-50 hover:opacity-100 transition-opacity">
              /api/catalog
            </a>
          </span>
        </div>
      </div>

      <div className="h-[10px] w-full bg-[var(--cream)]" />

      {/* HERO — futuristic green */}
      <section className="relative overflow-hidden bg-[var(--green)]">
        {/* grid + glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-[380px] w-[380px] rounded-full bg-[var(--lime)] opacity-10 blur-[80px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 h-[520px] w-[520px] rounded-full bg-white opacity-[0.06] blur-[60px]" />
        {/* scanline */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, white 2px, white 3px)" }} />

        <div className="relative mx-auto max-w-[1160px] px-6 py-10 sm:py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left: pill */}
            <div className="flex-1 flex flex-col items-center lg:items-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md text-[10px] tracking-[0.18em] font-mono text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)] animate-pulse shadow-[0_0_10px_#d9ff66]" />
                FUTURE CATALOG • 2026 • PAYLOAD CMS
              </div>

              <div className="mt-6 w-full max-w-[640px] rounded-[44px] border border-white/80 bg-white/[0.02] p-[1px] shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm">
                <div className="rounded-[42px] border border-white/25 bg-[var(--green)] px-8 py-10 sm:px-10 sm:py-11 flex flex-col items-center text-center relative overflow-hidden">
                  {/* shimmer */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" style={{ transform: "translateX(-100%)", animation: "shimmer 3.5s infinite" }} />
                  <h1
                    className="text-white font-black leading-[0.9] tracking-[-0.02em] text-[2.4rem] sm:text-[3.6rem] lg:text-[4.1rem] text-glow"
                    style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 900 }}
                  >
                    ΜΠΕΛΦΑΣΤ
                  </h1>
                  <p className="mt-3 text-white/95 text-[0.74rem] sm:text-[0.9rem] font-mono tracking-[0.62em] pl-[0.62em] opacity-90">URBAN PUB</p>
                  <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <p className="mt-4 text-white/60 text-[11px] tracking-[0.2em] font-mono">ΒΑΣΙΛΕΩΣ ΚΩΝΣΤΑΝΤΙΝΟΥ 26, ΞΑΝΘΗ</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="rounded-full bg-white text-[var(--green)] px-3 py-1.5 font-bold tracking-wide">144 ITEMS</span>
                <span className="rounded-full border border-white/25 text-white/80 px-3 py-1.5 backdrop-blur">9 CATEGORIES</span>
                <span className={`rounded-full px-3 py-1.5 border ${payloadLive ? "border-[var(--lime)] bg-[var(--lime)] text-[var(--green)] font-bold" : "border-white/20 text-white/70"}`}>
                  {source === "payload" ? "● LIVE FROM PAYLOAD" : source === "static-fallback-vercel-no-db" ? "◐ VERCEL STATIC FALLBACK" : "○ STATIC"}
                </span>
              </div>
            </div>

            {/* Right: terminal card */}
            <div className="lg:w-[360px] shrink-0">
              <div className="rounded-2xl border border-white/15 bg-black/20 backdrop-blur-md p-4 font-mono text-[11px] leading-relaxed text-white/80 shadow-xl">
                <div className="flex items-center justify-between text-[10px] tracking-[0.16em] opacity-60">
                  <span>CATALOG // 00</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-[var(--lime)]" /><span className="h-2 w-2 rounded-full bg-white" /></span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <p><span className="opacity-40">$</span> catalog --source {payloadLive ? "payload:sqlite" : "static.json"}</p>
                  <p className="text-white/50">› {totalItems} records • {menu.length} groups • price in €</p>
                  <p className="text-[var(--lime)]">› try: /admin to edit live</p>
                  <p className="opacity-60">› Vercel callback: /api/catalog</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { k: "BEER", v: "25" },
                    { k: "WHISKY", v: "38" },
                    { k: "GIN", v: "16" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-xl bg-white/10 border border-white/10 py-2">
                      <p className="text-white font-bold text-sm">{s.v}</p>
                      <p className="text-[9px] tracking-[0.14em] opacity-60">{s.k}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <a href="#beverages" onClick={(e) => { e.preventDefault(); scrollTo("beverages") }} className="flex-1 rounded-full bg-[var(--lime)] text-[var(--green)] text-center py-2 font-bold tracking-[0.1em] hover:bg-white transition-colors">
                    EXPLORE →
                  </a>
                  <a href="/admin" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white hover:text-[var(--green)] transition-colors">
                    CMS
                  </a>
                </div>
              </div>
              <p className="mt-3 text-center text-[10px] tracking-[0.14em] font-mono text-white/50">sqlite locally • ephemeral on Vercel • graceful fallback</p>
            </div>
          </div>
        </div>

        {/* bottom edge */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      <div className="h-[14px] w-full bg-[var(--cream)] border-b border-black/80" />

      {/* Sticky catalog bar — glass + lime active */}
      <div className="sticky top-0 z-30 border-b border-black/80 bg-[var(--cream)]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <p className="hidden sm:block text-[11px] tracking-[0.18em] font-mono font-bold text-black">PRODUCT CATALOG</p>
              <p className="sm:hidden text-[11px] tracking-[0.18em] font-mono font-bold">CATALOG</p>
              <span className="hidden sm:inline h-3 w-px bg-black/15" />
              <span className="text-[11px] font-mono tracking-wide text-black/60">
                {totalItems} • {menu.length} CAT
                {payloadLive && <span className="ml-2 hidden sm:inline text-[var(--green)] font-bold">● LIVE</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-black/30">⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH: whisky, gin, IPA..."
                  className="h-8 w-[170px] sm:w-[280px] rounded-full border border-black/15 bg-white pl-7 pr-3 text-[12px] font-mono placeholder:text-black/35 focus:outline-none focus:border-[var(--green)] focus:ring-2 focus:ring-[var(--lime)]/40"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-mono font-bold tracking-[0.08em] transition-all ${
                  activeId === item.id
                    ? "bg-[var(--green)] text-white border-[var(--green)] shadow-[0_0_12px_rgba(217,255,102,0.25)]"
                    : "bg-white text-black/70 border-black/10 hover:border-[var(--green)]/20 hover:text-black"
                }`}
              >
                {item.label}
              </button>
            ))}
            {query && (
              <button onClick={() => setQuery("")} className="whitespace-nowrap ml-2 text-xs font-mono font-bold text-[var(--green)] hover:underline">
                CLEAR ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {filtered.length === 0 ? (
          <div className="py-24 text-center glass rounded-2xl border border-black/10">
            <p className="font-serif text-2xl text-black/70">No results for “{query}”</p>
            <p className="mt-2 text-sm font-mono text-black/50">Try “Gin”, “Tullamore” or “IPA”</p>
            <button onClick={() => setQuery("")} className="mt-6 rounded-full bg-[var(--green)] px-6 py-2.5 text-sm font-mono font-bold text-white hover:bg-black transition-colors">
              CLEAR SEARCH
            </button>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {filtered.map((category, idx) => (
              <section key={category.id} id={category.id} className="scroll-mt-28">
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-4 mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="hidden sm:inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--green)] text-[10px] font-mono font-bold text-white">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-space text-[26px] sm:text-[33px] lg:text-[38px] font-bold tracking-[-0.03em] leading-none text-black">
                        {category.title}
                      </h2>
                      {category.subtitle && (
                        <p className="mt-1 text-[11px] tracking-[0.14em] font-mono uppercase text-black/40">{category.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white border border-black/10 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wide text-black/50 shadow-sm">
                    {category.subcategories.reduce((a, s) => a + s.items.length, 0)} ITEMS
                  </span>
                </div>

                <div className="space-y-8">
                  {category.subcategories.map((sub) => (
                    <div key={sub.label ?? "main"}>
                      {sub.label && (
                        <h3 className="mb-4 inline-flex items-center gap-2">
                          <span className="h-px w-8 bg-[var(--green)]/30" />
                          <span className="rounded-full bg-[var(--lime)] px-2.5 py-1 text-[10px] font-mono font-black tracking-[0.16em] text-[var(--green)]">{sub.label}</span>
                          <span className="h-px flex-1 w-12 bg-gradient-to-r from-[var(--lime)]/40 to-transparent hidden sm:block" />
                        </h3>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {sub.items.map((item) => (
                          <div
                            key={item.name}
                            className="group relative flex items-center justify-between gap-3 rounded-xl border border-black/5 bg-white px-3.5 py-3.5 hover:border-[var(--green)]/15 hover:shadow-[0_8px_24px_rgba(22,63,26,0.08)] hover:bg-white transition-all"
                          >
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(217,255,102,0.06), transparent 60%)" }} />
                            <div className="relative flex-1 min-w-0 flex items-center gap-2.5">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black/60 group-hover:bg-[var(--lime)] group-hover:shadow-[0_0_6px_#d9ff66] transition-all" />
                              <span className="text-[13.5px] font-medium leading-snug tracking-[-0.01em] text-black group-hover:text-[var(--green)] transition-colors">
                                {item.name}
                                {item.note && <span className="ml-2 text-[11px] font-mono font-normal text-black/40">— {item.note}</span>}
                              </span>
                            </div>
                            <span className="relative shrink-0 rounded-full bg-[var(--cream-dark)] group-hover:bg-[var(--lime)] border border-black/5 group-hover:border-[var(--lime)] px-2.5 py-1 text-[12px] font-mono font-black tracking-tight text-black transition-colors">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border border-[var(--green)]/10 bg-white p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-[11px] tracking-[0.16em] font-mono font-black text-[var(--green)]">VISIT US • PAYLOAD MANAGED</p>
                <p className="mt-1 font-serif text-xl text-black">Βασιλέως Κωνσταντίνου 26, Ξάνθη</p>
                <p className="mt-1 text-sm font-mono text-black/55">Edit everything at <a href="/admin" className="underline decoration-[var(--lime)] decoration-2 underline-offset-4 hover:text-[var(--green)]">/admin</a> (sqlite) • Vercel → <a href="/api/catalog" className="underline decoration-black/20 underline-offset-4">/api/catalog</a> fallback in prod.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[var(--cream)] px-4 py-2">
                <span className={`h-2 w-2 rounded-full ${payloadLive ? "bg-[var(--lime)] animate-pulse shadow-[0_0_8px_#d9ff66]" : "bg-amber-500"} `} />
                <span className="text-xs font-mono font-bold tracking-wide text-black/70">{payloadLive ? "CMS LIVE" : "STATIC FALLBACK"}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-6 border-t border-black/80 bg-[var(--cream)]">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
            <p className="text-[11px] tracking-[0.14em] font-mono font-bold text-black">ΜΠΕΛΦΑΣΤ // FUTURE PUB</p>
            <p className="text-[11px] tracking-[0.08em] font-mono font-medium text-black/60">ΒΑΣΙΛΕΩΣ ΚΩΝΣΤΑΝΤΙΝΟΥ 26, ΞΑΝΘΗ</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-6 text-[11px] font-mono text-black/40">
            <p>
              Futuristic • Payload CMS (sqlite) • Vercel callback at <a href="/api/catalog" className="underline">/api/catalog</a>
            </p>
            <p>© {new Date().getFullYear()} ΜΠΕΛΦΑΣΤ Urban Pub</p>
          </div>
        </div>
      </footer>
      <div className="h-[10px] w-full bg-[var(--green)]" />
    </div>
  );
}
