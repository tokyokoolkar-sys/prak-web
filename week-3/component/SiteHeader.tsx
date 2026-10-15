import Link from "next/link";

type Tautan = { href: string; label: string };

interface SiteHeaderProps {
  namaProduk: string;
  tautan: Tautan[];
}

export default function SiteHeader({ namaProduk, tautan }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#040406]/85 backdrop-blur-md border-b border-white/10">
      <nav
        aria-label="Navigasi Utama"
        className="mx-auto flex max-w-6xl items-center justify-between p-4"
      >
        {/* Brand logo */}
        <Link
          href="/"
          className="font-mono text-sm sm:text-base font-bold tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span>{namaProduk}</span>
        </Link>

        {/* Center / Navigation Links */}
        <ul className="flex items-center gap-4 sm:gap-8 font-mono text-xs uppercase tracking-wider">
          {tautan.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="text-zinc-400 hover:text-white transition-colors py-1"
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Signature ASCII-Magic CTA Button */}
        <div className="hidden sm:inline-flex items-center h-8 gap-[2px]">
          <span className="w-[3px] h-8 bg-white flex-shrink-0" />
          <Link
            href="/katalog"
            className="h-8 px-3.5 bg-white text-[#040406] font-mono text-xs font-semibold flex items-center hover:bg-zinc-200 transition-colors"
          >
            Katalog
          </Link>
        </div>
      </nav>
    </header>
  );
}