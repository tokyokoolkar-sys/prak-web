"use client";

import { useState } from "react";
import Bagian from "component/Bagian";
import Link from "next/link";

interface FeatureCard {
  id: string;
  tag: string;
  title: string;
  desc: string;
  asciiArt: string[];
  statLabel: string;
  statValue: string;
}

const CARDS: FeatureCard[] = [
  {
    id: "env",
    tag: "01 / ENVIRONMENT",
    title: "Pemantauan Mikroklimat",
    desc: "Sensor multi-zona mendeteksi anomali suhu dan kelembapan ruangan secara presisi untuk menjaga kenyamanan belajar mengajar.",
    asciiArt: [
      "[NODE: SENS-ENV-01] // GKU BARAT",
      "+------------------------------------+",
      "| TEMP: 28.4°C     HUMIDITY: 64% RH  |",
      "|                                    |",
      "|   ..::++##@@##++::..   (Rerata)    |",
      "|  [###############.....] 72% INDEKS |",
      "+------------------------------------+",
    ],
    statLabel: "STATUS ZONA",
    statValue: "OPTIMAL (28.4°C)",
  },
  {
    id: "pwr",
    tag: "02 / ENERGY",
    title: "Efisiensi Energi Otomatis",
    desc: "Mendeteksi ruang kelas tanpa penikmat dan secara otomatis memangkas konsumsi pendingin AC serta pencahayaan berlebih.",
    asciiArt: [
      "[NODE: SENS-PWR-04] // SUBSTATION",
      "+------------------------------------+",
      "| BEBAN: 14.8 kW   TARGET ECO: ON    |",
      "|                                    |",
      "|  [|||||||||||||||.....] 68% LOAD   |",
      "|  HEMAT: -24.8% KWH VS PEAK HARIAN  |",
      "+------------------------------------+",
    ],
    statLabel: "PENGHEMATAN",
    statValue: "-24.8% LISTRIK",
  },
  {
    id: "fac",
    tag: "03 / CAMPUS",
    title: "Ketersediaan Inventaris",
    desc: "Katalog kondisi fasilitas kelas dan perangkat kampus yang terdata real-time untuk transparansi dan pemeliharaan proaktif.",
    asciiArt: [
      "[NODE: SENS-FAC-12] // LAB KOMPUTER",
      "+------------------------------------+",
      "| AC: ACTIVE       KIPAS: 4/5 READY  |",
      "| LAMPU: 100%      EXHAUST: STANDBY  |",
      "|                                    |",
      "| KESIAPAN KELAS : [ 96.2% SIAP ]    |",
      "+------------------------------------+",
    ],
    statLabel: "AKURASI DATA",
    statValue: "96.2% TERSEDIA",
  },
];

export default function About() {
  const [activeCard, setActiveCard] = useState<string>("env");

  return (
    <Bagian
      id="about"
      eyebrow="/ARSITEKTUR & FITUR"
      judul="Tiga Pilar Pemantauan, Satu Kendali Terpadu."
      deskripsi="Arsitektur pemantauan sensor cerdas yang memadukan telemetri lingkungan, efisiensi energi, dan inventaris fasilitas kampus dalam satu visualisasi komprehensif."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CARDS.map((card) => {
          const isSelected = activeCard === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              className={`group flex flex-col justify-between bg-[#07070a] border transition-all duration-200 cursor-pointer p-5 sm:p-6 ${
                isSelected
                  ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.08)] bg-[#0b0b10]"
                  : "border-white/10 hover:border-white/30 hover:bg-[#09090d]"
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="font-mono text-xs text-white/50 tracking-wider">
                    {card.tag}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isSelected ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-white/20"
                    }`}
                  />
                </div>

                {/* ASCII Art Preview Box */}
                <div className="mt-4 p-3 bg-[#030305] border border-white/5 font-mono text-[10px] sm:text-[11px] leading-tight text-emerald-400/90 overflow-x-hidden select-none">
                  {card.asciiArt.map((line, i) => (
                    <div key={i} className="truncate">
                      {line}
                    </div>
                  ))}
                </div>

                {/* Card Title & Desc */}
                <h3 className="mt-5 text-lg sm:text-xl font-semibold text-white font-sans group-hover:text-emerald-300 transition-colors">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {card.desc}
                </p>
              </div>

              {/* Bottom Stat Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-500 uppercase">{card.statLabel}</span>
                <span
                  className={`font-semibold ${
                    isSelected ? "text-emerald-300" : "text-white"
                  }`}
                >
                  {card.statValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick link to catalog */}
      <div className="mt-8 flex justify-end">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          Lihat seluruh inventaris di katalog &rarr;
        </Link>
      </div>
    </Bagian>
  );
}
