"use client";

import { useState } from "react";
import Bagian from "component/Bagian";

export default function Contact() {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Environment");
  const [pesan, setPesan] = useState("");
  const [ping, setPing] = useState(14);
  const [isPinging, setIsPinging] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[SYS_READY] Gateway online. Socket terhubung pada node ITB-GW-01.",
    "[AWAITING] Menunggu transmisi laporan dari klien...",
  ]);

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      const newPing = Math.floor(Math.random() * 8) + 9; // 9ms - 16ms
      setPing(newPing);
      setIsPinging(false);
      setLogs((prev) => [
        `[PING_TEST] Echo dari gateway.campus.ac.id: ${newPing}ms (0% loss)`,
        ...prev.slice(0, 4),
      ]);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !pesan.trim()) return;

    const timestamp = new Date().toLocaleTimeString("id-ID");
    const newTxId = Math.floor(Math.random() * 9000) + 1000;

    setLogs((prev) => [
      `[SUCCESS 200] TX_ID: #LPR-${newTxId} | Pengirim: ${nama} | Kat: ${kategori}`,
      `[${timestamp}] Paket data tersimpan ke antrean teknisi pemeliharaan.`,
      ...prev.slice(0, 3),
    ]);

    setNama("");
    setPesan("");
  };

  return (
    <Bagian
      id="contact"
      eyebrow="/CONTACT & GATEWAY"
      judul="Terminal Pengaduan & Transmisi Laporan."
      deskripsi="Laporkan anomali fasilitas, kerusakan perangkat sensor, atau hubungi pengelola sistem langsung melalui konsol gerbang telemetri."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── LEFT COLUMN: GATEWAY TELEMETRY SYSINFO ── */}
        <div className="bg-[#07070a] border border-white/10 p-6 flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs text-white/50 tracking-widest uppercase">
                NODE TELEMETRY STATUS
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE (READY)
              </span>
            </div>

            <div className="mt-5 space-y-2.5 text-xs sm:text-sm text-zinc-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">GATEWAY_HOST</span>
                <span className="text-white">gateway.campus.ac.id</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">NODE_ID</span>
                <span className="text-emerald-300">ITB-GW-NODE-01</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">LATENSI_JARINGAN</span>
                <span className="text-amber-300 font-bold">{ping} ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">LOKASI_FISIK</span>
                <span className="text-white">Gedung Lab Terpadu Lt. 2</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">SYSADMIN_MAIL</span>
                <span className="text-white">sysadmin@campus.ac.id</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-zinc-500">JAM_OPERASIONAL</span>
                <span className="text-white">08:00 - 16:00 WIB</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePing}
              disabled={isPinging}
              className="px-3 py-1.5 border border-white/20 text-xs text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {isPinging ? "Menguji ping..." : "Uji Latensi Ping"}
            </button>
            <span className="text-[11px] text-zinc-500">
              UPTIME: 99.98% (30d)
            </span>
          </div>
        </div>

        {/* ── RIGHT COLUMN: TRANSMIT REPORT FORM ── */}
        <div className="bg-[#07070a] border border-white/10 p-6 flex flex-col justify-between font-mono">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs text-white/50 tracking-widest uppercase">
                TRANSMIT REPORT // FORM
              </span>
              <span className="text-xs text-zinc-400">ENKRIPSI: TLS 1.3</span>
            </div>

            <div>
              <label htmlFor="input-nama" className="block text-xs text-zinc-400 uppercase tracking-wider mb-1">
                PENGIRIM // NAMA
              </label>
              <input
                id="input-nama"
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi Santoso / NIM 135..."
                className="w-full bg-[#030305] border border-white/15 px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label htmlFor="input-kat" className="block text-xs text-zinc-400 uppercase tracking-wider mb-1">
                KATEGORI // KLASIFIKASI
              </label>
              <select
                id="input-kat"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full bg-[#030305] border border-white/15 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white transition-colors"
              >
                <option value="Environment">Lingkungan (Suhu, Kelembaban)</option>
                <option value="Energy">Energi (AC, Panel Listrik)</option>
                <option value="Campus">Fasilitas Kampus (Kipas, Lampu)</option>
              </select>
            </div>

            <div>
              <label htmlFor="input-pesan" className="block text-xs text-zinc-400 uppercase tracking-wider mb-1">
                PESAN // ANOMALI FASILITAS
              </label>
              <textarea
                id="input-pesan"
                rows={3}
                required
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Tuliskan laporan kerusakan atau pertanyaan fasilitas..."
                className="w-full bg-[#030305] border border-white/15 px-3 py-2 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Signature ASCII-Magic CTA Button */}
            <div className="pt-2 flex items-center justify-between">
              <div className="inline-flex items-center h-10 gap-[2px]">
                <span className="w-[3px] h-10 bg-white flex-shrink-0" />
                <button
                  type="submit"
                  className="h-10 px-5 bg-white text-[#040406] font-mono text-xs font-semibold flex items-center hover:bg-zinc-200 transition-colors"
                >
                  TRANSMIT LOG
                </button>
              </div>
              <span className="text-[11px] text-zinc-500">DEMO CONSOLE</span>
            </div>
          </form>

          {/* ── CONSOLE OUTPUT FEED ── */}
          <div className="mt-5 p-3 bg-[#020204] border border-white/10 text-[11px] text-emerald-400/90 space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider pb-1 border-b border-white/5">
              GATEWAY LOG OUTPUT
            </div>
            {logs.map((log, i) => (
              <div key={i} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Bagian>
  );
}
