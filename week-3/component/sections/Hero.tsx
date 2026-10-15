"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface PresetData {
  id: string;
  label: string;
  metric: string;
  beforeHeader: string;
  beforeContent: string[];
  afterHeader: string;
  afterAscii: string[];
}

const PRESETS: PresetData[] = [
  {
    id: "temp",
    label: "01 / Suhu & RH",
    metric: "28.4°C | 64% RH",
    beforeHeader: "RAW ANALOG SENSOR // ADC_CH_0",
    beforeContent: [
      "[SYS_CLK: 2026-10-09 17:15:00.294]",
      "NODE_ID: SENS-ITB-GKU-3",
      "REGISTER: 0x3F9A -> INT_TEMP: 0x011C",
      "VOLTAGE_REF: 3.298 VDC",
      "SAMPLES_AGG: [28.1, 28.3, 28.4, 28.4, 28.5]",
      "STD_DEV: 0.14 | DELTA_T: +0.2°C/hr",
      "STATUS: CALIBRATED (CHECKSUM: 0x8E)",
      "BUFFER_STREAM: 01010100 01100101 01101101",
    ],
    afterHeader: "ASCII CLIMATE MATRIX // REALTIME",
    afterAscii: [
      "+-----------------[ GKU-3 CLIMATE ]-----------------+",
      "| RERATA SUHU : [################....] 28.4°C (NOM) |",
      "| KELEMBABAN  : [############........]  64% RH (OK)  |",
      "|                                                   |",
      "|   .---.     .---------------------------------.   |",
      "|  /     \\    | .  : : + + # # @ @ # # + + :  . |   |",
      "| | (28°) |   | :  + + # # @ @ @ @ # # + + :  . |   |",
      "|  \\     /    | +  # # @ @ @ @ @ @ @ # # + :  . |   |",
      "|   '---'     '---------------------------------'   |",
      "| STATUS: COMFORTABLE // FAN_SPEED_AUTO: ACTIVE    |",
      "+---------------------------------------------------+",
    ],
  },
  {
    id: "hvac",
    label: "02 / Status AC",
    metric: "24°C // ACTIVE",
    beforeHeader: "THERMOSTAT TELEMETRY // BUS_CAN_1",
    beforeContent: [
      "[BUS_FRAME: PKT_9921_ACK]",
      "UNIT_TARGET: COMPRESSOR_INVERTER_A",
      "CURRENT_DRAW: 6.82 A @ 220 VAC",
      "COOLANT_TEMP_IN: 12.4°C | OUT: 18.2°C",
      "FAN_BLOWER_RPM: 1240 RPM (PWM: 78%)",
      "RUN_HOURS: 4,120 HRS",
      "POWER_STATE: LOAD_NOMINAL (1500W)",
      "CYCLE_MODE: ECO_AUTO_THROTTLE",
    ],
    afterHeader: "ASCII HVAC AIRFLOW // SIMULATION",
    afterAscii: [
      "+-----------------[ AC STATUS / LAB-102 ]-----------+",
      "| POWER: [ONLINE]  TARGET: 24.0°C   MODE: ECO-COOL  |",
      "|                                                   |",
      "|      .======.      >>>  >>>  >>>  >>>             |",
      "|     /  AC   /====> [###################] AIRFLOW  |",
      "|    / UNIT  /       >>>  >>>  >>>  >>>   (1240 RPM)|",
      "|   '======'                                        |",
      "|                                                   |",
      "|   KOMPRESOR : [||||||||||||||||||||.....] 78% PWR |",
      "|   PENGHEMATAN: -24% ENERGI VS SISTEM KONVENSIONAL |",
      "+---------------------------------------------------+",
    ],
  },
  {
    id: "fan",
    label: "03 / Kipas Angin",
    metric: "RPM: 420 // OFF",
    beforeHeader: "TACHOMETER RELAY // GPIO_PIN_14",
    beforeContent: [
      "[PULSE_COUNT: 0x0000]",
      "DEVICE: CEILING_FAN_ZONE_B",
      "RELAY_STATE: OPEN (DE-ENERGIZED)",
      "SPEED_SETTING: 0 (HALTED)",
      "ROOM_OCCUPANCY: 0 DETECTED (PIR_LOW)",
      "AUTO_SLEEP_TIMER: EXPIRED (15 MIN)",
      "SWITCH_OVERRIDE: FALSE",
      "SAFETY_LOCK: NORMAL",
    ],
    afterHeader: "ASCII VENTILATION // KELAS 7602",
    afterAscii: [
      "+-----------------[ EXHAUST & FAN ]-----------------+",
      "| PERANGKAT   : KIPAS RUANG KELAS #02               |",
      "| STATUS      : [ OFF / HEMAT DAYA ]                |",
      "|                                                   |",
      "|          \\   /        OTOMASI KAMPUS:             |",
      "|           .-.         Ruangan tidak berpenghuni.  |",
      "|        --|   |--      Kipas dinonaktifkan         |",
      "|           '-'         otomatis untuk efisiensi.   |",
      "|          /   \\                                    |",
      "|                                                   |",
      "| DAYA TERSIMPAN: 65W // SIAP DIAKTIFKAN KEMBALI    |",
      "+---------------------------------------------------+",
    ],
  },
  {
    id: "power",
    label: "04 / Daya Listrik",
    metric: "14.2 kW // PEAK",
    beforeHeader: "SMART METER 3-PHASE // MODBUS_RTU",
    beforeContent: [
      "[MODBUS_ADDR: 0x04]",
      "PHASE_A: 21.4 A | PHASE_B: 22.1 A | PHASE_C: 20.9 A",
      "VOLT_LINE: 382.4 V RMS | FREQ: 50.02 HZ",
      "POWER_FACTOR: 0.94 (ACTIVE_PWR: 14.21 kW)",
      "APPARENT_PWR: 15.12 kVA",
      "TODAY_TOTAL: 84.6 kWh",
      "PEAK_TODAY: 16.8 kW @ 14:15 WIB",
      "ALARM_FLAGS: NONE_DETECTED",
    ],
    afterHeader: "ASCII POWER GRID // SUBSTATION",
    afterAscii: [
      "+-----------------[ BEBAN LISTRIK GEDUNG ]---------+",
      "| BEBAN SAAT INI : [#############.......] 14.2 kW   |",
      "| KAPASITAS MAKS : 25.0 kW (SAFETY MARGIN: OK)     |",
      "|                                                   |",
      "| [SUB-STATION]--->[PANEL GKU]--->[LAB: 6.2 kW]     |",
      "|                             '--->[AC : 5.8 kW]     |",
      "|                             '--->[LMP: 2.2 kW]     |",
      "|                                                   |",
      "| EFISIENSI DAYA : 94% (POWER FACTOR 0.94 LAG)      |",
      "| ESTIMASI BIAYA : RAMAH ANGGARAN KAMPUS            |",
      "+---------------------------------------------------+",
    ],
  },
];

const ROTATOR_WORDS = [
  "ASCII Matrix",
  "Live Telemetry",
  "Smart Control",
  "Energy Visuals",
];

export default function Hero() {
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activePreset, setActivePreset] = useState("temp");
  const [rotatorIdx, setRotatorIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter word rotator effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatorIdx((prev) => (prev + 1) % ROTATOR_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
      setSplit(pos);
    },
    []
  );

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handlePointerMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handlePointerMove(e.touches[0].clientX);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDragging, handlePointerMove]);

  const currentData = PRESETS.find((p) => p.id === activePreset) || PRESETS[0];

  return (
    <section className="relative">
      {/* ── BEFORE / AFTER ASCII-MAGIC SLIDER ── */}
      <div
        ref={containerRef}
        onClick={(e) => handlePointerMove(e.clientX)}
        className="relative w-full aspect-[16/10] sm:aspect-[21/9] bg-[#050507] border border-white/10 overflow-hidden select-none cursor-ew-resize group shadow-2xl"
      >
        {/* Ambient CRT glow effect in background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.25) 0%, transparent 70%)",
          }}
        />

        {/* Scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)",
            backgroundSize: "100% 4px",
          }}
        />

        {/* ── BEFORE LAYER (RAW SENSOR DATA) ── */}
        <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between font-mono bg-[#07070a] text-zinc-300">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[10px] sm:text-xs tracking-widest text-zinc-400 uppercase">
                {currentData.beforeHeader}
              </span>
              <span className="text-[10px] sm:text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 border border-amber-400/20">
                RAW TELEMETRY
              </span>
            </div>
            <div className="mt-3 sm:mt-5 space-y-1 text-[11px] sm:text-sm text-zinc-400 font-mono leading-relaxed">
              {currentData.beforeContent.map((line, i) => (
                <div key={i} className="truncate">
                  <span className="text-zinc-600 mr-2 sm:mr-3 select-none">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AFTER LAYER (ASCII VISUALIZATION) ── */}
        <div
          className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between font-mono bg-[#020204] text-emerald-400"
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
        >
          <div>
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-[10px] sm:text-xs tracking-widest text-emerald-400/80 uppercase">
                {currentData.afterHeader}
              </span>
              <span className="text-[10px] sm:text-xs text-emerald-300 bg-emerald-500/10 px-2 py-0.5 border border-emerald-400/30">
                ASCII MATRIX OK
              </span>
            </div>
            <div className="mt-2 sm:mt-4 font-mono text-[10px] sm:text-xs lg:text-[13px] leading-snug sm:leading-normal text-emerald-300 whitespace-pre overflow-x-hidden">
              {currentData.afterAscii.map((line, i) => (
                <div key={i} className="truncate font-semibold drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── DIVIDER LINE & HANDLE ── */}
        <div
          className="absolute top-0 bottom-0 z-30 w-[1px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)] pointer-events-none"
          style={{ left: `${split}%` }}
        />
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            setIsDragging(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setSplit((s) => Math.max(5, s - 5));
            if (e.key === "ArrowRight") setSplit((s) => Math.min(95, s + 5));
          }}
          tabIndex={0}
          role="slider"
          aria-valuenow={Math.round(split)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Drag before and after split slider"
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0a0a0c]/85 border border-white/60 text-white flex items-center justify-center shadow-lg backdrop-blur cursor-grab active:cursor-grabbing hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-white"
          style={{ left: `${split}%` }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3" />
          </svg>
        </div>

        {/* ── PRESET PILLS ALONG BOTTOM ── */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar"
        >
          {PRESETS.map((preset) => {
            const isActive = preset.id === activePreset;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActivePreset(preset.id)}
                className={`flex-shrink-0 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-mono transition-all border ${
                  isActive
                    ? "bg-white text-[#040406] font-semibold border-white shadow-[0_0_12px_rgba(255,255,255,0.25)]"
                    : "bg-[#0b0b0e]/90 text-zinc-400 border-white/15 hover:border-white/40 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── HERO TEXT BLOCK BELOW SLIDER (EXACT ASCII-MAGIC LAYOUT) ── */}
      <div className="pt-8 sm:pt-12 pb-6 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-12 items-start">
          {/* Main Title with Brackets Typewriter Rotator */}
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-normal tracking-tight text-white leading-[1.12]">
              Pantau kampus dan fasilitas <br />
              dalam{" "}
              <span className="inline-flex items-baseline font-mono text-emerald-400 whitespace-nowrap">
                <span className="text-white/40 mr-1">&#123;</span>
                <span className="transition-all duration-300">
                  {ROTATOR_WORDS[rotatorIdx]}
                </span>
                <span className="text-white/40 ml-1">&#125;</span>
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Platform telemetri dan pemantauan sensor kampus berbasis browser. Konversi data mentah sensor suhu, pendingin AC, dan kelistrikan ke dalam visualisasi matriks ASCII secara real-time tanpa latensi.
            </p>
          </div>

          {/* Action CTAs (Signature ASCII-Magic Tab Button) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2">
            {/* Primary Button with Left 3px Tab Line */}
            <div className="inline-flex items-center h-11 gap-[2px]">
              <span className="w-[3px] h-11 bg-white flex-shrink-0" />
              <Link
                href="/katalog"
                className="h-11 px-5 bg-white text-[#040406] font-mono text-sm font-semibold flex items-center justify-center hover:bg-zinc-200 transition-colors"
              >
                Buka Katalog
              </Link>
            </div>

            {/* Ghost Outline Button */}
            <a
              href="#about"
              className="h-11 px-5 border border-white/30 text-white font-mono text-sm flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              Jelajahi Fitur
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
