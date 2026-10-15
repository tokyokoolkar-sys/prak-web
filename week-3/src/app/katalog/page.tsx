import type { Metadata } from "next";
import Link from "next/link";
import Bagian from "component/Bagian";
import DaftarItem from "component/DaftarItem";
import { listItem } from "lib/data";

export const metadata: Metadata = {
  title: "Katalog Fasilitas & Sensor | Smart Campus",
  description: "Inventaris lengkap sensor lingkungan dan perangkat hemat energi kampus",
};

export default function HalamanKatalog() {
  return (
    <main id="konten" className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
        {/* ── BREADCRUMB & HEADER ── */}
        <div className="border-b border-white/10 pb-8 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <span>&larr;</span>
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                /DATABASE INVENTARIS
              </p>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
                Katalog Fasilitas & Sensor
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
                Daftar telemetri aktif untuk pemantauan mikroklimat, efisiensi pendingin AC, serta ketersediaan sarana kelas di lingkungan kampus.
              </p>
            </div>

            <div className="inline-flex items-center h-8 gap-[2px] font-mono text-xs">
              <span className="w-[3px] h-8 bg-emerald-400 flex-shrink-0" />
              <span className="h-8 px-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center">
                ● DATABASE SYNCED
              </span>
            </div>
          </div>
        </div>

        {/* ── ITEMS SECTION ── */}
        <Bagian
          id="daftar"
          eyebrow="/TELEMETRI DATA"
          judul="Daftar Node & Perangkat"
          deskripsi="Pilih kategori untuk memfilter titik sensor atau klik kartu untuk melihat detail pembacaan telemetri."
        >
          <DaftarItem items={listItem} />
        </Bagian>
    </main>
  );
}