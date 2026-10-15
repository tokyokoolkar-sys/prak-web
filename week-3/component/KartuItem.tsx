"use client";

import { useState } from "react";
import Link from "next/link";
import type { Item, category } from "lib/type";

const labelKategori: Record<category, string> = {
  Energy: "Energi",
  Environment: "Lingkungan",
  Campus: "Kampus",
};

const ASCII_MAP: Record<number, { art: string[]; metric: string; loc: string }> = {
  1: {
    art: [
      "[SENS: TEMP-ITB-01]",
      "+-----------------------+",
      "|   .---.    28.4°C     |",
      "|  | .-. |   64% RH     |",
      "|  | | | |  [#####...]  |",
      "|  | '-' |  OPTIMAL     |",
      "|   '---'               |",
      "+-----------------------+",
    ],
    metric: "28.4°C / 64% RH",
    loc: "Ruang Seminar GKU Lt. 3",
  },
  2: {
    art: [
      "[SENS: FAN-CEILING]",
      "+-----------------------+",
      "|    \\  |  /  0 RPM     |",
      "|   -- (X) -- STANDBY   |",
      "|    /  |  \\  PIR: LOW  |",
      "|   [HEMAT LISTRIK]     |",
      "+-----------------------+",
    ],
    metric: "0 RPM (Mode Hemat)",
    loc: "Ruang Kelas 7602",
  },
  3: {
    art: [
      "[SENS: LAMP-LED-36]",
      "+-----------------------+",
      "|     \\ ' /   220 VAC   |",
      "|    - (*) -  LED 36W   |",
      "|     / . \\   450 LUX   |",
      "|    [AKTIF / 100%]     |",
      "+-----------------------+",
    ],
    metric: "450 LUX (Aktif)",
    loc: "Laboratorium Multimedia",
  },
  4: {
    art: [
      "[SENS: AC-INVERTER]",
      "+-----------------------+",
      "|  .=================.  |",
      "|  | AC [###] >>> >>>|  |",
      "|  '================='  |",
      "|  24.0°C // ECO-COOL   |",
      "+-----------------------+",
    ],
    metric: "24.0°C / Eco Inverter",
    loc: "Ruang Dosen & Tata Usaha",
  },
  5: {
    art: [
      "[SENS: EXH-VENTILASI]",
      "+-----------------------+",
      "|   [|||||||||||||]     |",
      "|   ( ( ( EXHAUST ) ) ) |",
      "|   AIRFLOW: 0 M3/H     |",
      "|   [SIAP DIAKTIFKAN]   |",
      "+-----------------------+",
    ],
    metric: "0 m³/h (Standby)",
    loc: "Lab Fisika Terpadu",
  },
};

export default function KartuItem({ item }: { item: Item }) {
  const [showDetail, setShowDetail] = useState(false);
  const data = ASCII_MAP[item.id] || {
    art: ["[SENS: TELEMETRY]", "+-----------------------+", "| SENSOR NODE OK        |", "+-----------------------+"],
    metric: "Telemetry Active",
    loc: "Kampus ITB",
  };

  return (
    <article
      onClick={() => setShowDetail(!showDetail)}
      className="group flex flex-col justify-between bg-[#07070a] border border-white/10 hover:border-white/40 transition-all duration-200 p-5 cursor-pointer relative shadow-sm hover:shadow-[0_0_24px_rgba(255,255,255,0.06)]"
    >
      <div>
        {/* Top Header Row with ID & Category */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
          <span className="text-white/50 tracking-wider">
            {`ID: #${item.id.toString().padStart(2, "0")} // ${item.category.toUpperCase()}`}
          </span>
          <span className="text-zinc-500 text-[10px]">
            {labelKategori[item.category]}
          </span>
        </div>

        {/* ASCII Art Preview Box */}
        <div className="mt-4 p-3 bg-[#030305] border border-white/5 font-mono text-[10px] leading-tight text-emerald-400/90 select-none overflow-x-hidden group-hover:border-emerald-500/20 transition-colors">
          {data.art.map((line, i) => (
            <div key={i} className="truncate">
              {line}
            </div>
          ))}
        </div>

        {/* Item Title & Description */}
        <h3 className="mt-4 text-lg font-semibold text-white font-sans group-hover:text-emerald-300 transition-colors">
          {item.title}
        </h3>
        <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-sans">
          {item.description}
        </p>

        {/* Expandable Simulated Telemetry Detail */}
        {showDetail && (
          <div className="mt-4 p-3 bg-[#020204] border border-white/10 font-mono text-[11px] space-y-1.5 text-zinc-300 animate-fadeIn">
            <div className="flex justify-between border-b border-white/5 pb-1 text-zinc-500 text-[10px]">
              <span>TELEMETRY_DETAIL</span>
              <span className="text-emerald-400">SYNCED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">LOKASI:</span>
              <span className="text-white truncate ml-2">{data.loc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">PEMBACAAN:</span>
              <span className="text-emerald-300">{data.metric}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between font-mono text-xs">
        {item.availability ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TERSEDIA / AKTIF
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            STANDBY / HEMAT DAYA
          </span>
        )}
        <span className="text-[10px] text-zinc-500 group-hover:text-white transition-colors">
          {showDetail ? "Tutup ▲" : "Detail ▼"}
        </span>
      </div>
      <div
        className="mt-3"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Link
          href={`/katalog/${item.id}`}
          className="inline-flex items-center gap-2 font-mono text-xs text-emerald-300 hover:text-white transition-colors"
        >
          <span>Buka halaman detail</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
