# DompetKeluarga — Anggaran Rumah Tangga

[![make.fun](https://img.shields.io/badge/make.fun-bounty-2e7d5b)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Node](https://img.shields.io/badge/node-%3E%3D22-339933)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Situs anggaran rumah tangga yang berjalan penuh dari file statis — tanpa
build step, tanpa koneksi internet. Dibuat untuk kompetisi make.fun
[best-household-budget-site-20261126-1457](https://make.fun/bounty/best-household-budget-site-20261126-1457).

## Isinya

- **Ringkasan** — penghasilan Rp 8,5 jt/bulan, belanja, tabungan, dan sisa uang
  Rp 200.000, lengkap dengan grafik tren 6 bulan dan donat per kategori.
- **Belanja** — tabel per kategori yang bisa diurutkan (klik judul kolom).
- **Tagihan** — 6 tagihan & cicilan dengan jatuh tempo dan status lunas.
- **Tabungan** — 3 tujuan (dana darurat, liburan, pendidikan) dengan progres.
- **Kalkulator** — ubah angka penghasilan/belanja, hasilnya langsung berubah,
  lengkap dengan patokan 50/30/20.
- **Tren** — grafik penghasilan vs belanja 6 bulan terakhir.

Semua angka adalah **contoh** untuk satu keluarga di Jakarta (2 dewasa +
2 anak), November 2026, dan diberi label sebagai contoh di situs. Semua
halaman menghitung dari satu sumber data yang sama (`app/data.js`), jadi
angka "sisa uang" konsisten di mana-mana.

## Menjalankan

```sh
node serve.ts        # sajikan app/ di http://localhost:8080
```

atau buka `app/index.html` lewat server statis apa pun. Lalu:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke output dan menulis
`dossier.json` dengan library make.fun yang divendor. Dua run menulis
byte yang sama persis (deterministik).
