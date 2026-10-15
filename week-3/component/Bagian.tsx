interface BagianProps {
    id: string;
    judul: string;
    eyebrow?: string;
    deskripsi?: string;
    children: React.ReactNode;
}

export default function Bagian({ id, judul, eyebrow, deskripsi, children }: BagianProps) {
    return (
        <section id={id} aria-labelledby={`judul-${id}`} className="py-16 border-t border-white/10 relative">
            <div className="mb-8">
                {eyebrow && (
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
                        {eyebrow.startsWith("/") ? eyebrow : `/${eyebrow}`}
                    </p>
                )}
                <h2 id={`judul-${id}`} className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {judul}
                </h2>
                {deskripsi && (
                    <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
                        {deskripsi}
                    </p>
                )}
            </div>
            <div>{children}</div>
        </section>
    );
}
