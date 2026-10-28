Kategori: Web App — Payment Gateway/Wallet

# Saldoara — Dompet Digital (Simulasi Demo)

> **Kategori proyek: Web App — Payment Gateway/Wallet.**
> Dompet digital lengkap dengan kartu saldo, poin reward, top up, transfer,
> QRIS simulasi, tagihan, riwayat, dan analisis pengeluaran — semuanya
> berjalan penuh di browser tanpa backend.

Aplikasi dompet digital fiktif "Saldoara". Proyek ini adalah **concept demo**
untuk portofolio jasa pembuatan web app — seluruh nama, kontak, merchant,
dan angka bersifat fiktif dan tidak berafiliasi dengan layanan e-wallet mana
pun. "QRIS" hanya disebut sebagai metode pembayaran generik tanpa logo resmi;
QR yang ditampilkan adalah gambar dekoratif buatan sendiri.

**Live:** https://saldoara.vercel.app

**Label wajib demo:** "Simulasi demo — tanpa transaksi nyata" (tampil di
navbar, kartu dompet, dan footer).

## Fitur

- **Kartu saldo besar** dengan gradient ungu, toggle sembunyikan saldo, dan
  **poin reward** (1 poin per Rp10.000 transaksi keluar, terkumpul otomatis).
- **Top up**: pilih nominal cepat (25rb–500rb) atau nominal bebas + 3 metode
  generik (Virtual Account, Kartu, Gerai Retail) — saldo langsung bertambah.
- **Transfer** ke 5 kontak fiktif (avatar inisial, handle) dengan nominal +
  catatan, pratinjau "saldo setelah transfer", dan validasi saldo cukup.
- **Bayar QRIS (simulasi)**: 6 merchant fiktif, QR SVG dekoratif yang
  di-generate deterministik dari seed merchant+nominal (dengan label tegas
  "bukan kode pembayaran asli"), lalu simulasi pembayaran.
- **Tagihan mock**: listrik, pulsa & paket data, internet, air — dengan
  jatuh tempo, status lunas yang bertahan, dan tercatat di riwayat.
- **Riwayat transaksi** 16+ entri seed (kategori, masuk/keluar, **saldo
  berjalan**) + filter jenis (semua/masuk/keluar), filter kategori, dan
  pencarian; transaksi baru langsung masuk daftar. Reset data demo tersedia.
- **Analisis**: donut SVG buatan sendiri pengeluaran per kategori bulan ini +
  **budget bulanan** 5 kategori dengan progress bar (aman / hampir habis /
  terlampaui) dan ringkasan otomatis.
- Semua data client-side (array mock + **localStorage**), tanpa backend,
  tanpa API eksternal, tanpa library chart.
- Responsif desktop + mobile (tab bawah di mobile), animasi halus Framer
  Motion, ikon Lucide.

## Untuk siapa demo ini?

Fintech, startup payment, UMKM dengan fitur simpan pinjam, atau bisnis yang
ingin memvisualkan produk dompet digital sebelum membangun versi produksi
dengan keamanan & regulasi sungguhan.

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4 (token tema `@theme`, tema gelap aksen ungu)
- Framer Motion
- Lucide Icons
- Grafik SVG custom (donut & QR dekoratif, tanpa library chart)

## Menjalankan

```bash
npm install
npm run dev      # development
npm run build    # production build ke folder dist/
npm run preview  # preview hasil build
```

---

Dibuat oleh [Agni Miftah Fauzi](https://github.com/Atazyyy) — jasa pembuatan
website & web app.
