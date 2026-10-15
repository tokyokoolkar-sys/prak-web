"use client";

import { useEffect, useState } from "react";
import type { Item } from "lib/type";
import KartuItem from "./KartuItem";

type Status = "memuat" | "berhasil" | "gagal";

export default function ItemTerbaru() {
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<Status>("memuat");

  async function muat() {
    setStatus("memuat");
    try {
      const res = await fetch("/data/item.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Item[] = await res.json();
      setItems(data.slice(0, 3));
      setStatus("berhasil");
    } catch {
      setStatus("gagal");
    }
  }

  useEffect(() => {
    let dibatalkan = false;

    async function fetchData() {
      try {
        const res = await fetch("/data/item.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Item[] = await res.json();
        if (!dibatalkan) {
          setItems(data.slice(0, 3));
          setStatus("berhasil");
        }
      } catch {
        if (!dibatalkan) {
          setStatus("gagal");
        }
      }
    }

    fetchData();

    return () => {
      dibatalkan = true;
    };
  }, []);

  // ── STATE: MEMUAT / LOADING (DENGAN ANIMASI SKELETON PULSE) ──
  if (status === "memuat") {
    return (
      <div className="space-y-4 font-mono">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>[FETCHING] Memuat data terbaru dari /data/item.json...</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5" aria-label="Memuat item...">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className="border border-white/10 bg-[#07070a] p-5 space-y-4 animate-pulse relative overflow-hidden"
            >
              {/* Shimmer sweep effect */}
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="h-3 w-28 bg-white/10 rounded" />
                <div className="h-3 w-12 bg-white/5 rounded" />
              </div>
              <div className="h-24 bg-white/5 border border-white/5 flex items-center justify-center">
                <span className="text-[10px] text-zinc-600 font-mono tracking-widest">
                  SYNCING_TELEMETRY...
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/5 rounded" />
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between">
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="h-3 w-14 bg-white/5 rounded" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // ── STATE: GAGAL ──
  if (status === "gagal") {
    return (
      <div
        role="alert"
        className="p-6 border border-amber-500/30 bg-[#0c0906] font-mono text-xs text-amber-300 space-y-3"
      >
        <p className="font-bold flex items-center gap-2">
          <span>[ERROR 500]</span> Data gagal dimuat dari server.
        </p>
        <p className="text-zinc-400">
          Gagal mengambil data dari endpoint <code>/data/item.json</code>. Silakan periksa koneksi atau muat ulang.
        </p>
        <button
          type="button"
          onClick={() => muat()}
          className="mt-2 px-3 py-1.5 border border-amber-400/40 text-amber-200 hover:bg-amber-400/10 transition-colors uppercase"
        >
          Coba Muat Ulang
        </button>
      </div>
    );
  }

  // ── STATE: BERHASIL ──
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {items.map((item) => (
        <li key={item.id}>
          <KartuItem item={item} />
        </li>
      ))}
    </ul>
  );
}
