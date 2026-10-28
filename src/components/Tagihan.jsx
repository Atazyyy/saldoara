import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Droplets,
  Loader2,
  Smartphone,
  Wifi,
  Zap,
} from "lucide-react";
import { getBills } from "../data/seed";
import { dueLabel, rupiah } from "../utils/format";

const BILL_ICON = {
  listrik: Zap,
  pulsa: Smartphone,
  internet: Wifi,
  air: Droplets,
};

export default function Tagihan({ balance, paidIds, onCommit }) {
  const [busy, setBusy] = useState(null);
  const [justPaid, setJustPaid] = useState(null);
  const [err, setErr] = useState("");

  const bills = getBills();
  const unpaid = bills.filter((b) => !paidIds.includes(b.id));
  const totalUnpaid = unpaid.reduce((s, b) => s + b.amount, 0);

  const pay = (b) => {
    if (balance < b.amount) {
      setErr(
        `Saldo tidak cukup untuk membayar ${b.title} (${rupiah(b.amount)}). Coba top up dulu.`
      );
      return;
    }
    setErr("");
    setBusy(b.id);
    setTimeout(() => {
      onCommit({
        ts: Date.now(),
        kind: "keluar",
        delta: -b.amount,
        cat: "tagihan",
        title: b.title,
        note: b.note,
        meta: { billId: b.id },
      });
      setBusy(null);
      setJustPaid(b.id);
      setTimeout(() => setJustPaid(null), 2600);
    }, 1100);
  };

  return (
    <div className="rounded-2xl border border-edge bg-card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-bold text-ink">Tagihan aktif (mock)</h2>
        <span className="rounded-full bg-grapesoft px-3 py-1 text-xs font-bold text-grapelight">
          {unpaid.length === 0
            ? "semua lunas 🎉"
            : `${unpaid.length} belum dibayar · ${rupiah(totalUnpaid)}`}
        </span>
      </div>

      {err && (
        <p className="mt-3 rounded-xl bg-coral/10 px-4 py-2.5 text-xs font-bold text-coral">
          {err}
        </p>
      )}

      <div className="mt-4 space-y-2.5">
        {bills.map((b) => {
          const Icon = BILL_ICON[b.id] || Zap;
          const paid = paidIds.includes(b.id);
          return (
            <motion.div
              key={b.id}
              layout
              className={`flex flex-wrap items-center gap-3 rounded-xl border p-4 transition-colors ${
                paid
                  ? "border-mint/30 bg-mint/5"
                  : justPaid === b.id
                    ? "border-mint bg-mint/10"
                    : "border-edge bg-field"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  paid ? "bg-mint/15 text-mint" : "bg-grapesoft text-grapelight"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-[10rem] flex-1">
                <p className="text-sm font-bold text-ink">{b.title}</p>
                <p className="text-xs text-mute">{b.detail}</p>
                <p className="text-[11px] font-semibold text-mute/80">
                  {b.note} · {paid ? "lunas" : dueLabel(b.dueTs)}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-extrabold text-ink">{rupiah(b.amount)}</p>
                {paid ? (
                  <p className="inline-flex items-center gap-1 text-xs font-bold text-mint">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Lunas
                  </p>
                ) : (
                  <button
                    onClick={() => pay(b)}
                    disabled={busy === b.id}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-grape px-3.5 py-2 text-xs font-extrabold text-white transition-colors hover:bg-grapedeep disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy === b.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {busy === b.id ? "Memproses…" : "Bayar"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-mute">
        Tagihan listrik, pulsa, internet, dan air di atas sepenuhnya mock —
        pembayaran hanya mengubah data demo di browser. Status lunas ikut
        tercatat di tab Riwayat dan bertahan selama data demo belum direset.
      </p>
    </div>
  );
}
