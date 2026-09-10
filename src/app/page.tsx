"use client";

import { useState, useMemo, useEffect } from "react";

type Item = { name: string; price: string; note?: string };
type SubCategory = { label?: string; items: Item[] };
type Category = {
  id: string;
  title: string;
  subtitle?: string;
  count: number;
  subcategories: SubCategory[];
};

const menu: Category[] = [
  {
    id: "beverages",
    title: "BEVERAGES",
    subtitle: "Αναψυκτικά & Σόδες",
    count: 19,
    subcategories: [
      {
        items: [
          { name: "ΣΟΔΑ SCHWEPPES 250ml", price: "3€" },
          { name: "FANTA ΠΟΡΤΟΚΑΛΙ 250ml", price: "3€" },
          { name: "FANTA ΛΕΜΟΝΑΔΑ 250ml", price: "3€" },
          { name: "SPRITE 250ml", price: "3€" },
          { name: "COCA COLA 250ml", price: "3€" },
          { name: "COCA COLA ZERO 250ml", price: "3€" },
          { name: "ΞΙΝΟ ΝΕΡΟ ΦΛΩΡΙΝΑΣ 250ml", price: "4€" },
          { name: "RED BULL ENERGY DRINK 200ml", price: "4€" },
          { name: "THREE CENTS PINK SODA 200ml", price: "4€" },
          { name: "THREE CENTS AEGEAN TONIC 200ml", price: "4€" },
          { name: "FEVER TREE PREMIUM GINGER BEER 200ml", price: "4€" },
          { name: "BUNDABERG GINGER BEER 375ml", price: "6€" },
          { name: "ΣΠΙΤΙΚΗ ΛΕΜΟΝΑΔΑ", price: "3,5€" },
          { name: "ΚΕΡΑΣΑΔΑ GIA_GIAMAS", price: "3,5€" },
          { name: "ΡΟΖ ΛΕΜΟΝΑΔΑ GIA-GIAMAS SUGARFREE", price: "4€" },
          { name: "ΛΕΜΟΝΑΔΑ GIA_GIAMAS SUGARFREE", price: "4€" },
          { name: "ARIZONA ΛΕΜΟΝΙ 330ml", price: "3€" },
          { name: "ARIZONA ΡΟΔΑΚΙΝΟ 330ml", price: "3€" },
          { name: "ARIZONA ΡΟΔΙ 330ml", price: "3€" },
        ],
      },
    ],
  },
  {
    id: "beers",
    title: "BEERS",
    subtitle: "Μπύρες",
    count: 14,
    subcategories: [
      {
        items: [
          { name: "Carlsberg Draught 500ml", price: "4,5€" },
          { name: "Carlsberg Draught 330ml", price: "3,5€" },
          { name: "Marmita RED Draught 330ml", price: "4€" },
          { name: "Άλφα 330ml", price: "3,5€" },
          { name: "Μάμος 330ml", price: "3,5€" },
          { name: "Βεργίνα Lager 330ml", price: "3,5€" },
          { name: "Βεργίνα Weiss 500ml", price: "4,5€" },
          { name: "Guinness 330ml", price: "6,5€" },
          { name: "Kaiser 330ml", price: "4€" },
          { name: "Fischer 330ml", price: "4€" },
          { name: "Νύμφη 330ml", price: "3,5€" },
          { name: "Fix Άνευ 500ml", price: "4€" },
          { name: "Amstel Radler 330ml", price: "4€" },
          { name: "Stella Artois 330ml", price: "4,5€" },
        ],
      },
    ],
  },
  {
    id: "craft",
    title: "CRAFT BEERS",
    subtitle: "Χειροποίητες",
    count: 11,
    subcategories: [
      {
        items: [
          { name: "Marmita Red 330ml", price: "6€" },
          { name: "Marmita American Pale Ale 330ml", price: "6€" },
          { name: "Marmita Stout 330ml", price: "6€" },
          { name: "Marmita POW WOW IPA 330ml", price: "6,5€" },
          { name: "Utopia Babylon IPA 330ml", price: "6,5€" },
          { name: "Utopia Eden IPL 330ml", price: "6,5€" },
          { name: "ΚΥΡΙΑ ΤΟΥΛΑ NIPA (Sourmena Brew) 330ml", price: "6,5€" },
          { name: "ΜΠΕΛΑ Pilsner (Sourmena Brew X 608) 330ml", price: "5,5€" },
          { name: "ΤΑΩΣ Brewing Sauvignon IPA 330ml", price: "6,5€" },
          { name: "ΤΑΩΣ Lager 330ml", price: "6€" },
          { name: "JASMINE IPA (Strange Brew) 330ml", price: "6€" },
        ],
      },
    ],
  },
  {
    id: "whiskeys",
    title: "WHISKEYS",
    subtitle: "Ουίσκι",
    count: 38,
    subcategories: [
      {
        label: "IRISH",
        items: [
          { name: "Tullamore Dew", price: "6€" },
          { name: "Tullamore XO", price: "8€" },
          { name: "Jameson", price: "6€" },
          { name: "Jameson Black Barrel", price: "8€" },
          { name: "Jameson Caskmates", price: "7€" },
          { name: "Bushmills", price: "7€" },
          { name: "Bushmills Black Bush", price: "8€" },
          { name: "Bushmills 10years", price: "9€" },
          { name: "Roe & Co", price: "8€" },
          { name: "Teeling", price: "8€" },
          { name: "Redbreast 12yr", price: "17€" },
        ],
      },
      {
        label: "SCOTCH",
        items: [
          { name: "Ballantine's", price: "6€" },
          { name: "Cutty Sark", price: "6€" },
          { name: "Chivas", price: "8€" },
          { name: "Johnnie Black", price: "8€" },
          { name: "Canadian Club", price: "7€" },
          { name: "Haig", price: "6€" },
          { name: "Grants 12yr", price: "8€" },
        ],
      },
      {
        label: "BOURBON",
        items: [
          { name: "Evan Williams", price: "8€" },
          { name: "Jack Daniel's", price: "8€" },
          { name: "Four Roses", price: "8€" },
        ],
      },
      {
        label: "PREMIUM",
        items: [
          { name: "Cardhu", price: "9€" },
          { name: "Talisker 10yr", price: "10€" },
          { name: "Glenfiddich 12yr", price: "10€" },
          { name: "Dalwhinnie", price: "13€" },
          { name: "Nikka From The Barrel", price: "14€" },
          { name: "Arran 10yr", price: "13€" },
          { name: "Aberlour 12yr", price: "14€" },
          { name: "Lagavulin 8yr", price: "12€" },
          { name: "Lagavulin 16yr", price: "19€" },
          { name: "Kilchoman", price: "17€" },
          { name: "Highland Park 12yr", price: "13€" },
          { name: "The Glenallachie 12yr", price: "15€" },
          { name: "Bunnahabhain 12yr", price: "16€" },
          { name: "Dalmore 12yr", price: "17€" },
          { name: "Ardbeg 10yr", price: "16€" },
          { name: "Glenfiddich 12yr", price: "16€", note: "Reserve" },
          { name: "Macallan Double Cask 12yr", price: "20€" },
        ],
      },
    ],
  },
  {
    id: "rum",
    title: "RUM",
    subtitle: "Ρούμι",
    count: 14,
    subcategories: [
      {
        items: [
          { name: "Havana", price: "6€" },
          { name: "Appleton", price: "7€" },
          { name: "Plantation Dark", price: "7€" },
          { name: "Chairman's Spiced", price: "8€" },
          { name: "Chairman's", price: "8€" },
          { name: "Sailor Jerry", price: "7€" },
          { name: "Kingston", price: "7€" },
          { name: "Bayou Spiced", price: "8€" },
          { name: "Bumbu", price: "9€" },
          { name: "Diplomatico", price: "10€" },
          { name: "Flor De Cana 12yr", price: "10€" },
          { name: "Barcelo", price: "8€" },
          { name: "Zacapa", price: "13€" },
          { name: "Tamboo", price: "8€" },
        ],
      },
    ],
  },
  {
    id: "gin",
    title: "GIN",
    subtitle: "Τζιν",
    count: 16,
    subcategories: [
      {
        items: [
          { name: "Greenall's", price: "6€" },
          { name: "Beefeater", price: "6€" },
          { name: "Bombay", price: "7€" },
          { name: "Tanqueray", price: "7€" },
          { name: "Oyster", price: "9€" },
          { name: "Grace", price: "9€" },
          { name: "Hendrick's", price: "9€" },
          { name: "Roku", price: "10€" },
          { name: "Canaima", price: "9€" },
          { name: "Mombasa", price: "9€" },
          { name: "Old Sport", price: "8€" },
          { name: "Votanikon", price: "8€" },
          { name: "Amazoni Brazilian Gin", price: "10€" },
          { name: "Monkey 47", price: "13€" },
          { name: "The Botanist", price: "9€" },
          { name: "Engine", price: "9€" },
        ],
      },
    ],
  },
  {
    id: "vodka",
    title: "VODKA",
    subtitle: "Βότκα",
    count: 7,
    subcategories: [
      {
        items: [
          { name: "Absolut", price: "6€" },
          { name: "Stolichnaya", price: "6€" },
          { name: "Moskovskaya", price: "6€" },
          { name: "Grey Goose", price: "10€" },
          { name: "Belvedere", price: "10€" },
          { name: "Crystal Head", price: "11€" },
          { name: "Ketel One", price: "8€" },
        ],
      },
    ],
  },
  {
    id: "cognac",
    title: "COGNAC",
    subtitle: "Κονιάκ",
    count: 4,
    subcategories: [
      {
        items: [
          { name: "Hennessy", price: "11€" },
          { name: "Metaxa 5*", price: "6€" },
          { name: "Metaxa 7*", price: "8€" },
          { name: "Metaxa 12*", price: "9€" },
        ],
      },
    ],
  },
  {
    id: "cocktails",
    title: "COCKTAILS",
    subtitle: "Κοκτέιλ",
    count: 15,
    subcategories: [
      {
        items: [
          { name: "Negroni", price: "8€" },
          { name: "Old Fashioned", price: "9€" },
          { name: "Rum Old Fashioned", price: "9€" },
          { name: "Margarita", price: "8€" },
          { name: "Paloma", price: "8€" },
          { name: "Cuba Libre", price: "6€" },
          { name: "Pornstar Martini", price: "8€" },
          { name: "Daiquiri (f)", price: "8€" },
          { name: "Mojito (f)", price: "8€" },
          { name: "Mai Tai", price: "9€" },
          { name: "Zombie", price: "10€" },
          { name: "Bramble", price: "8€" },
          { name: "Caipiroska (f)", price: "8€" },
          { name: "Caipirinha", price: "8€" },
          { name: "Aperol Spritz", price: "7€" },
        ],
      },
    ],
  },
];

const navItems = menu.map((c) => ({ id: c.id, label: c.title }));

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("beverages");

  const filtered = useMemo(() => {
    if (!query.trim()) return menu;
    const q = query.toLowerCase();
    return menu
      .map((cat) => ({
        ...cat,
        subcategories: cat.subcategories
          .map((sub) => ({
            ...sub,
            items: sub.items.filter((it) =>
              it.name.toLowerCase().includes(q)
            ),
          }))
          .filter((sub) => sub.items.length > 0),
      }))
      .filter((cat) => cat.subcategories.length > 0);
  }, [query]);

  const totalItems = useMemo(
    () => menu.reduce((acc, c) => acc + c.count, 0),
    []
  );

  // scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Top cream bar like PDF */}
      <div className="h-[18px] w-full bg-[var(--cream)]" />

      {/* HERO — exact replica of PDF cover */}
      <section className="relative bg-[var(--green)] flex flex-col items-center justify-center px-6 py-16 sm:py-20 lg:py-24">
        {/* subtle texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative w-full max-w-[720px] flex flex-col items-center">
          {/* Pill */}
          <div className="w-full rounded-[56px] border border-white/90 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 flex flex-col items-center justify-center text-center">
            {/* Main title - blocky geometric, tracking tight */}
            <h1
              className="text-white font-black leading-[0.9] tracking-[-0.02em] text-[2.2rem] sm:text-[3.4rem] lg:text-[4.2rem] xl:text-[4.6rem]"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                fontStretch: "condensed",
              }}
            >
              ΜΠΕΛΦΑΣΤ
            </h1>
            <p className="mt-3 text-white/95 text-[0.72rem] sm:text-[0.95rem] font-medium tracking-[0.55em] sm:tracking-[0.65em] pl-[0.55em]">
              URBAN PUB
            </p>
          </div>

          {/* Underpill info */}
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <p className="text-white/80 text-[11px] tracking-[0.3em] uppercase font-medium">
              Βασιλέως Κωνσταντίνου 26, Ξάνθη
            </p>
            <div className="h-px w-12 bg-white/30" />
            <p className="text-white/60 text-xs tracking-wide font-light max-w-md">
              Product catalogue — Est. Urban Pub
            </p>
          </div>
        </div>

        {/* bottom fade? */}
      </section>

      <div className="h-[18px] w-full bg-[var(--cream)] border-b border-black/80" />

      {/* Catalog header bar */}
      <div className="sticky top-0 z-30 bg-[var(--cream)]/95 backdrop-blur-md border-b border-black/80">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3 sm:py-3.5 gap-4">
            <div className="flex items-center gap-3">
              <p className="hidden sm:block text-[11px] tracking-[0.18em] font-medium text-black">
                PRODUCT CATALOG
              </p>
              <p className="sm:hidden text-[11px] tracking-[0.18em] font-medium">
                CATALOG
              </p>
              <span className="hidden sm:inline h-3 w-px bg-black/20" />
              <p className="text-[11px] tracking-wide text-black/60">
                {totalItems} items • 9 categories
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.2-4.2m1.8-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                  />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search whisky, gin, beer..."
                  className="h-8 w-[180px] sm:w-[260px] rounded-full border border-black/15 bg-white pl-8 pr-3 text-[13px] placeholder:text-black/40 focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)]"
                />
              </div>
            </div>
          </div>

          {/* Navigation pills — horizontal scroll */}
          <div className="flex items-center gap-1.5 pb-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {navItems.map((item) => (
              <button
                key={item.id}
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
              <button
                onClick={() => setQuery("")}
                className="whitespace-nowrap ml-2 text-xs font-medium text-[var(--green)] hover:underline"
              >
                Clear ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-2xl text-black/70">No results for “{query}”</p>
            <p className="mt-2 text-sm text-black/50">Try searching “Gin”, “Tullamore” or “IPA”</p>
            <button
              onClick={() => setQuery("")}
              className="mt-6 rounded-full bg-[var(--green)] px-6 py-2.5 text-sm font-medium text-white"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {filtered.map((category, idx) => (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-28"
              >
                {/* Section header — PDF style but refined */}
                <div className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-4 mb-6 sm:mb-8">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="hidden sm:inline text-[10px] font-medium tracking-[0.2em] text-black/30">
                        0{idx + 1}
                      </span>
                      <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-normal tracking-[-0.02em] leading-none text-black">
                        {category.title}
                      </h2>
                    </div>
                    {category.subtitle && (
                      <p className="mt-1.5 text-[11px] tracking-[0.14em] uppercase text-black/40 font-medium ml-0 sm:ml-7">
                        {category.subtitle}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-black/[0.04] border border-black/5 px-2.5 py-1 text-[10px] font-medium tracking-wide text-black/50">
                    {category.subcategories.reduce((a, s) => a + s.items.length, 0)} items
                  </span>
                </div>

                {/* Subcategories */}
                <div className="space-y-8">
                  {category.subcategories.map((sub) => (
                    <div key={sub.label ?? "main"}>
                      {sub.label && (
                        <h3 className="mb-4 inline-flex items-center gap-2">
                          <span className="h-px w-6 bg-[var(--green)]/30" />
                          <span className="text-[11px] font-bold tracking-[0.18em] text-[var(--green)]">
                            {sub.label}
                          </span>
                        </h3>
                      )}

                      {/* Items grid — elegant menu list */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-0">
                        {sub.items.map((item) => (
                          <div
                            key={item.name}
                            className="group flex items-baseline justify-between gap-3 border-b border-black/[0.06] py-3.5 hover:border-black/10 transition-colors"
                          >
                            <div className="flex-1 min-w-0 flex items-baseline gap-2">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black/80 group-hover:bg-[var(--green)] transition-colors" />
                              <span className="text-[13.5px] sm:text-[14px] leading-snug font-medium text-black tracking-[-0.01em] group-hover:text-[var(--green)] transition-colors">
                                {item.name}
                                {item.note && (
                                  <span className="ml-2 text-[11px] font-normal text-black/40">
                                    — {item.note}
                                  </span>
                                )}
                              </span>
                            </div>
                            <span className="shrink-0 text-[13.5px] font-semibold tracking-tight text-black tabular-nums">
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

            {/* Info card after cocktails */}
            <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.16em] font-semibold text-[var(--green)]">VISIT US</p>
                <p className="mt-1.5 font-serif text-xl text-black">Βασιλέως Κωνσταντίνου 26, Ξάνθη</p>
                <p className="mt-1 text-sm text-black/60">Open daily — full catalogue available at the bar. Prices in €.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                <span className="text-xs font-medium tracking-wide text-black/70">ΜΠΕΛΦΑΣΤ URBAN PUB</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer — PDF footer replica but refined */}
      <footer className="mt-6 border-t border-black/80 bg-[var(--cream)]">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
            <p className="text-[11px] tracking-[0.14em] font-medium text-black">
              ΜΠΕΛΦΑΣΤ
            </p>
            <p className="text-[11px] tracking-[0.08em] font-medium text-black/70">
              ΒΑΣΙΛΕΩΣ ΚΩΝΣΤΑΝΤΙΝΟΥ 26, ΞΑΝΘΗ
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-6 text-[11px] text-black/40">
            <p>Catalogue reproduced faithfully from the original PDF • All prices incl.</p>
            <p className="flex items-center gap-1.5">
              <span className="h-px w-6 bg-black/20 hidden sm:inline" />
              © {new Date().getFullYear()} ΜΠΕΛΦΑΣΤ Urban Pub
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom cream bar */}
      <div className="h-[12px] w-full bg-[var(--cream-dark)]" />
    </div>
  );
}
