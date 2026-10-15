"use client";

import { useState } from "react";
import KartuItem from "./KartuItem";
import type { Item, category } from "lib/type";

type Filter = category | "semua";
const pilihanFilter: { key: Filter; label: string }[] = [
  { key: "semua", label: "00 / SEMUA" },
  { key: "Environment", label: "01 / LINGKUNGAN" },
  { key: "Campus", label: "02 / KAMPUS" },
  { key: "Energy", label: "03 / ENERGI" },
];

export default function DaftarItem({ items }: { items: Item[] }) {
  const [kataKunci, setKataKunci] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");

  const totalAktif = items.filter((i) => i.availability).length;
  const totalStandby = items.length - totalAktif;

  const hasil = items.filter((item) => {
    const cocokKata = item.title
      .toLowerCase()
      .includes(kataKunci.toLowerCase()) ||
      item.description.toLowerCase().includes(kataKunci.toLowerCase());
    const cocokKategori = filter === "semua" || item.category === filter;
    return cocokKata && cocokKategori;
  });

  return (
    <div className="font-sans space-y-6">
      {/* ── LIVE TELEMETRY STATS STRIP ── */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-[#07070a] border border-white/10 font-mono text-xs">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">TOTAL NODE</span>
          <span className="text-white text-base font-bold">{items.length} TITIK</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">TERSEDIA / AKTIF</span>
          <span className="text-emerald-400 text-base font-bold">{totalAktif} ONLINE</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">HEMAT / STANDBY</span>
          <span className="text-amber-400 text-base font-bold">{totalStandby} MODE</span>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Terminal Search Input */}
        <div className="w-full md:w-80">
          <label
            htmlFor="cari"
            className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-1.5"
          >
            PENCARIAN // FILTER
          </label>
          <div className="relative">
            <input
              id="cari"
              type="search"
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              placeholder="Cari sensor atau fasilitas..."
              className="w-full bg-[#07070a] border border-white/15 px-3 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-mono"
            />
            {kataKunci && (
              <button
                type="button"
                onClick={() => setKataKunci("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white font-mono text-xs"
              >
                [X]
              </button>
            )}
          </div>
        </div>

        {/* ASCII-Magic Style Pills */}
        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-zinc-400 mb-1.5 md:text-right">
            KLASIFIKASI KATEGORI
          </span>
          <div role="group" aria-label="Filter kategori" className="flex flex-wrap gap-2">
            {pilihanFilter.map((f) => {
              const count =
                f.key === "semua"
                  ? items.length
                  : items.filter((i) => i.category === f.key).length;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                  className={`font-mono text-xs px-3 py-1.5 border transition-all ${
                    filter === f.key
                      ? "bg-white text-[#040406] font-semibold border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                      : "bg-[#07070a] text-zinc-400 border-white/15 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {f.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Index Counter */}
      <div className="flex items-center justify-between font-mono text-xs text-zinc-500 pt-1">
        <span>{`// ${hasil.length} NODE TELEMETRI TERINDEKS`}</span>
        {kataKunci && (
          <span className="text-zinc-400">
            Kata kunci: <span className="text-white">&quot;{kataKunci}&quot;</span>
          </span>
        )}
      </div>

      {/* Items Grid */}
      {hasil.length === 0 ? (
        <div className="p-12 bg-[#07070a] border border-white/10 text-center font-mono space-y-3">
          <p className="text-emerald-400 text-sm">
            [ERR 404] TIDAK ADA DATA YANG COCOK
          </p>
          <p className="text-xs text-zinc-500">
            Tidak ditemukan perangkat atau sensor yang sesuai dengan filter pencarian.
          </p>
          <button
            type="button"
            onClick={() => {
              setKataKunci("");
              setFilter("semua");
            }}
            className="mt-2 px-4 py-1.5 border border-white/20 text-xs text-white hover:bg-white/10 transition-colors"
          >
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hasil.map((item) => (
            <li key={item.id}>
              <KartuItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
