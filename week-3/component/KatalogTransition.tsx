"use client";

import { useEffect, useState } from "react";

export default function KatalogTransition() {
  const [stage, setStage] = useState<"loading" | "opening" | "done">("loading");

  useEffect(() => {
    // Tahap 1: Animasi loading di tengah (layar hijau penuh)
    const loadTimer = setTimeout(() => {
      setStage("opening");
    }, 950);

    // Tahap 2: Animasi membuka / sliding dari tengah ke kedua sisi
    const openTimer = setTimeout(() => {
      setStage("done");
    }, 950 + 750);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(openTimer);
    };
  }, []);

  if (stage === "done") return null;

  const isOpening = stage === "opening";

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── PANEL HIJAU KIRI (SLIDE DARI TENGAH KE KIRI) ── */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpening ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Pola grid halus untuk estetika retro-modern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Garis pertemuan di tengah yang berpendar putih */}
        <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-white/50 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
      </div>

      {/* ── PANEL HIJAU KANAN (SLIDE DARI TENGAH KE KANAN) ── */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-emerald-800 via-emerald-600 to-emerald-500 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpening ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Pola grid halus */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Garis pertemuan di tengah yang berpendar putih */}
        <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-white/50 shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
      </div>

      {/* ── ANIMASI LOADING PUTIH DI TENGAH ── */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center transition-all duration-300 z-[10000] ${
          isOpening ? "opacity-0 scale-90" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          {/* Cincin putar luar putih */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white border-r-white/70 animate-spin" />
          {/* Cincin putar dalam berlawanan arah */}
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-b-white animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
          {/* Inti titik putih bercahaya */}
          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_16px_#ffffff] animate-pulse" />
        </div>

        {/* Teks indikator loading putih */}
        <div className="mt-5 text-center space-y-1">
          <p className="font-mono text-sm sm:text-base font-bold tracking-[0.25em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            MEMUAT KATALOG
          </p>
          <p className="font-mono text-xs tracking-wider text-emerald-100/80 animate-pulse">
            {`// MENGHUBUNGKAN TELEMETRI SENSOR...`}
          </p>
        </div>
      </div>
    </div>
  );
}
