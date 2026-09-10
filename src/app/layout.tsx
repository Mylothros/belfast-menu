import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ΜΠΕΛΦΑΣΤ URBAN PUB — Catalogue • Futuristic",
  description:
    "ΜΠΕΛΦΑΣΤ Urban Pub — Βασιλέως Κωνσταντίνου 26, Ξάνθη. Futuristic catalogue, fully editable via Payload CMS (sqlite locally, graceful Vercel fallback).",
  openGraph: {
    title: "ΜΠΕΛΦΑΣΤ URBAN PUB — Catalogue",
    description:
      "Futuristic catalogue for ΜΠΕΛΦΑΣΤ Urban Pub. Payload CMS powered, sqlite locally, static fallback on Vercel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="el"
      className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable} ${jetbrains.variable} ${space.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--cream)]">
        {children}
      </body>
    </html>
  );
}
