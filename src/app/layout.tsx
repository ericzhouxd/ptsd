/**
 * Root layout — wraps every page in the app.
 *
 * Concepts demonstrated:
 *   • Next.js App Router: `app/layout.tsx` is the root HTML shell. Every page
 *     in `app/` renders inside this layout's `{children}`.
 *   • next/font/google: Inter is downloaded at BUILD time and self-hosted,
 *     exposed via a CSS variable (--font-inter). No runtime fetch from Google.
 *   • KaTeX CSS import: KaTeX renders math but its STYLES live in a CSS file
 *     that must be loaded once globally. Without this, math renders unstyled.
 *
 * Font split:
 *   • Inter (--font-inter, exposed as `font-sans`) — UI chrome, controls,
 *     buttons, navigation, descriptions.
 *   • KaTeX_Main (Computer Modern, exposed as `font-latex`) — the site title,
 *     theorem titles, theorem statements, proofs. Same family as the math, so
 *     prose and equations share a typographic voice.
 *
 * See LEARNING.md §"Next.js App Router".
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proven Theorems Simply Demonstrated",
  description:
    "Geometric, interactive demonstrations of mathematical theorems.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full bg-bg text-fg font-sans">{children}</body>
    </html>
  );
}
