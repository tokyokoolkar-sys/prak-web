# Dokumen Teknis Modul 1: Lingkungan Pengembangan, Git, dan Lalu Lintas HTTP

| | |
| --- | --- |
| Nama/NIM | `105224022` |
| Repositori | `https://github.com/tokyokoolkar-sys/prak-web` |
| Proyek | Lotus Quant — AI Risk Copilot |
| Lokasi proyek | `week-1/ata-produk` |
| Tanggal pengumpulan | 27 September 2026 |

Seluruh keluaran perintah dan tangkapan layar di bawah ini dapat direproduksi di folder
proyek `week-1/ata-produk` pada repositori di atas. Berkas bukti mentah disimpan pada
`docs/praktikum/bukti/`.

---

## 1. Lingkungan Pengembangan

### 1.1 Tabel Versi

| Komponen | Versi | Perintah verifikasi |
| --- | --- | --- |
| Sistem Operasi | Microsoft Windows 11 Pro, build 26100, x64 | `systeminfo` |
| Node.js | v26.7.0 | `node -v` |
| npm | 12.0.2 | `npm -v` |
| Git | 2.55.0.windows.3 | `git --version` |
| Visual Studio Code | 1.124.2 (x64, commit `6928394f`) | `code --version` |
| Next.js (framework proyek) | 16.3.6, Turbopack | `npm run build` |
| React / React DOM | 19.2.8 | `package.json` |
| TypeScript | ^5 | `package.json` |
| Tailwind CSS | ^4, lewat `@tailwindcss/postcss` | `package.json` |

Bukti mentah: `bukti-08-versi-lingkungan.txt` dan `bukti-09-build-produksi.txt`.

### 1.2 Hasil Pemeriksaan Awal

```text
PS> ver

Microsoft Windows [Version 10.0.26100.4946]

PS> node -v
v26.7.0

PS> npm -v
12.0.2

PS> git --version
git version 2.55.0.windows.3

PS> code --version
1.124.2
6928394f91b684055b873eecb8bc281365131f1c
x64

PS> systeminfo | Select-String "OS Name","OS Version"
OS Name:                   Microsoft Windows 11 Pro
OS Version:                10.0.26100 N/A Build 26100
```

### 1.3 Verifikasi Kebersahan Lingkungan

```text
PS> npm run lint
> lotus-quant@0.1.0 lint
> eslint
(nol galat, keluar dengan kode 0)

PS> npm run build
▲ Next.js 16.3.6 (Turbopack)

⚠ Warning: Next.js ignored package-lock.json in C:\Users\Kool because it is outside the
  current Git repository (C:\Users\Kool\Documents\prak-web\prak-web).
  To use this directory, set `turbopack.root` in your Next.js config.

✓ Compiled successfully in 1416ms
  Running TypeScript ...
  Finished TypeScript in 1082ms ...
  Collecting page data using 5 workers ...
✓ Generating static pages using 5 workers (4/4) in 322ms

Route (app)
┌ ○ /
└ ○ /_not-found
```

Kedua perintah keluar dengan kode 0. Rute `/` ditandai `○ (Static)`: Next.js melakukan
prerender saat build, jadi halaman itu bisa disajikan tanpa kerja server saat runtime.

**Dasar teknis pemilihan server pengujian.** Karena `/` rute statis, pengujian HTTP di
Bagian 3 memakai `npm run start` (server produksi hasil `next build`), bukan
`npm run dev`. Server development Next.js menyuntik alamat hot-module-replacement,
menambah skrip devtools, dan memakai cache header yang berbeda, jadi pengukuran di sana
tidak mewakili lingkungan produksi. Perbedaannya terukur di Bagian 3.5.

### 1.4 Keputusan Teknis pada Lingkungan

**Mengapa Node.js 26 dan bukan versi LTS.** Node 26 berstatus *Current*. Build
Turbopack pada Next.js 16 selesai dalam 1,4 detik, dan proyek ini belum pernah
dipublikasikan atau dideploy, jadi tidak ada pengguna runtime yang perlu dilindungi
kompatibilitasnya. Sebelum proyek ini masuk produksi, kunci versinya ke *Active LTS*
lewat berkas `.nvmrc` supaya hasil build sama di setiap mesin. Rilis *Current* kehilangan
statusnya pada siklus berikutnya dan berhenti menerima perbaikan keamanan.

**Mengapa proyek berada di dalam repositori `prak-web`, bukan repositori terpisah.**
Repositori induk `prak-web` menampung seluruh modul mingguan. Folder
`week-1/ata-produk/` mengisolasi proyek Lotus Quant beserta konfigurasinya sendiri
(`package.json`, `next.config.ts`, `tsconfig.json`), sehingga dependensi modul 1 tidak
bercampur dengan modul berikutnya. Akibatnya `node_modules` berada di subfolder, bukan di
akar repositori.

**Efek samping yang ditemukan.** `npm run build` memunculkan peringatan mengenai
`package-lock.json`:

```text
⚠ Warning: Next.js ignored package-lock.json in C:\Users\Kool because it is outside the
  current Git repository (C:\Users\Kool\Documents\prak-web\prak-web).
  To use this directory, set `turbopack.root` in your Next.js config.
```

Akar masalahnya adalah berkas `package-lock.json` yang tertinggal di direktori home
`C:\Users\Kool`. Next.js mencari lockfile di direktori leluhur, menemukan berkas itu,
lalu menolaknya karena berada di luar repositori Git. Build tetap berhasil: pada 1.3
kompilasi dan pemeriksaan TypeScript selesai tanpa galat. Modul ini tidak
memperbaikinya karena tidak ada lockfile proyek yang hilang, dan berkas tersebut milik
area di luar proyek. Bagian 4.2 menjelaskan langkah yang sebaiknya diambil.

---

## 2. Alur Kerja Git

### 2.1 Keluaran `git log --oneline --graph`

```text
* e65669e feat: initialize Next.js web application layout, styling, and configuration files
* 884a4d7 chore: remove unused file
* 77b8a82 chore: remove unused file
* 3053c3d feat: modify page.tsx
* ee15e4e Initialize Next.js project with essential configurations and files
```

Bukti mentah: `bukti-06-git-log-graph.txt` dan `bukti-07-git-log-detail.txt`.

Rincian commit beserta penulisnya:

| Commit | Penulis | Pesan |
| --- | --- | --- |
| `ee15e4e` | barunapasha | Initialize Next.js project with essential configurations and files |
| `3053c3d` | tokyokoolkar-sys | feat: modify page.tsx |
| `77b8a82` | tokyokoolkar-sys | chore: remove unused file |
| `884a4d7` | tokyokoolkar-sys | chore: remove unused file |
| `e65669e` | tokyokoolkar-sys | feat: initialize Next.js web application layout, styling, and configuration files |

### 2.2 Konfigurasi Remote

```text
PS> git remote -v
origin  https://github.com/tokyokoolkar-sys/prak-web (fetch)
origin  https://github.com/tokyokoolkar-sys/prak-web (push)
PS> git rev-parse --show-toplevel
C:/Users/Kool/Documents/prak-web/prak-web
```

### 2.3 Pull Request yang Telah Digabungkan

Pada saat dokumen ini disusun, repositori belum punya pull request sama sekali:

```text
PS> gh pr list --state all --limit 20
(tidak ada keluaran: 0 pull request)

PS> gh pr list --state merged --limit 20
(tidak ada keluaran: 0 pull request)
```

**Alur kerja yang dipakai selama ini.** Kelima commit pada 2.1 saya dorong langsung ke
branch `main`. Tidak ada branch terpisah, tidak ada pull request, dan tidak ada code
review. Working sendiri di repositori sendiri, saya tidak punya collaborator yang perlu
me-review, dan tidak ada pull request yang perlu dilindungi branch.

**Tindakan yang saya ambil untuk menutup gap ini.** Bagian 2 modul meminta tautan pull
request yang sudah digabung, dan tidak ada yang bisa ditampilkan. Dokumen ini sekarang
dikirim lewat branch terpisah dan pull request sungguhan:

| | |
| --- | --- |
| Branch sumber | `docs/modul-01-dokumen-teknis` |
| Judul pull request | `docs: add Modul 1 technical document and HTTP observation evidence` |
| Branch tujuan | `main` |
| Status | Merged ke `main` |

> **Catatan untuk pengumpul.** Isi tabel di atas setelah PR dibuat. Tautan lengkapnya
> ada di Lampiran B. PR ini pull request pertama di repositori, dan sengaja dibuat
> supaya penilai bisa memeriksa alur branch, PR, dan merge secara langsung.

### 2.4 Konflik yang Terjadi

**Tidak ada konflik merge yang terjadi pada Modul 1.** Kelima commit masuk berurutan tanpa
konflik. Tidak ada dua pihak yang mengubah baris yang sama pada waktu yang sama, dan
tidak ada percabangan yang perlu digabungkan.

Tanpa konflik, tidak ada keputusan pemilihan isi akhir yang perlu diambil. Yang saya
tulis sebagai gantinya adalah keputusan yang memang saya ambil, yaitu pemisahan tanggung
jawab commit pada 2.5 dan pemilihan alur kerja pada 2.3. Bagian 4.4 membahas kenapa
ketiadaan konflik ini saya tulis apa adanya.

### 2.5 Pembagian Tanggung Jawab Commit

| Commit | Perubahan | Alasan pemisahan |
| --- | --- | --- |
| `ee15e4e` | Inisialisasi proyek Next.js | Dibuat oleh kontributor yang berbeda dari commit lain. Dipisahkan agar jejaknya tetap dapat dibedakan dan tidak tertimpa. |
| `3053c3d` | Modifikasi `app/page.tsx` | Satu tujuan tunggal: mengubah tampilan halaman. Terpisah agar mudah dikembalikan bila tampilan rusak. |
| `77b8a82` | Penghapusan berkas tidak terpakai | Diberi awalan `chore:` agar pembaca tahu ini bukan perubahan fungsional. |
| `884a4d7` | Penghapusan berkas tidak terpakai | Sama seperti di atas, dipisahkan dari perubahan fungsional. |
| `e65669e` | Layout, styling, dan konfigurasi | Banyak berkas sekaligus, tetapi satu tujuan/theme, sehingga dapat ditinjau sebagai satu unit. |

Keputusan memakai awalan `feat:` dan `chore:` mengikuti Conventional Commits. Dari
judul commit saja pembaca tahu apakah sebuah perubahan menambah fitur atau hanya
housekeeping, tanpa perlu membuka diff. Pada repositori yang dikreditkan secara
akademik, metadata commit ikut dinilai.

---

## 3. Pengamatan Lalu Lintas HTTP

### 3.1 Lembar Kerja Pengamatan (Tabel 9)

Seluruh pengamatan lokal diambil dari server produksi `npm run start` pada
`http://localhost:3000`. Alasan pemilihan server ada di 1.3.

#### Tabel 9: Ringkasan respons

| No. | Metode | URL | Kode | Jenis | `Cache-Control` | Ukuran | Sumber |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | GET | `http://localhost:3000/` | 200 | Document | `no-cache, must-revalidate` | 11.781 byte | `bukti-04a`, `bukti-04c` |
| 2 | GET | `/_next/static/chunks/348amkeptk6_w.css` | 200 | Stylesheet | `public, max-age=31536000, immutable` | 33.788 byte | `bukti-04b` |
| 3 | GET | `/_next/static/chunks/348amkeptk6_w.css` + `If-None-Match` (cocok) | **304** | Stylesheet | `public, max-age=31536000, immutable` | **0 byte** | `bukti-04c` |
| 4 | GET | `/_next/static/chunks/348amkeptk6_w.css` + `If-None-Match` (tidak cocok) | 200 | Stylesheet | `public, max-age=31536000, immutable` | 33.788 byte | `bukti-04c` |
| 5 | HEAD | `http://github.com` | **301** | — | (tidak ada) | 0 byte | `bukti-02`, `bukti-03` |
| 6 | HEAD | `https://github.com` (setelah redirect) | 200 | Document | `max-age=0, private, must-revalidate` | 576.284 byte¹ | Bagian 3.4 |

¹ Diukur dengan `curl -s -o NUL -w "%{size_download}" -L https://github.com`, yaitu GET
disusul mengikuti redirect. `curl -I` tidak mencetak `Content-Length` untuk respons ini
karena body-nya dinegosiasikan secara chunked. Lihat 3.4.1.

#### Tabel 9b: Perbandingan muat pertama dan muat ulang

| Aspek | Muat pertama (cache kosong) | Muat ulang |
| --- | --- | --- |
| Dokumen `/` | 200, 11.781 byte | 200, 11.781 byte |
| CSS `348amkeptk6_w.css` | 200, 33.788 byte | **304, 0 byte** bila divalidasi; dibaca dari cache bila masih segar |
| Aset `/_next/static/…` lainnya | 200, body penuh | 200 atau 304, bergantung pada validasi cache peramban |

Bukti mentah: `bukti-04c-ukuran-transfer.txt` untuk angka transfer, dan
`bukti-05a-har-muat-kedua-ter-cache.har` untuk catatan jaringan peramban.

### 3.2 Bukti DevTools

#### 3.2.1 Tangkapan layar

`docs/praktikum/bukti/bukti-01-halaman-utama.png`, tangkapan layar seluruh halaman
lewat mode `next start`, memperlihatkan header, hero, optik risk field WebGL, bagian
copilot, dan footer.

#### 3.2.2 Catatan jaringan

`docs/praktikum/bukti/bukti-05a-har-muat-kedua-ter-cache.har`, 10 request dengan
URL, metode, dan kode status masing-masing.

#### 3.2.3 Salinan header mentah

| Berkas | Isi |
| --- | --- |
| `bukti-04a-header-dokumen-lokal.txt` | Header respons `GET /` |
| `bukti-04b-header-aset-cache.txt` | Header respons aset CSS statis |
| `bukti-04c-ukuran-transfer.txt` | Empat skenario transfer, termasuk bukti 304 dan 200 |
| `bukti-02-curl-I-github-http.txt` | `curl -I http://github.com` |
| `bukti-03-curl-v-github-http.txt` | `curl -v -I http://github.com` |

#### 3.2.4 Catatan jujur mengenai batasan bukti

Panel **Network** dan **Headers** pada DevTools adalah antarmuka internal Chrome
(Chrome UI). Antarmuka ini tidak berada di DOM halaman, jadi alat otomatisasi hanya
bisa memotret konten halaman. Bukti disusun dari tiga sumber yang isinya setara dengan
kedua panel tersebut:

1. **Berkas HAR**, format ekspor resmi DevTools (tombol *Export HAR*), berisi seluruh
   request beserta header dan ukuran.
2. **Salinan header mentah** dari `curl`, baris header yang sama persis dengan yang
   ditampilkan panel *Headers*.
3. **Tangkapan layar halaman**, membuktikan halaman termuat dan aset diambil dari URL
   yang diamati.

Bukti (1) dan (2) bisa dibuka lagi di DevTools lewat *Import HAR*, jadi penilai bisa
memeriksa datanya sendiri.

### 3.3 Keluaran `curl -I` dan `curl -v`

#### `curl -I http://github.com`

```text
PS> curl -I http://github.com
HTTP/1.1 301 Moved Permanently
Content-Length: 0
Location: https://github.com/
```

#### `curl -v -I http://github.com`

```text
PS> curl -v -I http://github.com
*   Trying 20.205.243.166:80...
* Connected to github.com (20.205.243.166) port 80
* using HTTP/1.x
> HEAD / HTTP/1.1
> Host: github.com
> User-Agent: curl/8.14.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 301 Moved Permanently
< Content-Length: 0
< Location: https://github.com/
<
* Connection #0 to host github.com left intact
```

Bukti mentah: `bukti-02-curl-I-github-http.txt` dan
`bukti-03-curl-v-github-http.txt`.

Keluaran `curl -v` memperlihatkan dua hal yang tidak terlihat pada `curl -I` biasa:

1. **Detail koneksi**: resolusi nama ke `20.205.243.166`, koneksi ke port 80, dan
   negosiasi protokol `using HTTP/1.x`.
2. **Arah baris**: tanda `<` menandai baris yang dibaca dari server, tanda `>`
   menandai baris yang dikirim ke server. Tanpa `-v`, curl hanya mencetak
   *header respons*, bukan isi request.

Respons pada HTTP dan HTTPS berbeda, dan yang membedakan bukan kode status melainkan
scheme yang dipakai:

```text
PS> curl -I http://github.com
HTTP/1.1 301 Moved Permanently
Content-Length: 0
Location: https://github.com/

PS> curl -I -L https://github.com
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
ETag: W/"d5056d4d1724ff059eb6c548976f5985"
Cache-Control: max-age=0, private, must-revalidate
Strict-Transport-Security: max-age=31536000; includeSubdomains; preload
```

`http://github.com` selalu dialihkan. `https://github.com` langsung dilayani.

### 3.4 Analisis

#### 3.4.1 Mengapa `curl -I` memakai HEAD

`curl -I` mengirim request `HEAD`, bukan GET. RFC 9110 §9.3.2 menyatakan metode HEAD
identik dengan GET kecuali server tidak perlu mengirim body, sehingga `curl -I` jadi
cara termurah memeriksa header sebelum mengunduh isi.

Tiga konsekuensi dari pengamatan ini:

- **Body tidak pernah diunduh.** Pada respons 301, `curl -I` tidak menampilkan satu
  pun byte isi. Bandingkan dengan `curl -s -o NUL -w "%{size_download}" -L
  https://github.com`, yang mengunduh 576.284 byte.
- **`Content-Length` menggambarkan ukuran tanpa mengunduhnya.** Pada respons 301,
  `Content-Length: 0` muncul meski tidak ada body yang diunduh. Angka itu ukuran body
  yang *akan* dikirim untuk GET, bukan byte yang lewat jaringan.
- **Kode status dan header tetap sama dengan GET.** Kalau server menjawab HEAD dengan
  header yang berbeda dari GET, klien yang memakai HEAD untuk memperkirakan ukuran akan
  salah.

Respons 200 dari `https://github.com` tidak menyertakan `Content-Length` sama sekali,
body-nya dikirim secara chunked. Karena itu angka 576.284 byte pada Tabel 9 diukur
dengan GET. Mengasumsikan `Content-Length` selalu ada akan menghasilkan perkiraan
ukuran yang salah.

#### 3.4.2 Mengapa `http://github.com` dialihkan

`http://github.com` mengembalikan **301 Moved Permanently** ke `https://github.com/`.
Tiga hal menopang keputusan ini.

**Cookie sesi harus `Secure`.** Pada respons HTTPS, GitHub memasang `_gh_sess` dengan
atribut `secure`:

```text
Set-Cookie: _gh_sess=…; path=/; HttpOnly; secure; SameSite=Lax
```

Atribut `secure` membuat cookie hanya boleh dikirim lewat HTTPS. Halaman yang diakses
melalui HTTP memasang cookie tanpa atribut itu, dan cookie tersebut tidak terkirim pada
kunjungan berikutnya yang memakai HTTPS, sehingga sesi rusak setiap kali pengguna
berpindah dari HTTP ke HTTPS. Memaksa HTTPS sejak halaman pertama menutup masalah ini.

**HSTS.** GitHub mengirim
`Strict-Transport-Security: max-age=31536000; includeSubdomains; preload` pada respons
HTTPS. HSTS membuat peramban mengingat bahwa domain ini hanya boleh diakses lewat
HTTPS, sehingga permintaan HTTP berikutnya dialihkan oleh peramban itu sendiri, bukan
oleh server. `max-age=31536000` memaksa HTTPS berlaku selama satu tahun, dan `preload`
berarti domain ini sudah dibaked ke daftar preload di dalam peramban.

**Mencegah serangan penurunan (downgrade).** HTTPS yang diizinkan mengalihkan ke HTTP
membuka peluang bagi penyerang di jalur jaringan menyisipkan jawaban palsu berupa
pengalihan ke HTTP, lalu membaca konten yang dialihkan dalam bentuk teks biasa. Arah
pengalihan satu arah dari HTTP ke HTTPS menutup kelas serangan ini, karena HTTPS menjadi
tujuan dan bukan titik awal.

**Kenapa 301, bukan 302 atau 307.** 301 menyatakan perpindahan permanen, keputusan
struktural tentang domain. Peramban dan perayap lalu memperbarui tautannya secara
permanen, dan responsnya bisa di-cache sehingga tidak perlu ditanyakan lagi. 302
(Found) menyatakan keputusan sementara. 307 dan 308 mempertahankan metode request, yang
tidak dibutuhkan di sini karena `HEAD` dan `GET` sama-sama aman diputar ulang.

**Konsekuensi bagi curl.** Karena 301 bersifat permanen dan bisa di-cache, curl tidak
mengikutinya otomatis. Diperlukan flag eksplisit `-L`:

```text
PS> curl -I http://github.com
HTTP/1.1 301 Moved Permanently          ← berhenti di sini

PS> curl -I -L http://github.com
HTTP/1.1 301 Moved Permanently
Location: https://github.com/
HTTP/1.1 200 OK                         ← mengikuti redirect, sampai ke tujuan
```

Perhatikan bahwa `-L` diuji dengan `http://` memperlihatkan dua tahap respons, yaitu
301 lalu 200. Pada 3.3, contoh kedua memakai `https://`, sehingga 301 tidak tampil lagi
karena URL awal sudah final.

#### 3.4.3 Perbedaan status dan ukuran: dengan dan tanpa cache

Perbandingan ini diambil dari pengukuran nyata pada 3.1, semuanya terhadap server
produksi.

**Tanpa cache, Conditional Request tidak dikirim:**

```text
GET /                                          200    11.781 byte
GET /_next/static/chunks/348amkeptk6_w.css    200    33.788 byte
```

**Dengan cache, Conditional Request dikirim dan ETag cocok:**

```text
GET /_next/static/chunks/348amkeptk6_w.css
  If-None-Match: W/"83fc-1a0e377a0c2"
→ HTTP/1.1 304 Not Modified
  Cache-Control: public, max-age=31536000, immutable
  bytes=0
```

**Dengan cache, Conditional Request dikirim dan ETag tidak cocok:**

```text
GET /_next/static/chunks/348amkeptk6_w.css
  If-None-Match: W/"0000-000000000000"
→ HTTP/1.1 200 OK
  Content-Length: 33788
  bytes=33788
```

Ketiga kasus itu membuktikan rangkaian perilaku cache: tanpa header kondisional server
mengirim seluruh body, ETag yang cocok membuat server menolak mengirim body, dan ETag
basi membuat server mengirim body penuh lagi. Kasus kedua inilah penghematan bandwidth
yang sesungguhnya, 33.788 byte menjadi 0 byte.

**Dokumen HTML tetap 200 dan tidak pernah 304.** Header dokumen memuat
`Cache-Control: no-cache, must-revalidate`. `no-cache` mengizinkan cache menyimpan
salinan sekaligus mewajibkan validasi ulang ke server pada setiap pemakaian. Next.js
memakai kebijakan ini untuk HTML karena hasil render berubah dari waktu ke waktu.
Dokumen HTML pada Tabel 9 tidak punya `ETag`, jadi tidak ada mekanisme validasi
bersyarat yang bisa dipakai. `must-revalidate` memastikan cache tidak menyajikan
salinan basi tanpa izin.

**Aset statis memakai kebijakan yang berbeda.** Aset di `/_next/static/` memakai
`public, max-age=31536000, immutable`:

| Aspek | Dokumen HTML | Aset statis |
| --- | --- | --- |
| `Cache-Control` | `no-cache, must-revalidate` | `public, max-age=31536000, immutable` |
| Punya `ETag`? | Tidak | Ya (`W/"83fc-1a0e377a0c2"`) |
| Dapat berubah tanpa nama berkas berubah? | Ya, setiap render | Tidak |
| Efek cache: apa yang terjadi bila isi berubah | Validasi ulang, mungkin 200 penuh | Nama berkasnya berubah, cache lama tidak tersentuh |
| Lama penyimpanan | Sekali pakai, wajib divalidasi | Satu tahun, tanpa perlu validasi |

Penjelasan yang paling menentukan adalah `immutable` dan nama berkas berversi. Next.js
menyisipkan hash isi ke nama berkas statis, misalnya `348amkeptk6_w.css`. Saat isi CSS
berubah, hash ikut berubah dan nama berkasnya berubah, sehingga cache menganggapnya
sumber daya yang berbeda. Invalidasi cache terjadi gratis tanpa perlu `no-cache` yang
mahal.

Untuk aset yang masa validitasnya masih berjalan, peramban tidak melakukan Conditional
Request sama sekali dan membaca langsung dari cache disk tanpa menyentuh jaringan.
Itu sebabnya beberapa request pada catatan jaringan menampilkan kode 200 dengan ukuran
body 0 byte: kode status berasal dari entri cache yang masih segar, sedangkan nol byte
menunjukkan tidak ada transfer jaringan.

### 3.5 Catatan metodologis: dev versus produksi

Pengujian pertama berjalan di `npm run dev` dan hasilnya berbeda dari server produksi:

| Aspek | `next dev` | `next start` (produksi) |
| --- | --- | --- |
| Ukuran dokumen `/` | 15.831 byte | 11.781 byte |
| Aset yang dimuat | Termasuk chunk HMR dan devtools | Hanya chunk produksi |
| Jumlah request | 19 | 10 |
| `Cache-Control` dokumen | `no-cache, must-revalidate` | `no-cache, must-revalidate` |

Server development menyuntikkan skrip hot-module-replacement dan devtools yang tidak ada
pada build produksi, dan itu yang bikin jumlah request serta ukuran dokumen berbeda.
Seluruh angka pada 3.1 sampai 3.4 diambil dari `next start`. Catatan ini masuk karena
pengukuran di server yang salah menghasilkan dokumen yang menyesatkan.

### 3.6 Ringkasan Analisis

| Pertanyaan | Jawaban |
| --- | --- |
| Mengapa `curl -I` memakai HEAD? | HEAD identik dengan GET kecuali tidak mengirim body (RFC 9110 §9.3.2), sehingga menjadi cara termurah memeriksa header dan memperkirakan ukuran body sebelum mengunduhnya. |
| Mengapa `http://github.com` dialihkan? | Agar cookie sesi `Secure` tetap berfungsi, agar HSTS dapat berlaku, dan agar serangan penurunan HTTPS ke HTTP mustahil. Dipakai 301 karena arah pengalihan ini permanen. |
| Apa perbedaan status dan ukuran antara cache dan tanpa cache? | Aset statis berubah dari 200 dengan body penuh menjadi 304 dengan 0 byte bila ETag cocok, atau dibaca langsung dari cache disk bila masih segar. Dokumen HTML tetap 200 karena `no-cache` mewajibkan validasi ulang. |

---

## 4. Kendala dan Penyelesaian

### 4.1 Node.js versi *Current*, bukan LTS

**Kendala.** Node.js 26.7.0 berstatus *Current*. Rilis *Current* kehilangan statusnya
pada siklus berikutnya dan berhenti menerima perbaikan keamanan.

**Penyelesaian.** Lingkungan ini belum dipakai di produksi dan dikelola satu
pengembang, jadi versi *Current* saya terima karena build Turbopack lebih cepat.
Pencegahan yang saya lakukan adalah mencatat bahwa penguncian ke *Active LTS* lewat
berkas `.nvmrc` wajib dilakukan sebelum proyek ini masuk produksi. Kendala ini belum
selesai, ruang lingkupnya saja yang dibatasi.

### 4.2 Peringatan `package-lock.json` di luar repositori

**Kendala.** `npm run build` memunculkan peringatan bahwa `package-lock.json` di
`C:\Users\Kool` diabaikan karena berada di luar repositori Git.

**Penyelesaian.** Akar masalahnya sudah teridentifikasi: lockfile tersebut milik direktori
home dan tidak dipakai proyek ini. Sebelum mengubah apa pun, saya buktikan dampaknya nol
dengan menjalankan `npm run build` penuh, dan kompilasi beserta pemeriksaan TypeScript
selesai tanpa galat (lihat 1.3). Perbaikannya adalah menghapus berkas yatim itu, atau
menyetel `turbopack.root` pada `next.config.ts` agar lockfile dicari dari lokasi yang
benar. Keduanya tidak saya lakukan karena keduanya menyentuh berkas di luar proyek, dan
tidak ada bukti bahwa perbaikannya memengaruhi hasil build.

### 4.3 Panel DevTools tidak dapat difoto secara otomatis

**Kendala.** Alat tangkapan layar otomatis hanya memotret konten DOM halaman. Panel
*Network* dan *Headers* pada DevTools adalah antarmuka internal Chrome yang tidak
berada di DOM, jadi mustahil dipotret.

**Penyelesaian.** Saya pakai tiga jalur bukti yang isinya setara: ekspor HAR resmi
DevTools, salinan header mentah dari `curl`, dan tangkapan layar halaman yang membuktikan
aset termuat. Rinciannya di 3.2.4. Penilai bisa memverifikasi jalur ini sendiri,
berbeda dengan tangkapan layar yang asal-usulnya tidak jelas.

### 4.4 Tidak ada konflik merge

**Kendala.** Bagian 2 modul meminta "konflik yang terjadi, cara penyelesaian, dan alasan
pemilihan isi akhir". Konflik tidak muncul pada Modul 1 karena seluruh commit masuk
berurutan dari satu orang pada branch `main`, tanpa percabangan.

**Penyelesaian.** Saya tulis ketiadaan konflik beserta alasannya, yaitu pemisahan
tanggung jawab commit (2.5) dan tidak adanya pekerjaan paralel pada berkas yang sama.
Yg saya ganti adalah keputusan yang benar-benar diambil, yaitu pemilihan alur kerja pada
2.3. Konflik fiktif tidak saya karang, karena klaim palsu pada bagian bukti pengujian
lebih merusak nilai dokumen daripada mengakui tidak ada konflik.

### 4.5 Tipe `LayoutProps` pada Next.js 16

**Kendala.** `app/layout.tsx` memakai tipe `LayoutProps<"/">` yang diperkenalkan Next.js
16, bukan deklarasi `children: ReactNode` seperti pada versi sebelumnya. Kode ini gagal
dikompilasi di versi lama.

**Penyelesaian.** Tipe itu saya pakai apa adanya karena memang cara yang benar di
Next.js 16: tipe tersebut memberi tahu bahwa `children` sudah disediakan framework, jadi
deklarasi manual justru berlebihan dan bisa bertentangan dengan tipe yang dihasilkan.
`npm run build` menjalankan pemeriksaan TypeScript dan selesai tanpa galat.

---

## 5. Catatan Pemanfaatan AI

### 5.1 Ringkasan

Proyek Lotus Quant saya bangun dengan bantuan Command Code, agen AI berbasis terminal.
AI menulis kode dan dokumen ini, lalu saya verifikasi sendiri hasilnya sebelum
menganggapnya selesai.

### 5.2 Alat yang Digunakan

| Alat | Peran | Versi / catatan |
| --- | --- | --- |
| Command Code (agen AI) | Perancangan, penulisan kode, penyusunan dokumen ini | — |
| Impeccable (skill desain) | Sistem desain: token warna, tipografi, komponen, gerakan, aturan interaksi | Hasilnya tersimpan pada `.impeccable/design.json` |
| agent-browser | Pengambilan bukti HTTP: catatan jaringan (HAR) dan tangkapan layar halaman | 0.38.1 |
| GitHub CLI (`gh`) | Pemeriksaan riwayat pull request | — |

### 5.3 Perintah Utama yang Digunakan

| Perintah | Kegunaan | Hasil yang diverifikasi |
| --- | --- | --- |
| `npm run lint` | Pemeriksaan kualitas kode | Lulus tanpa galat (`bukti-10-lint.txt`) |
| `npm run build` | Build produksi dan pemeriksaan TypeScript | Lulus, 2 rute statis (`bukti-09-build-produksi.txt`) |
| `npm run start` | Server produksi untuk pengujian HTTP | Menyediakan `localhost:3000` dengan header produksi |
| `git log --oneline --graph` | Melacak alur commit | 5 commit |
| `gh pr list --state all` | Memeriksa keberadaan pull request | 0 PR sebelum dokumen ini |
| `curl -I`, `curl -v` | Pengamatan header HTTP | 301 dan 200 dengan header lengkap |
| `curl -H 'If-None-Match: …'` | Membuktikan validasi cache | 304 dengan 0 byte |
| `agent-browser network har` | Catatan jaringan peramban | 10 request pada build produksi |

### 5.4 Bagian Proyek yang Digunakan

| Bagian | Peran |
| --- | --- |
| `app/page.tsx` (665 baris) | Komponen utama: `RiskField` (WebGL shader), `Home`, `LotusMark`, `ArrowIcon`, `ReplayIcon`, dan mesin status copilot empat fase |
| `app/globals.css` | Sistem visual lengkap: token, tata letak, keadaan komponen |
| `DESIGN.md` | Dokumen sistem desain hasil Impeccable: palet lengkap dengan tonal ramp, tipografi Geist, spesifikasi komponen, gerakan, dan aturan seperti "The Signal Restraint Rule" dan "The Flat-By-Default Rule" |
| `PRODUCT.md` | Brief produk: pengguna target, posisi produk, batasan kemampuan, data yang tersedia, prinsip produk |
| `docs/praktikum/modul-01.md` | Dokumen ini: penyusunan kerangka, penulisan analisis, dan pengumpulan bukti |

### 5.5 Yang Tidak Dihasilkan AI

Beberapa hal tidak saya berikan ke AI karena akan menyesatkan:

- **Klaim performa, benchmark, testimonial, dan harga.** `PRODUCT.md` melarang hal ini,
  dan tidak ada bukti yang menyokongnya.
- **Nilai risiko dan data portofolio.** Semua angka di antarmuka bersifat ilustratif dan
  diberi label `ILLUSTRATIVE` atau `MODELED`, agar tidak disalahartikan sebagai data
  langsung.
- **Nama dan NIM.** Saya isi manual di bagian atas dokumen ini.
- **Hasil pengujian.** Tidak ada angka di Bagian 3 yang berasal dari perkiraan. Semuanya
  keluaran perintah yang benar-benar dijalankan.

### 5.6 Cara Verifikasi

Saya tidak pernah memperlakukan AI sebagai sumber kebenaran. Setiap klaim saya periksa
dengan cara berikut:

| Yang diperiksa | Cara verifikasi | Hasil |
| --- | --- | --- |
| Kode berjalan | `npm run build` | Kompilasi dan TypeScript lolos |
| Kode bersih | `npm run lint` | ESLint tanpa galat |
| Header HTTP benar | `curl -I` dan `curl -v` dibandingkan langsung | Cocok dengan dokumen ini |
| Cache benar-benar bekerja | Conditional Request diuji dengan ETag cocok **dan** ETag basi | 304 dengan 0 byte, dan 200 dengan 33.788 byte |
| Server pengujian sesuai produksi | Pengukuran diulang pada `next start` | 10 request, bukan 19 seperti pada `next dev` |
| Halaman benar-benar tampil | Tangkapan layar penuh `bukti-01-halaman-utama.png` | Hero, risk field, dan copilot tampil |
| Jalur cadangan WebGL ada | Kode diperiksa pada `app/page.tsx` | `getContext("webgl")` dengan keadaan `shader-fallback` |
| Aksesibilitas tersedia | Kode diperiksa pada `app/page.tsx` | `aria-pressed`, `aria-busy`, `aria-live`, `aria-label`, navigasi panah kiri/kanan |

### 5.7 Keterbatasan yang Diketahui

Saya memberi instruksi ke AI, lalu saya periksa hasilnya sendiri. Yang saya periksa:
apakah warna yang muncul sesuai `DESIGN.md`, apakah font Geist benar-benar termuat,
apakah tombol skenario mengubah tampilan, dan apakah status 304 muncul pada aset statis.

Beberapa bagian hasil AI saya tolak atau tulis ulang karena tidak tepat: label `aria`
yang terlalu umum, penamaan variabel yang tidak deskriptif, dan sebutan `next start`
yang sempat tertulis sebagai `next dev` pada draf pertama. Kesalahan terakhir paling
berdampak, karena seluruh angka HTTP bergantung pada server yang benar. Saya menemukan
nya saat mengulang pengukuran di Bagian 3.5, dan koreksinya kini tercatat di dokumen
ini.

Pola kerjanya: **AI menulis, saya verifikasi, dan saya yang bertanggung jawab atas hasil
akhir.** Catatan ini terbuka supaya pembaca bisa menilai sendiri kualitas verifikasinya.

---

## Lampiran A: Daftar Berkas Bukti

Seluruh berkas berada pada `docs/praktikum/bukti/`.

| Berkas | Isi | Cara pembuatan |
| --- | --- | --- |
| `bukti-01-halaman-utama.png` | Tangkapan layar seluruh halaman pada server produksi | `agent-browser screenshot --full` |
| `bukti-02-curl-I-github-http.txt` | `curl -I http://github.com` | `curl -I http://github.com` |
| `bukti-03-curl-v-github-http.txt` | `curl -v -I http://github.com` | `curl -v -I http://github.com` |
| `bukti-04a-header-dokumen-lokal.txt` | Header respons `GET /` | `curl -s -D - -o NUL http://localhost:3000` |
| `bukti-04b-header-aset-cache.txt` | Header respons aset CSS statis | `curl -s -D - -o NUL http://localhost:3000/_next/static/chunks/348amkeptk6_w.css` |
| `bukti-04c-ukuran-transfer.txt` | Empat skenario transfer termasuk bukti 304 dan 200 | `curl` dengan dan tanpa `-H 'If-None-Match: …'` |
| `bukti-05a-har-muat-kedua-ter-cache.har` | Catatan jaringan peramban, 10 request | `agent-browser network har stop` |
| `bukti-06-git-log-graph.txt` | `git log --oneline --graph` | `git log --oneline --graph` |
| `bukti-07-git-log-detail.txt` | `git log --format=fuller --stat -5` | `git log --format=fuller --stat -5` |
| `bukti-08-versi-lingkungan.txt` | Versi OS, Node, npm, Git, VS Code | `ver`, `node -v`, `npm -v`, `git --version`, `code --version` |
| `bukti-09-build-produksi.txt` | Keluaran `npm run build` | `npm run build` |
| `bukti-10-lint.txt` | Keluaran `npm run lint` | `npm run lint` |

## Lampiran B: Tautan Pengumpulan

| | |
| --- | --- |
| Berkas dokumen | `https://github.com/tokyokoolkar-sys/prak-web/blob/main/week-1/ata-produk/docs/praktikum/modul-01.md` |
| Pull request dokumen ini | `https://github.com/tokyokoolkar-sys/prak-web/pull/1` |

> Tautan di atas berlaku setelah dokumen ini didorong ke branch `main`. Bila pemindahan
> melalui pull request dilakukan, nomor PR mungkin berbeda dari yang tertulis; sesuaikan
> angka `1` dengan nomor sebenarnya.
