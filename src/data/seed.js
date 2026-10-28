// Data contoh Saldoara — seluruh nama, kontak, merchant, dan angka bersifat
// FIKTIF. Tidak ada afiliasi dengan layanan e-wallet mana pun. QRIS hanya
// disebut sebagai metode pembayaran generik, tanpa logo resmi.
// Timestamp dihitung relatif terhadap waktu halaman dibuka supaya demo
// selalu terlihat "hidup".

const H = 3600000; // satu jam dalam ms
const D = 86400000; // satu hari dalam ms

export const WA_NUMBER = "6281234567890";

// Saldo dasar sebelum transaksi seed pertama — saldo sekarang dihitung
// ulang dari seluruh riwayat (deterministik & konsisten dengan riwayat).
export const BASE_SALDO = 1250000;
export const START_POINTS = 340;

const now0 = Date.now();
const THIS_PERIOD = new Date(now0).toLocaleDateString("id-ID", {
  month: "short",
  year: "numeric",
});
const PREV_PERIOD = new Date(new Date(now0).getFullYear(), new Date(now0).getMonth() - 1, 1)
  .toLocaleDateString("id-ID", { month: "short", year: "numeric" });

// ---------- Kategori transaksi ----------
export const CATS = {
  topup: { id: "topup", label: "Top Up", color: "#c4b5fd" },
  transfer: { id: "transfer", label: "Transfer", color: "#a78bfa" },
  makan: { id: "makan", label: "Makan & Minum", color: "#fb923c" },
  transport: { id: "transport", label: "Transportasi", color: "#38bdf8" },
  tagihan: { id: "tagihan", label: "Tagihan", color: "#f472b6" },
  belanja: { id: "belanja", label: "Belanja", color: "#a3e635" },
  hiburan: { id: "hiburan", label: "Hiburan", color: "#fbbf24" },
  gaji: { id: "gaji", label: "Gaji & Upah", color: "#4ade80" },
  lainnya: { id: "lainnya", label: "Lainnya", color: "#94a3b8" },
};

// ---------- Kontak transfer (fiktif) ----------
export const CONTACTS = [
  { id: "c1", name: "Rani Puspita", handle: "@rani", color: "bg-violet-500/20 text-violet-300" },
  { id: "c2", name: "Bima Aditya", handle: "@bimaadit", color: "bg-sky-500/20 text-sky-300" },
  { id: "c3", name: "Sinta Maharani", handle: "@sintamhr", color: "bg-pink-500/20 text-pink-300" },
  { id: "c4", name: "Yoga Pratama", handle: "@yogaprt", color: "bg-amber-500/20 text-amber-300" },
  { id: "c5", name: "Laras Wulandari", handle: "@laraswl", color: "bg-emerald-500/20 text-emerald-300" },
];

export const initialsOf = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// ---------- Merchant QRIS (fiktif) ----------
export const MERCHANTS = [
  { id: "m1", name: "Kopi Senja", cat: "makan", desc: "Kopi susu aren", suggest: 28000 },
  { id: "m2", name: "Warung Bu Ratu", cat: "makan", desc: "Nasi ayam + es teh", suggest: 45000 },
  { id: "m3", name: "Laundry Kilat", cat: "lainnya", desc: "Cuci setrika 3 kg", suggest: 55000 },
  { id: "m4", name: "Toko Bunga Melati", cat: "belanja", desc: "Buket mawar mini", suggest: 120000 },
  { id: "m5", name: "Bioskop Senja", cat: "hiburan", desc: "Tiket 2 kursi", suggest: 90000 },
  { id: "m6", name: "Pasar Segar", cat: "belanja", desc: "Belanja mingguan", suggest: 128000 },
];

// ---------- Metode top up (semuanya generik, tanpa brand nyata) ----------
import { CreditCard, Landmark, Store } from "lucide-react";

export const TOPUP_METHODS = [
  { id: "va", icon: Landmark, label: "Virtual Account", desc: "Transfer bank · gratis biaya" },
  { id: "kartu", icon: CreditCard, label: "Kartu Debit / Kredit", desc: "Terbit instan · tanpa biaya" },
  { id: "retail", icon: Store, label: "Gerai Retail", desc: "Bayar tunai di kasir mitra" },
];

// ---------- Budget bulanan per kategori ----------
export const BUDGETS = [
  { cat: "makan", amount: 400000 },
  { cat: "transport", amount: 200000 },
  { cat: "tagihan", amount: 800000 },
  { cat: "belanja", amount: 250000 },
  { cat: "hiburan", amount: 150000 },
];

// ---------- Tagihan mock ----------
export function getBills() {
  const now = Date.now();
  return [
    {
      id: "listrik",
      title: "Tagihan Listrik Rumah",
      detail: "No. pel 5320-1128-7741 · daya 2200 VA",
      note: `Periode ${THIS_PERIOD}`,
      amount: 234500,
      dueTs: now + 4 * D,
    },
    {
      id: "pulsa",
      title: "Pulsa & Paket Data",
      detail: "62812-8809-2241 · paket 10 GB / 30 hari",
      note: `Periode ${THIS_PERIOD}`,
      amount: 85000,
      dueTs: now,
    },
    {
      id: "internet",
      title: "Internet Rumah",
      detail: "MelatiNet 50 Mbps · pel 0881-2205",
      note: `Periode ${THIS_PERIOD}`,
      amount: 320000,
      dueTs: now + 9 * D,
    },
    {
      id: "air",
      title: "Tagihan Air",
      detail: "No. pel 0117-8842 · golongan R1",
      note: `Periode ${THIS_PERIOD}`,
      amount: 67500,
      dueTs: now + 12 * D,
    },
  ];
}

// ---------- Riwayat transaksi seed ----------
const SEED_SPECS = [
  { h: 288, kind: "masuk", delta: 500000, cat: "topup", title: "Top Up — Virtual Account", note: "VA · konfirmasi otomatis" },
  { h: 264, kind: "keluar", delta: -28000, cat: "makan", title: "QRIS — Kopi Senja", note: "Kopi susu aren" },
  { h: 240, kind: "keluar", delta: -150000, cat: "transfer", title: "Transfer ke Rani Puspita", note: "Patungan kado ulang tahun" },
  { h: 216, kind: "keluar", delta: -234500, cat: "tagihan", title: "Tagihan Listrik Rumah", note: `Periode ${PREV_PERIOD}` },
  { h: 192, kind: "keluar", delta: -45000, cat: "makan", title: "QRIS — Warung Bu Ratu", note: "Nasi ayam + es teh" },
  { h: 168, kind: "keluar", delta: -25000, cat: "tagihan", title: "Pulsa & Paket Data", note: "62812-8809-2241" },
  { h: 144, kind: "masuk", delta: 1200000, cat: "gaji", title: "Pemasukan Freelance", note: "Desain landing page" },
  { h: 120, kind: "masuk", delta: 200000, cat: "topup", title: "Top Up — Gerai Retail", note: "Bayar tunai di kasir" },
  { h: 96, kind: "keluar", delta: -36000, cat: "transport", title: "Tiket Kereta Komuter", note: "Bandung — Cimahi" },
  { h: 72, kind: "keluar", delta: -55000, cat: "lainnya", title: "QRIS — Laundry Kilat", note: "Cuci setrika 3 kg" },
  { h: 48, kind: "keluar", delta: -128000, cat: "belanja", title: "QRIS — Pasar Segar", note: "Belanja mingguan" },
  { h: 26, kind: "keluar", delta: -90000, cat: "hiburan", title: "Tiket Bioskop Senja", note: "2 kursi · studio 3" },
  { h: 20, kind: "keluar", delta: -320000, cat: "tagihan", title: "Internet Rumah", note: `MelatiNet · ${THIS_PERIOD}` },
  { h: 12, kind: "keluar", delta: -75000, cat: "transfer", title: "Transfer ke Bima Aditya", note: "Nobar akhir pekan" },
  { h: 4, kind: "keluar", delta: -32000, cat: "makan", title: "QRIS — Kopi Senja", note: "Americano dingin" },
  { h: 1, kind: "masuk", delta: 10000, cat: "lainnya", title: "Cashback Promo", note: "Cashback pembayaran QRIS" },
];

export const SEED_TXS = SEED_SPECS.map((s, i) => ({
  id: `seed-${i + 1}`,
  ts: Date.now() - s.h * H,
  kind: s.kind,
  delta: s.delta,
  cat: s.cat,
  title: s.title,
  note: s.note,
}));

// Susun buku besar: urut waktu, hitung saldo berjalan, lalu balik
// (terbaru dulu) supaya siap ditampilkan.
export function buildLedger(extra = []) {
  const all = [...SEED_TXS, ...extra].sort((a, b) => a.ts - b.ts);
  let saldo = BASE_SALDO;
  const rows = all.map((t) => {
    saldo += t.delta;
    return { ...t, saldoAfter: saldo };
  });
  return rows.reverse();
}

export const balanceOf = (ledger) =>
  ledger.length ? ledger[0].saldoAfter : BASE_SALDO;
