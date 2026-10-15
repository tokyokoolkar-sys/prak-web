import Link from "next/link";

export default function KatalogDetailNotFound() {
  return (
    <main
      id="konten"
      className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center space-y-4"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">
        [ERR 404] NODE TIDAK DITEMUKAN
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white">
        ID node tidak terdaftar di inventaris
      </h1>
      <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
        Nilai params yang sah adalah &quot;1&quot; sampai &quot;5&quot;. Periksa
        kembali URL atau kembali ke daftar katalog.
      </p>
      <Link
        href="/katalog"
        className="inline-block mt-2 px-4 py-2 border border-white/20 font-mono text-xs text-white hover:bg-white/10 transition-colors"
      >
        Kembali ke Katalog
      </Link>
    </main>
  );
}
