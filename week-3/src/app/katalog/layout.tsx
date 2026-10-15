import Link from "next/link";

export default function KatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-0">
      <nav
        aria-label="Navigasi katalog"
        className="px-4 sm:px-6 pt-6 font-mono text-xs uppercase tracking-wider text-zinc-500"
      >
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/katalog" className="hover:text-white transition-colors">
              Katalog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/tentang"
              className="hover:text-white transition-colors"
            >
              Tentang
            </Link>
          </li>
        </ol>
      </nav>
      {children}
    </div>
  );
}
