import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  Banknote,
  Bus,
  Clapperboard,
  Receipt,
  RotateCcw,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { CATS } from "../data/seed";
import { fmtDateTime, isSameMonth, num, rupiah } from "../utils/format";

const CAT_ICON = {
  topup: ArrowDownCircle,
  transfer: Send,
  makan: UtensilsCrossed,
  transport: Bus,
  tagihan: Receipt,
  belanja: ShoppingBag,
  hiburan: Clapperboard,
  gaji: Banknote,
  lainnya: Sparkles,
};

const JENIS = [
  { id: "semua", label: "Semua" },
  { id: "masuk", label: "Masuk" },
  { id: "keluar", label: "Keluar" },
];

export default function Riwayat({ ledger, onReset }) {
  const [jenis, setJenis] = useState("semua");
  const [cat, setCat] = useState("semua");
  const [q, setQ] = useState("");

  const monthTxs = ledger.filter((t) => isSameMonth(t.ts, Date.now()));
  const monthIn = monthTxs
    .filter((t) => t.delta > 0)
    .reduce((s, t) => s + t.delta, 0);
  const monthOut = monthTxs
    .filter((t) => t.delta < 0)
    .reduce((s, t) => s - t.delta, 0);

  const catsPresent = useMemo(
    () => [...new Set(ledger.map((t) => t.cat))],
    [ledger]
  );

  const filtered = ledger.filter((t) => {
    if (jenis === "masuk" && t.delta < 0) return false;
    if (jenis === "keluar" && t.delta > 0) return false;
    if (cat !== "semua" && t.cat !== cat) return false;
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      const hay = `${t.title} ${t.note || ""}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Riwayat Transaksi
          </h1>
          <p className="mt-1 text-sm text-mute">
            {ledger.length} transaksi tercatat · saldo berjalan ikut ditampilkan
          </p>
        </div>
        <button
          onClick={onReset}
          title="Hapus transaksi demo yang tersimpan di browser ini"
          className="inline-flex items-center gap-1.5 rounded-xl border border-edge bg-card px-3.5 py-2 text-xs font-bold text-mute transition-colors hover:border-coral hover:text-coral"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset data demo
        </button>
      </div>

      {/* Stat ringkas bulan ini */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-edge bg-card p-5">
          <p className="text-xs font-semibold text-mute">Uang masuk bulan ini</p>
          <p className="mt-1 text-2xl font-extrabold text-mint">
            +{rupiah(monthIn)}
          </p>
        </div>
        <div className="rounded-2xl border border-edge bg-card p-5">
          <p className="text-xs font-semibold text-mute">Uang keluar bulan ini</p>
          <p className="mt-1 text-2xl font-extrabold text-coral">
            −{rupiah(monthOut)}
          </p>
        </div>
        <div className="rounded-2xl border border-edge bg-card p-5">
          <p className="text-xs font-semibold text-mute">Transaksi bulan ini</p>
          <p className="mt-1 text-2xl font-extrabold text-ink">
            {num(monthTxs.length)}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="space-y-3 rounded-2xl border border-edge bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full bg-cardhi p-1">
            {JENIS.map((j) => (
              <button
                key={j.id}
                onClick={() => setJenis(j.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  jenis === j.id
                    ? "bg-grape text-white"
                    : "text-mute hover:text-grapelight"
                }`}
              >
                {j.label}
              </button>
            ))}
          </div>
          <div className="relative min-w-[12rem] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari judul / catatan…"
              className="w-full rounded-xl bg-field py-2.5 pl-10 pr-4 text-sm font-semibold text-ink outline-none ring-1 ring-edge placeholder:font-normal placeholder:text-mute/60 focus:ring-2 focus:ring-grape"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setCat("semua")}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
              cat === "semua"
                ? "border-grape bg-grape text-white"
                : "border-edge bg-field text-mute hover:border-grape/60 hover:text-ink"
            }`}
          >
            Semua kategori
          </button>
          {catsPresent.map((id) => {
            const c = CATS[id];
            const active = cat === id;
            return (
              <button
                key={id}
                onClick={() => setCat(id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                  active
                    ? "border-grape bg-grape text-white"
                    : "border-edge bg-field text-mute hover:border-grape/60 hover:text-ink"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daftar transaksi */}
      <p className="text-xs font-semibold text-mute">
        Menampilkan {filtered.length} dari {ledger.length} transaksi
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-edge p-10 text-center text-sm font-semibold text-mute">
          Tidak ada transaksi yang cocok dengan filter.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-2.5"
        >
          {filtered.map((t) => {
            const c = CATS[t.cat] || CATS.lainnya;
            const Icon = CAT_ICON[t.cat] || Sparkles;
            const masuk = t.delta > 0;
            return (
              <div
                key={t.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-edge bg-card p-4 transition-colors hover:border-grape/40"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${c.color}1f`, color: c.color }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-[10rem] flex-1">
                  <p className="text-sm font-bold text-ink">{t.title}</p>
                  {t.note && <p className="text-xs text-mute">{t.note}</p>}
                  <p className="text-[11px] font-semibold text-mute/80">
                    {fmtDateTime(t.ts)} · {c.label}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p
                    className={`text-sm font-extrabold ${
                      masuk ? "text-mint" : "text-coral"
                    }`}
                  >
                    {masuk ? "+" : "−"}
                    {rupiah(Math.abs(t.delta))}
                  </p>
                  <p className="text-[11px] font-semibold text-mute/80">
                    Saldo: {rupiah(t.saldoAfter)}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
