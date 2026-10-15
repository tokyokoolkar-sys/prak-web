import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <main
      id="konten"
      className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center space-y-4"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
        [ERR 404] HALAMAN TIDAK DITEMUKAN
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white">
        Rute tidak terdaftar
      </h1>
      <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
        Rute yang diminta tidak ada pada peta rute produk. Kembali ke beranda
        atau buka katalog.
      </p>
      <div className="flex items-center justify-center gap-3 font-mono text-xs">
        <Link
          href="/"
          className="px-4 py-2 bg-white text-[#040406] font-semibold hover:bg-zinc-200 transition-colors"
        >
          Beranda
        </Link>
        <Link
          href="/katalog"
          className="px-4 py-2 border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          Katalog
        </Link>
      </div>
    </main>
  );
}
