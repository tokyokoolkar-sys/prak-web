import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listItem } from "lib/data";

export async function generateStaticParams() {
  return listItem.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = listItem.find((i) => String(i.id) === id);
  if (!item) {
    return { title: "Node tidak ditemukan | Smart Campus" };
  }
  return {
    title: `${item.title} (#${item.id}) | Smart Campus`,
    description: item.description,
  };
}

export default async function HalamanDetailKatalog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = listItem.find((i) => String(i.id) === id);

  if (!item) {
    notFound();
  }

  const terkait = listItem
    .filter((i) => i.id !== item.id && i.category === item.category)
    .slice(0, 2);

  return (
    <main
      id="konten"
      className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8"
    >
      <div className="border-b border-white/10 pb-8 space-y-4">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <span>&larr;</span>
          <span>Kembali ke Katalog</span>
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          /DATABASE INVENTARIS / NODE #{String(item.id).padStart(2, "0")}
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          {item.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
          {item.description}
        </p>
      </div>

      <section
        aria-label="Detail telemetri"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <div className="bg-[#07070a] border border-white/10 p-5 font-mono text-xs space-y-2">
          <p className="text-white/50 uppercase tracking-widest">ID_NODE</p>
          <p className="text-white text-base font-bold">
            #{String(item.id).padStart(2, "0")}
          </p>
          <p className="text-zinc-500">params.id = &quot;{id}&quot;</p>
        </div>
        <div className="bg-[#07070a] border border-white/10 p-5 font-mono text-xs space-y-2">
          <p className="text-white/50 uppercase tracking-widest">KATEGORI</p>
          <p className="text-white text-base font-bold">{item.category}</p>
          <p className="text-zinc-500">Nilai sah: Energy, Environment, Campus</p>
        </div>
        <div className="bg-[#07070a] border border-white/10 p-5 font-mono text-xs space-y-2">
          <p className="text-white/50 uppercase tracking-widest">STATUS</p>
          <p
            className={
              item.availability ? "text-emerald-300 font-bold" : "text-amber-300 font-bold"
            }
          >
            {item.availability ? "TERSEDIA / AKTIF" : "STANDBY / HEMAT DAYA"}
          </p>
          <p className="text-zinc-500">Sumber: lib/data.ts</p>
        </div>
      </section>

      {terkait.length > 0 && (
        <section aria-label="Node terkait" className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            /NODE_SEKATEGORI
          </h2>
          <ul className="flex flex-wrap gap-2 font-mono text-xs">
            {terkait.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/katalog/${t.id}`}
                  className="inline-block px-3 py-1.5 border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 transition-colors"
                >
                  #{t.id} — {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
