# ΜΠΕΛΦΑΣΤ URBAN PUB — Catalogue

Beautiful catalogue site for **ΜΠΕΛΦΑΣΤ Urban Pub** — Βασιλέως Κωνσταντίνου 26, Ξάνθη.

Recreated faithfully from the original PDF catalogue into a modern, responsive Next.js site.

**Live:** `bun dev` → http://localhost:3000

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- TypeScript
- Bun

## Catalogue

Covers the full PDF — **~144 items** across:

- **Beverages** (19) — Schweppes, Fanta, Coca-Cola, Red Bull, Three Cents, Fever Tree, Bundaberg, Gia Giamas, Arizona …
- **Beers** (14) — Carlsberg, Marmita, Άλφα, Μάμος, Βεργίνα, Guinness, Kaiser, Fischer, Νύμφη, Fix …
- **Craft Beers** (11) — Marmita, Utopia, Sourmena Brew, ΤΑΩΣ, Strange Brew …
- **Whiskeys** (38) — Irish / Scotch / Bourbon / Premium (Tullamore, Jameson, Bushmills, Chivas, Talisker, Lagavulin, Macallan …)
- **Rum** (14) — Havana, Diplomatico, Zacapa …
- **Gin** (16) — Beefeater, Hendrick's, Roku, Monkey 47 …
- **Vodka** (7) — Absolut, Grey Goose, Belvedere …
- **Cognac** (4) — Hennessy, Metaxa …
- **Cocktails** (15) — Negroni, Old Fashioned, Margarita, Mojito, Zombie …

Design tokens match the PDF:

- Cream `#F5EFE0` / paper `#FAF6EB`
- Forest green `#163F1A`
- Serif headings (Playfair Display / Cormorant Garamond) + DM Sans body
- Faithful pill logo in the hero, thin-line catalogue header/footer, dotted menu rows

## Development

```bash
# install
bun install

# dev (Turbopack)
bun dev

# build
bun run build

# start production
bun start

# lint
bun run lint
```

## Project structure

```
src/app/
  layout.tsx   — fonts (Playfair, Cormorant, DM Sans) + metadata
  page.tsx     — full menu data + hero + sticky nav + search + sections
  globals.css  — Tailwind + design tokens
```

## Deploy

Push to `main` — Vercel auto-deploys. Or:

```bash
vercel --prod
```

## Address

> ΜΠΕΛΦΑΣΤ URBAN PUB  
> Βασιλέως Κωνσταντίνου 26, Ξάνθη
