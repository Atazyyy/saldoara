import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  Coins,
  Eye,
  EyeOff,
  QrCode,
  Receipt,
  Send,
  ShieldCheck,
} from "lucide-react";
import { num, rupiah, fullDate } from "../utils/format";
import TopUp from "./TopUp";
import Transfer from "./Transfer";
import QrisPay from "./QrisPay";
import Tagihan from "./Tagihan";

const PANELS = [
  { id: "topup", label: "Top Up", icon: ArrowDownCircle },
  { id: "transfer", label: "Transfer", icon: Send },
  { id: "qris", label: "Bayar QRIS", icon: QrCode },
  { id: "tagihan", label: "Tagihan", icon: Receipt },
];

export default function Dompet({
  balance = 0,
  ledgerEmpty,
  points,
  paidBillIds,
  onCommit,
  onNavigate,
}) {
  const [panel, setPanel] = useState("topup");
  const [hide, setHide] = useState(false);

  return (
    <div className="space-y-6">
      {/* Sapaan */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Halo, Salsa Rahmania
        </h1>
        <p className="mt-1 text-sm text-mute">{fullDate()} · Akun demo pribadi</p>
      </div>

      {/* Kartu saldo besar + poin reward */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8b5cf6] via-[#6d28d9] to-[#2e1065] p-6 shadow-xl shadow-grape/20 md:p-8"
      >
        {/* dekorasi */}
        <div className="absolute -right-10 -top-14 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">
              Saldo Saldoara
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {hide ? "Rp ••••••••" : rupiah(ledgerEmpty ? 0 : balance)}
            </p>
          </div>
          <button
            onClick={() => setHide((h) => !h)}
            title={hide ? "Tampilkan saldo" : "Sembunyikan saldo"}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            {hide ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center gap-2.5">
          <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
            SAL · 8271
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs font-bold text-gold">
            <Coins className="h-3.5 w-3.5" />
            {num(points)} poin reward
          </span>
          <span className="text-[11px] font-semibold text-white/70">
            1 poin per Rp10.000 transaksi keluar
          </span>
        </div>
      </motion.div>

      {/* Label simulasi */}
      <div className="flex items-center gap-2.5 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-xs font-semibold leading-relaxed text-gold">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Simulasi demo — tanpa transaksi nyata. Semua saldo, kontak, dan merchant
        hanya contoh fiktif; data tersimpan di browsermu saja.
      </div>

      {/* Pintasan aksi (sekalian tab panel) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PANELS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPanel(p.id)}
            className={`flex flex-col items-center gap-2.5 rounded-2xl border p-4 transition-colors ${
              panel === p.id
                ? "border-grape bg-grapesoft"
                : "border-edge bg-card hover:border-grape/60"
            }`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                panel === p.id ? "bg-grape text-white" : "bg-grapesoft text-grapelight"
              }`}
            >
              <p.icon className="h-5 w-5" />
            </div>
            <span
              className={`text-sm font-bold ${panel === p.id ? "text-ink" : "text-mute"}`}
            >
              {p.label}
            </span>
          </button>
        ))}
      </div>

      {/* Panel aksi */}
      <motion.div
        key={panel}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {panel === "topup" && (
          <TopUp balance={balance} onCommit={onCommit} onNavigate={onNavigate} />
        )}
        {panel === "transfer" && (
          <Transfer balance={balance} onCommit={onCommit} onNavigate={onNavigate} />
        )}
        {panel === "qris" && (
          <QrisPay balance={balance} onCommit={onCommit} onNavigate={onNavigate} />
        )}
        {panel === "tagihan" && (
          <Tagihan
            balance={balance}
            paidIds={paidBillIds}
            onCommit={onCommit}
          />
        )}
      </motion.div>
    </div>
  );
}
