# Dokumen Teknis Modul 3: Routing, Layout, dan Komponen App Router

| | |
| --- | --- |
| Nama/NIM | `105224022` |
| Repositori | `https://github.com/tokyokoolkar-sys/prak-web` |
| Produk | ASCII // Smart Campus Telemetry |
| Lokasi produk | `week-3` |
| Tanggal pengumpulan | 16 Oktober 2026 |
| Next.js / React | `16.4.0` / `19.3.0` (lihat `week-3/package.json`) |
| Berkas ini | `week-3/docs/praktikum/modul-03.md` |

Seluruh klaim di bawah ini dapat direproduksi dari folder `week-3` pada repositori di
atas. Perintah dijalankan dengan working directory `week-3`, kecuali dinyatakan lain.
Istilah dan perilaku App Router merujuk pada panduan yang dibundel bersama dependensi
proyek (`node_modules/next/dist/docs/`), bukan pada memori model.

Konvensi penting Next.js 16 yang dipakai dokumen ini:

- Routing berbasis berkas: folder di `src/app/` memetakan ke segmen URL, `page.tsx`
  membuat segmen dapat diakses publik (`03-layouts-and-pages.md`).
- `params` adalah Promise dan wajib di-`await` (atau dibaca dengan `use()` di Client
  Component) (`dynamic-routes.md`, `layout.md`).
- `layout.tsx` tidak me-render ulang saat navigasi dan mempertahankan state;
  `template.tsx` diberi `key` unik per segmen sehingga me-remount saat segmen berubah
  (`template.md`, `layout.md`).
- Layout dan page default adalah Server Component; direktif `"use client"` menandai
  batas modul klien (`05-server-and-client-components.md`).

---

## 1. Peta rute produk

Sumber kebenaran: pohon berkas `src/app/` pada Bagian 2 dan keluaran `npm run build`
pada Bagian 6.2. Tabel ini mencakup 4 rute publik (syarat minimal terpenuhi) plus
rute fallback global.

| No. | URL | Berkas di `src/app/` | Jenis rute | Isi halaman |
| --- | --- | --- | --- | --- |
| 1 | `/` | `page.tsx` | Statis | Beranda: slider Before/After telemetri (`Hero`), tiga pilar (`About`), terminal pengaduan (`Contact`). Navigasi utama dari `layout.tsx` (`SiteHeader`). |
| 2 | `/katalog` | `katalog/page.tsx` | Statis | Daftar 5 node inventaris (`DaftarItem` + `KartuItem`), strip statistik TOTAL/AKTIF/STANDBY, input pencarian dan filter kategori. Dibungkus `katalog/layout.tsx` dan `katalog/template.tsx`. |
| 3 | `/katalog/[id]` | `katalog/[id]/page.tsx` | Dinamis (`[id]`) | Detail satu node: judul, deskripsi, kartu ID_NODE / KATEGORI / STATUS, dan tautan node sekategori. `params.id` sah hanya `"1"`–`"5"` (lihat Bagian 3). Tak sah → `notFound()` → `katalog/[id]/not-found.tsx`. |
| 4 | `/tentang` | `tentang/page.tsx` | Statis | Profil produk: alasan matriks ASCII, tiga pilar, dan cakupan data (5 node, kategori, tautan ke `/katalog` dan `/katalog/1`). Murni statis, tanpa `params` dan tanpa state klien. |
| — | URL tak terdaftar (mis. `/tidak-ada`) | `not-found.tsx` (root) | Fallback | Halaman 404 global: pesan `Rute tidak terdaftar` + tombol Beranda dan Katalog. |

Catatan ketepatan:

- Penyebutan "statis" di atas berarti prerender saat build. Bukti build (Bagian 6.2)
  menandai `/`, `/katalog`, `/tentang` dengan `○ (Static)`, dan `/katalog/[id]`
  dengan `○ /katalog/1`, `○ /katalog/2`, `◐ [+3 more paths]` (5 path dari
  `generateStaticParams`) plus entri induk `/katalog/[id]` dinamis.
- Rute dinamis didefinisikan dengan folder `[id]` (kurung siku), bukan file. Ini
  sesuai konvensi `dynamic-routes.md`: "wrapping a folder's name in square brackets
  `[folderName]`".
- Navigasi antar rute memakai `next/link` (`SiteHeader`, `KartuItem`, halaman
  detail). Setiap `KartuItem` kini memuat tautan `Buka halaman detail →`
  ke `/katalog/{id}`, sehingga rute dinamis dapat dicapai dari `/katalog`
  tanpa mengetik URL manual.

---

## 2. Struktur folder `src/app/`

Keluaran aktual (perintah pada Bagian 6.4):

```text
src\app\favicon.ico
src\app\globals.css
src\app\katalog
src\app\katalog\[id]
src\app\katalog\[id]\not-found.tsx
src\app\katalog\[id]\page.tsx
src\app\katalog\layout.tsx
src\app\katalog\page.tsx
src\app\katalog\template.tsx
src\app\layout.tsx
src\app\not-found.tsx
src\app\page.tsx
src\app\tentang
src\app\tentang\page.tsx
```

Pohon yang sama, diberi anotasi peran:

```text
src/app/
├── layout.tsx                  # Root layout (wajib: <html>, <body>, SiteHeader)
├── page.tsx                    # GET / (Server Component)
├── not-found.tsx               # Fallback global untuk segmen tak terdaftar
├── tentang/
│   └── page.tsx                # GET /tentang (Server Component, statis)
└── katalog/
    ├── layout.tsx              # Layout bersarang: sub-navigasi Beranda/Katalog/Tentang
    ├── template.tsx            # Template: me-remount KatalogTransition tiap navigasi
    ├── page.tsx                # GET /katalog (Server Component + pulau klien)
    └── [id]/
        ├── page.tsx            # GET /katalog/[id] (dinamis, generateStaticParams 1-5)
        └── not-found.tsx       # Fallback segmen: "ID node tidak terdaftar"
```

Layout bersarang yang direncanakan dan statusnya:

- `src/app/layout.tsx` (ada, root): memuat font Geist, `SiteHeader`, dan side rails.
  Merupakan satu-satunya layout yang boleh memuat `<html>` dan `<body>`
  (`layout.md`: "The root layout must define `<html>` and `<body>` tags").
- `src/app/katalog/layout.tsx` (ada, bersarang): membungkus `/katalog` dan
  `/katalog/[id]` dengan `<nav aria-label="Navigasi katalog">`. Tidak memuat
  `<html>`/`<body>`, hanya `<div>` + `{children}`. Sesuai aturan
  `03-layouts-and-pages.md`: "layouts in the folder hierarchy are also nested,
  which means they wrap child layouts via their `children` prop".
- Hierarki render untuk `/katalog/1` adalah:
  `RootLayout → KatalogLayout → KatalogTemplate(key berubah per segmen) → DetailPage`.
  Ini sesuai hierarki `layout.js` membungkus `template.js` yang membungkus `page.js`
  (`layout.md`, `template.md`).

Keputusan folder `tentang/` sebagai rute statis terpisah (bukan anchor `#about`)
diambil agar peta rute punya contoh statis non-katalog yang dapat diuji dengan
`curl` (Bagian 6.3) dan terlihat di tabel rute build.

---

## 3. Aturan validasi `params` rute dinamis `/katalog/[id]`

### 3.1 Aturan nilai sah

Implementasi pada `src/app/katalog/[id]/page.tsx`:

```tsx
export async function generateStaticParams() {
  return listItem.map((item) => ({ id: String(item.id) }));
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
  // ...
}
```

Aturan:

1. `params.id` bertipe `string` (bukan `number`), karena nilai segmen URL belum
   diketahui saat build dan selalu string (`dynamic-routes.md` Tabel TypeScript:
   `app/blog/[slug]` → `{ slug: string }`).
2. Nilai sah adalah tepat `"1"`, `"2"`, `"3"`, `"4"`, atau `"5"` — yaitu
   `String(item.id)` untuk setiap entri `lib/data.ts` dan
   `public/data/item.json`. Perbandingan memakai `String(i.id) === id`, bukan
   koersi numerik, agar `"01"` atau `"1.0"` tidak lolos.
3. Lima nilai tersebut diprerender via `generateStaticParams` (terbukti di output
   build: `○ /katalog/1`, `○ /katalog/2`, `◐ [+3 more paths]`).
4. Nilai lain memanggil `notFound()` dari `next/navigation`, yang merender berkas
   terdekat `katalog/[id]/not-found.tsx` dengan metadata
   `Node tidak ditemukan | Smart Campus`.

### 3.2 Tiga contoh URL tidak sah dan tampilan yang diharapkan

Diuji pada server produksi `npm run start -- --port 3111/3112/3113`
(lihat Bagian 6.3). Ketiga URL di bawah merender **UI 404 segmen yang sama**
(`katalog/[id]/not-found.tsx`), dibedakan oleh penyebabnya:

| # | URL tidak sah | Mengapa tidak sah | Tampilan yang diharapkan (terverifikasi) |
| --- | --- | --- | --- |
| 1 | `/katalog/0` | Di luar rentang: tidak ada `id: 0` di `lib/data.ts` | Eyebrow `[ERR 404] NODE TIDAK DITEMUKAN`, judul `ID node tidak terdaftar di inventaris`, teks `Nilai params yang sah adalah "1" sampai "5"`, tombol `Kembali ke Katalog`. Body HTML memuat digest `NEXT_HTTP_ERROR_FALLBACK;404`. |
| 2 | `/katalog/999` | Di luar rentang dan tidak diprerender | Tampilan identik dengan kasus 1 (satu template `not-found.tsx` untuk semua id tak dikenal). Perbedaan hanya pada URL yang diminta; tidak ada kartu ID_NODE/KATEGORI/STATUS yang dirender. |
| 3 | `/katalog/abc` | Bukan angka dan tidak cocok `String(id)` mana pun | Tampilan identik dengan kasus 1 dan 2. `<title>` fallback adalah `Node tidak ditemukan \| Smart Campus` (dari `generateMetadata`), sedangkan body memakai template segmen yang sama. |

Catatan jujur hasil ukur:

- `curl -s -D -` pada ketiga URL tak sah mengembalikan `HTTP/1.1 200 OK` pada
  shell luar dengan `Transfer-Encoding: chunked` dan `x-nextjs-postponed: 1`,
  sementara payload RSC di dalam body menandai `NEXT_HTTP_ERROR_FALLBACK;404`
  dan `<meta name="robots" content="noindex"/>`. Artinya UI yang dilihat pengguna
  adalah UI 404 segmen, meskipun status shell yang teramati pada konfigurasi
  `cacheComponents: true` + Partial Prerender di proyek ini adalah 200.
  Dokumen ini tidak mengklaim status 404 pada lapisan HTTP, hanya tampilan 404
  yang dijanjikan modul.
- URL sah `/katalog/1` mengembalikan `HTTP/1.1 200 OK` dengan `<title>Rerata Suhu
  (#1) | Smart Campus</title>` dan kartu `params.id = "1"`, membuktikan cabang
  sah dan tak sah benar-benar berbeda.

---

## 4. `layout.tsx` vs `template.tsx`

Ringkasan perbedaan (sumber: `template.md` dan `layout.md`):

| Aspek | `layout.tsx` | `template.tsx` |
| --- | --- | --- |
| Persistensi saat navigasi | Dipertahankan (preserved): tidak me-render ulang, state tetap | Tidak dipertahankan: diberi `key` unik per segmen, me-remount penuh saat segmen (termasuk params dinamis) berubah |
| State Client Component di dalamnya | Tetap (mis. input filter tidak hilang saat pindah halaman dalam segmen yang sama) | Direset (input kembali ke nilai awal) |
| `useEffect` | Tidak disinkron ulang saat navigasi dalam segmen yang sama | Dijalankan ulang karena komponen dipasang ulang |
| `loading.js` / Suspense | Batas Suspense di dalam layout hanya tampil pada muat pertama | Batas Suspense di dalam template tampil pada setiap navigasi |
| Posisi hierarki | Paling luar segmen: `Layout → Template → Page` | Di antara layout dan page pada segmen yang sama; tidak membungkus layout segmennya sendiri |
| Komponen default | Server Component | Server Component (dapat merender Client Component) |

Contoh kebutuhan pada produk ini yang lebih cocok memakai `template`:

Transisi pintu geser hijau `KatalogTransition` (loader `MEMUAT KATALOG` 950 ms +
geser 750 ms, total ~1700 ms) harus **diputar ulang setiap kali pengguna
berpindah** antara `/katalog` dan `/katalog/1` (atau antar id). Implementasi yang
dipilih adalah `src/app/katalog/template.tsx`:

```tsx
import KatalogTransition from "component/KatalogTransition";

export default function KatalogTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <KatalogTransition />
      {children}
    </>
  );
}
```

Alasan template, bukan layout:

- Jika transisi ditaruh di `katalog/layout.tsx`, layout dipertahankan saat
  navigasi `/katalog` → `/katalog/1` sehingga `useEffect` timer di
  `KatalogTransition` tidak berjalan ulang dan pintu geser tidak terlihat lagi.
- Jika ditaruh di `katalog/template.tsx`, Next.js merendernya sebagai
  `<Template key="/katalog">` lalu `<Template key="/katalog/1">` sehingga
  komponen dilepas dan dipasang ulang; `useEffect` berjalan ulang dan animasi
  selalu tampil. Perilaku `key` per segmen ini didokumentasikan pada
  `template.md` ("Templates receive a unique key ... They remount when that
  segment changes").
- Konsekuensinya, `katalog/page.tsx` tidak lagi merender `<KatalogTransition/>`
  secara langsung (dihapus pada perubahan ini) agar animasi tidak ganda.
  Keputusan ini dapat diverifikasi: pindah dari `/katalog/2` ke `/katalog/3`
  memutar ulang loader, sedangkan sub-navigasi katalog di `katalog/layout.tsx`
  tetap tanpa kedip karena layout dipertahankan.

---

## 5. Server Component vs Client Component

Aturan pilih (`05-server-and-client-components.md`):

- Butuh `useState`/`useEffect`/event handler (`onClick`, `onChange`), lifecycle,
  atau API browser (`window`, `localStorage`) → Client (`"use client"`).
- Butuh ambil data dekat sumber, sembunyikan secret, kurangi JS ke browser,
  atau render statis cepat → Server (default, tanpa direktif).

| Komponen | Berkas | Jenis | Alasan |
| --- | --- | --- | --- |
| `Bagian` | `component/Bagian.tsx` | Server Component | Murni presentasional: hanya menerima `id/judul/eyebrow/deskripsi/children` dan merender `<section>`. Tidak ada hook, handler, atau API browser. Dibiarkan tanpa `"use client"` agar tidak menambah bundle klien. Dipakai oleh `/`, `/katalog`, dan `/tentang` yang semuanya Server Page. |
| `DaftarItem` | `component/DaftarItem.tsx` | Client Component | Memakai `useState` untuk `kataKunci` dan `filter`, handler `onChange`/`onClick`, dan komputasi `hasil` saat interaksi. Tanpa `"use client"` di baris 1, state filter/pencarian tidak mungkin hidup. Menerima `items` serializable dari Server Page (`katalog/page.tsx`) sebagai props — pola resmi "pass data via props" pada panduan tersebut. |
| `KartuItem` | `component/KartuItem.tsx` | Client Component | Memakai `useState` `showDetail` untuk expand/collapse telemetri dan `onClick` pada `<article>`, plus `next/link` ke `/katalog/{id}` dengan `stopPropagation` agar klik tautan tidak ikut toggle. ASCII art dan metrik hanya data render, tetapi interaktivitas memaksanya menjadi klien. Diimpor oleh `DaftarItem` (klien) dan `ItemTerbaru` (klien), sehingga batas kliennya konsisten. |

Komponen yang sengaja **tidak** dipilih tetapi relevan sebagai bukti batas:

- `SiteHeader` tetap Server (hanya `next/link`, tanpa hook) sehingga navigasi
  utama tidak menambah JS.
- `Hero`, `About`, `Contact`, `ItemTerbaru`, `KatalogTransition` adalah Client
  karena memakai `useState`/`useEffect`/`useRef`, timer, fetch browser ke
  `/data/item.json`, atau animasi pointer. Rincian ini konsisten dengan direktif
  `"use client"` pada baris pertama masing-masing berkas.

---

## 6. Bukti pengujian

### 6.1 Perintah verifikasi dan lingkungan

```text
PS> node -v
v26.1.0

PS> npm -v
12.1.0

PS> git --version
git version 2.56.0.windows.2

PS> npx next --version
Next.js v16.4.0
```

```text
PS> npm run lint
> week-3@0.1.0 lint
> eslint
(exit 0, tanpa galat)
```

Perbaikan lint yang dilakukan sebelum bukti ini diambil: teks `// ...` yang
diawali garis miring ganda dibungkus sebagai ekspresi (`{`// ...`}`) pada
`DaftarItem`, `KartuItem`, dan `KatalogTransition`, serta tanda kutip di sekitar
kata kunci diganti `&quot;`. Tanpa perbaikan ini `npm run lint` keluar dengan
5 galat (`react/jsx-no-comment-textnodes`, `react/no-unescaped-entities`).

### 6.2 Keluaran `npm run build` (disingkat pada baris kompilasi)

```text
PS> npm run build
▲ Next.js 16.4.0 (Turbopack)
- Cache Components enabled
- Partial Prefetching enabled

  Creating an optimized production build ...
✓ Compiled successfully in 28.2s
  Running TypeScript ...
  Finished TypeScript in 25.6s ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/12) ...
✓ Generating static pages using 7 workers (12/12) in 3.1s
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /katalog
├   /katalog/[id]
│ ├ ◐ /katalog/[id]
│ ├ ○ /katalog/1
│ ├ ○ /katalog/2
│ └ ◐ [+3 more paths]
└ ○ /tentang

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

Pembacaan:

- `/`, `/katalog`, `/tentang`, `/_not-found` adalah `○` (statis).
- `/katalog/[id]` memiliki 5 path prerender (`1`, `2`, +3 lagi = `3`, `4`, `5`)
  sesuai `generateStaticParams`, plus entri fallback dinamis `◐ /katalog/[id]`.
- Tidak ada galat TypeScript. Peringatan `package-lock.json` di luar repositori
  (`C:\Users\Kool`) tetap muncul dan tidak memengaruhi rute; dicatat apa adanya
  seperti pada Modul 1.

### 6.3 Hasil uji server produksi (`npm run start`)

Server dijalankan dengan `npm run start -- --port 3111` (pengujian kedua dan
ketiga memakai port 3112/3113 untuk isolasi). Tabel di bawah adalah keluaran
`curl.exe -s -o NUL -w "%{http_code} %{size_download}"` yang sebenarnya:

| URL | HTTP | Byte | Verifikasi isi |
| --- | --- | --- | --- |
| `/` | 200 | 29508 | Memuat `Hero`, `About`, `Contact`; header `ASCII // SMART CAMPUS` |
| `/katalog` | 200 | 32229 | Memuat `DATABASE SYNCED`, `Daftar Node & Perangkat`, `DaftarItem` |
| `/katalog/1` | 200 | 21173 | `<title>Rerata Suhu (#1) \| Smart Campus</title>`, kartu `params.id = "1"` |
| `/katalog/2` | 200 | 8240 (RSC, lihat catatan) | `<title>Status Kipas Angin (#2)`, `params.id = "2"`, status `STANDBY / HEMAT DAYA` |
| `/tentang` | 200 | 19802 | Judul `Tentang Smart Campus Telemetry`, tiga pilar, tautan ke `/katalog/1` |
| `/katalog/0` | 200 + fallback 404 | 21252 | UI segmen `NODE TIDAK DITEMUKAN`, digest `NEXT_HTTP_ERROR_FALLBACK;404` |
| `/katalog/999` | 200 + fallback 404 | 21258 | UI segmen identik dengan `/katalog/0` |
| `/katalog/abc` | 200 + fallback 404 | 21258 | UI segmen identik; `<title>` fallback `Node tidak ditemukan` |

Header pembeda (ringkas dari `curl -s -D -`):

```text
# Sah: /katalog/1
HTTP/1.1 200 OK
x-nextjs-cache: HIT
x-nextjs-prerender: 1
Cache-Control: s-maxage=31536000
ETag: "91gr1xyttogbx"

# Tak sah: /katalog/abc
HTTP/1.1 200 OK
x-nextjs-prerender: 1
x-nextjs-postponed: 1
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
```

Hasil ini membuktikan cabang validasi bekerja: id sah menyajikan konten node
dengan cache prerender, id tak sah menyajikan template `not-found` segmen
dengan penanda `noindex` dan digest 404.

### 6.4 Tangkapan layar dan cara reproduksi

Pengujian visual dilakukan manual pada browser (Chrome/Edge) terhadap server
produksi di atas:

1. Buka `http://localhost:3111/` — verifikasi slider Before/After dapat
   digeser, preset `01 / Suhu & RH` menampilkan matriks `GKU-3 CLIMATE`.
2. Buka `http://localhost:3111/katalog` — ketik `ac` pada pencarian, pastikan
   daftar menyusut; klik filter `03 / ENERGI`, pastikan hanya `Status AC`
   tampil; klik `Buka halaman detail →` pada kartu pertama, pastikan pindah ke
   `/katalog/1` dan transisi pintu hijau diputar ulang.
3. Buka `http://localhost:3111/katalog/1` lalu navigasi ke `/katalog/5` lewat
   tautan `NODE_SEKATEGORI` — pastikan template me-remount (loader muncul lagi)
   sedangkan sub-navigasi katalog tidak berkedip (layout dipertahankan).
4. Buka `http://localhost:3111/katalog/abc` — pastikan yang tampil adalah panel
   amber `[ERR 404] NODE TIDAK DITEMUKAN` dengan tombol `Kembali ke Katalog`,
   bukan kartu telemetri.

Tangkapan layar browser tidak dibundel sebagai berkas terpisah pada dokumen ini;
sebagai gantinya penilai dapat mereproduksi keempat langkah di atas dalam waktu
kurang dari 5 menit dari folder `week-3` dengan dua perintah (`npm run build`,
`npm run start -- --port 3111`). Keluaran perintah pada 6.1–6.3 adalah bukti
yang dapat disalin-tempel dan diverifikasi ulang.

---

## 7. Penjelasan keputusan teknis

1. **Empat rute dengan satu dinamis, bukan lebih.** Syarat modul adalah minimal
   empat termasuk satu dinamis. Peta pada Bagian 1 memakai tepat empat rute
   publik agar setiap baris tabel dapat dibuktikan oleh satu berkas `page.tsx`
   dan satu baris output build. Menambah rute fiktif tanpa berkas hanya akan
   merusak ketepatan teknis.
2. **Segmen dinamis `[id]` berbasis `id` numerik string dari `lib/data.ts`.**
   Sumber inventaris hanya punya 5 entri dengan `id: 1–5`. Memakai slug bebas
   akan butuh sumber data baru dan validasi tambahan. Aturan `String(id)`
   dipilih agar konsisten dengan `generateStaticParams` dan menghindari koersi
   (`"01"` tetap tak sah).
3. **`generateStaticParams` + `notFound()` eksplisit.** `generateStaticParams`
   membuat 5 halaman diprerender (hemat runtime, terbukti `x-nextjs-cache: HIT`
   untuk `/katalog/1`). Pemeriksaan `if (!item) notFound()` tetap ditulis agar
   id di luar daftar tidak membocorkan halaman kosong, melainkan masuk ke
   `not-found.tsx` segmen dengan pesan yang menjelaskan rentang sah.
4. **Layout bersarang hanya untuk `katalog/`.** Akar (`/`) dan `/tentang` tidak
   butuh sub-navigasi inventaris. Menaruh sub-navigasi di root layout akan
   mencemari semua halaman; menaruhnya di `katalog/layout.tsx` membatasi
   cakupannya pada `/katalog` dan `/katalog/[id]` sesuai prinsip nesting.
5. **Template khusus untuk transisi, bukan layout.** Lihat Bagian 4. Alternatif
   yang dipertimbangkan adalah memicu animasi manual lewat `usePathname`, tetapi
   itu menambah state dan efek yang rapuh. Memakai semantik bawaan `template`
   (remount per segmen) lebih sedikit kode dan didukung dokumentasi resmi.
6. **`tentang` sebagai Server Page statis.** Halaman ini tidak butuh interaksi,
   sehingga tidak diberi `"use client"`. Keuntungannya: nol JS tambahan, dapat
   di-cache sebagai `○`, dan menjadi contoh kontras yang jelas terhadap pulau
   klien di `/katalog`.
7. **Batas Server/Client pada Bagian 5.** `Bagian` dan `SiteHeader` dibiarkan
   server agar shell cepat; `DaftarItem`/`KartuItem` dijadikan klien karena
   state lokalnya tidak bisa diangkat ke server tanpa menjadikan seluruh
   katalog dinamis. Pola "Server Page memberi props ke Client island" dipakai
   agar data (`listItem`) tetap diimpor di server dan hanya potongan interaktif
   yang dikirim sebagai JS.
8. **Perbaikan lint sebelum klaim bukti.** Lima galat JSX diperbaiki dahulu
   karena dokumen yang mengklaim `npm run lint` lolos padahal gagal akan
   langsung menggugurkan ketepatan teknis. Perbaikan bersifat mekanis (escape
   teks) dan tidak mengubah perilaku.

---

## 8. Pencatatan pemanfaatan AI

### 8.1 Ringkasan

Dokumen ini, rute `/tentang`, rute `/katalog/[id]`, `katalog/layout.tsx`,
`katalog/template.tsx`, `not-found.tsx`, dan tautan detail pada `KartuItem`
disusun dengan bantuan agen AI (OpenCode, model Muse Spark 1.3 Free).
AI menulis draf kode dan kerangka dokumen; seluruh klaim diverifikasi manual
dengan perintah dan pembacaan dokumentasi Next.js yang dibundel proyek sebelum
dianggap final.

### 8.2 Alat dan sumber yang digunakan

| Alat/sumber | Peran | Catatan |
| --- | --- | --- |
| OpenCode (agen AI) | Draf kode rute, layout, template, dan dokumen ini | Model Muse Spark 1.3 Free |
| `node_modules/next/dist/docs/01-app/...` | Sumber kebenaran istilah: `03-layouts-and-pages.md`, `template.md`, `layout.md`, `dynamic-routes.md`, `05-server-and-client-components.md` | Dibaca langsung sebelum menulis kode, sesuai `AGENTS.md` |
| `npm run lint` / `npm run build` / `npm run start` + `curl.exe` | Verifikasi perilaku | Keluaran disalin apa adanya ke Bagian 6 |
| Editor + `git` | Perbaikan manual dan commit | Lihat 8.4 |

### 8.3 Bagian yang dihasilkan AI vs ditulis manual

| Bagian | Peran AI | Peran manusia |
| --- | --- | --- |
| `tentang/page.tsx`, `katalog/[id]/page.tsx`, `katalog/layout.tsx`, `katalog/template.tsx`, `not-found.tsx` | Draf awal | Menyesuaikan isi dengan `lib/data.ts` (5 node), menghapus duplikasi `KatalogTransition`, menambah tautan detail + `stopPropagation`, menambah `Tentang` ke navigasi root |
| Bagian 1–5 dokumen | Draf tabel dan penjelasan | Memeriksa setiap nama berkas terhadap pohon aktual, mencocokkan istilah dengan berkas docs Next.js, menulis ulang klaim status HTTP agar sesuai hasil `curl` (200 + fallback, bukan 404) |
| Bagian 6 | Format tabel | Menjalankan sendiri `lint/build/start/curl`, menyalin angka byte dan header, mencatat anomali status 200 pada fallback |
| Perbaikan lint 5 galat | Diusulkan AI | Diterapkan dan diuji ulang hingga `lint` exit 0 |

Yang **tidak** diserahkan ke AI:

- Keputusan peta rute akhir (4 rute + fallback) dan aturan `String(id)`.
- Klaim angka pengujian — semuanya dari perintah yang benar-benar dijalankan.
- NIM, tanggal, dan tautan repositori (diisi manual).

### 8.4 Cara verifikasi (dapat diulang penilai)

| Klaim | Cara verifikasi | Hasil yang diharapkan |
| --- | --- | --- |
| Struktur folder benar | `Get-ChildItem src/app -Recurse` dari `week-3` | Pohon sama dengan Bagian 2 |
| Kode bersih | `npm run lint` | Exit 0 |
| Rute terdaftar dan tipe benar | `npm run build` | Tabel rute sama dengan Bagian 6.2 (`○ /`, `○ /katalog`, `○ /tentang`, `○ /katalog/1` + `+3 more paths`) |
| Halaman sah tersaji | `npm run start -- --port 3111`, lalu `curl.exe -s http://localhost:3111/katalog/1` | Mengandung `Rerata Suhu` dan `params.id = "1"` |
| Halaman tak sah menampilkan 404 segmen | `curl.exe -s http://localhost:3111/katalog/abc` | Mengandung `NODE TIDAK DITEMUKAN` dan `NEXT_HTTP_ERROR_FALLBACK;404` |
| Template me-remount | Buka `/katalog` → klik detail → amati loader hijau muncul lagi; bandingkan sub-nav yang tidak berkedip | Sesuai Bagian 4 |
| Istilah layout/template/params sesuai resmi | Buka berkas docs yang dirujuk pada pengantar dokumen | Definisi cocok dengan Bagian 4–5 |

Keterbatasan yang diketahui: pengujian visual langkah 6.4 dilakukan manual dan
tidak menyertakan berkas PNG terpisah; penilai dapat mengulanginya dalam 5
menit dengan perintah di atas. Anomali status HTTP pada fallback (200 luar /
404 dalam) dicatat apa adanya dan tidak disembunyikan.

---

## Lampiran A: Daftar berkas yang diubah/ditambah untuk Modul 3

| Berkas | Status | Isi |
| --- | --- | --- |
| `src/app/tentang/page.tsx` | Baru | Halaman statis `/tentang` |
| `src/app/katalog/layout.tsx` | Baru | Layout bersarang katalog |
| `src/app/katalog/template.tsx` | Baru | Template transisi katalog |
| `src/app/katalog/[id]/page.tsx` | Baru | Rute dinamis + `generateStaticParams` + `notFound()` |
| `src/app/katalog/[id]/not-found.tsx` | Baru | 404 segmen katalog |
| `src/app/not-found.tsx` | Baru | 404 global |
| `src/app/katalog/page.tsx` | Ubah | Hapus `KatalogTransition` langsung (pindah ke template) |
| `src/app/layout.tsx` | Ubah | Tambah tautan `Tentang` |
| `component/KartuItem.tsx` | Ubah | Tambah tautan detail + perbaikan lint `//` |
| `component/DaftarItem.tsx` | Ubah | Perbaikan lint `//` dan `&quot;` |
| `component/KatalogTransition.tsx` | Ubah | Perbaikan lint `//` |
| `docs/praktikum/modul-03.md` | Baru | Dokumen ini |

## Lampiran B: Tautan pengumpulan

| | |
| --- | --- |
| Berkas dokumen | `https://github.com/tokyokoolkar-sys/prak-web/blob/main/week-3/docs/praktikum/modul-03.md` |

> Tautan berlaku setelah commit pada Bagian H didorong ke branch `main`.
