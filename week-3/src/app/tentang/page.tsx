import type { Metadata } from "next";
import Link from "next/link";
import Bagian from "component/Bagian";

export const metadata: Metadata = {
  title: "Tentang | Smart Campus Telemetry",
  description:
    "Profil platform ASCII Smart Campus Telemetry: tujuan, arsitektur tiga pilar, dan cakupan data sensor kampus.",
};

const pilar = [
  {
    kode: "01 / ENVIRONMENT",
    judul: "Mikroklimat",
    isi: "Agregasi suhu dan kelembapan multi-zona (contoh: 28.4°C / 64% RH di GKU Lt. 3) untuk kenyamanan belajar.",
  },
  {
    kode: "02 / ENERGY",
    judul: "Energi",
    isi: "Pemantauan beban AC inverter dan smart-meter 3-fasa untuk memangkas konsumsi saat ruang kosong.",
  },
  {
    kode: "03 / CAMPUS",
    judul: "Fasilitas",
    isi: "Inventaris kipas, lampu, dan exhaust fan per ruang untuk pemeliharaan proaktif.",
  },
];

export default function HalamanTentang() {
  return (
    <main id="konten" className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
      <div className="border-b border-white/10 pb-8 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <span>&larr;</span>
          <span>Kembali ke Beranda</span>
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          /PROFIL PRODUK
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Tentang Smart Campus Telemetry
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
          Platform telemetri kampus berbasis browser yang mengubah data mentah
          sensor menjadi matriks ASCII yang mudah dibaca teknisi dan pengelola
          gedung.
        </p>
      </div>

      <Bagian
        id="tujuan"
        eyebrow="/TUJUAN"
        judul="Mengapa matriks ASCII?"
        deskripsi="Ruang server kampus sering diakses lewat terminal ber-bandwidth rendah. Representasi teks lebih ringan daripada WebGL penuh, tetap presisi, dan dapat disalin ke log insiden."
      >
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pilar.map((p) => (
            <li
              key={p.kode}
              className="bg-[#07070a] border border-white/10 p-5 space-y-2"
            >
              <p className="font-mono text-xs text-white/50">{p.kode}</p>
              <h3 className="text-lg font-semibold text-white">{p.judul}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {p.isi}
              </p>
            </li>
          ))}
        </ul>
      </Bagian>

      <Bagian
        id="cakupan"
        eyebrow="/CAKUPAN DATA"
        judul="Sumber data saat ini"
        deskripsi="Lima node inventaris pada lib/data.ts dan public/data/item.json. Halaman ini statis: tidak membaca params dan tidak memakai state klien."
      >
        <div className="bg-[#07070a] border border-white/10 p-5 font-mono text-xs text-zinc-300 space-y-2">
          <p>
            <span className="text-zinc-500">JUMLAH_NODE:</span> 5 TITIK
          </p>
          <p>
            <span className="text-zinc-500">KATEGORI:</span> Environment (2),
            Campus (2), Energy (1)
          </p>
          <p>
            <span className="text-zinc-500">DETAIL_TELEMETRI:</span> lihat{" "}
            <Link href="/katalog" className="text-emerald-300 underline">
              /katalog
            </Link>{" "}
            dan{" "}
            <Link href="/katalog/1" className="text-emerald-300 underline">
              /katalog/1
            </Link>
          </p>
        </div>
      </Bagian>
    </main>
  );
}
