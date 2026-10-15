import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "component/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASCII // Smart Campus Telemetry",
  description: "Platform pemantauan telemetri fasilitas dan mikroklimat kampus berbasis matriks ASCII",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#040406] text-white selection:bg-[#353535] selection:text-white">
        <SiteHeader namaProduk="ASCII // SMART CAMPUS" tautan={tautan} />
        <div className="flex-1 relative">
          {/* Subtle side rails (ASCII-magic inspired) */}
          <div
            className="pointer-events-none absolute inset-0 max-w-6xl mx-auto border-x border-white/[0.06] z-10"
            aria-hidden="true"
          />
          {children}
        </div>
      </body>
    </html>
  );
}

const tautan = [
  { href: "/", label: "Beranda" },
  { href: "/#about", label: "Fitur" },
  { href: "/#contact", label: "Terminal" },
  { href: "/katalog", label: "Katalog" },
  { href: "/tentang", label: "Tentang" },
];
