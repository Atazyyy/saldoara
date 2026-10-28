import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Target } from "lucide-react";
import { BUDGETS, CATS } from "../data/seed";
import { isSameMonth, num, rupiah } from "../utils/format";
import DonutChart from "./DonutChart";

function budgetTone(pct) {
  if (pct >= 100) return { bar: "bg-coral", text: "text-coral", chip: "bg-coral/10 text-coral" };
  if (pct >= 75) return { bar: "bg-gold", text: "text-gold", chip: "bg-gold/10 text-gold" };
  return { bar: "bg-grape", text: "text-mint", chip: "bg-mint/10 text-mint" };
}

export default function Analisis({ ledger }) {
  const monthTxs = ledger.filter((t) => isSameMonth(t.ts, Date.now()));
  const totalIn = monthTxs
    .filter((t) => t.delta > 0)
    .reduce((s, t) => s + t.delta, 0);
  const totalOut = monthTxs
    .filter((t) => t.delta < 0)
    .reduce((s, t) => s - t.delta, 0);

  const byCat = {};
  monthTxs
    .filter((t) => t.delta < 0)
    .forEach((t) => {
      byCat[t.cat] = (byCat[t.cat] || 0) + -t.delta;
    });

  const donutData = Object.entries(byCat)
    .map(([catId, value]) => ({
      cat: catId,
      label: CATS[catId]?.label || catId,
      color: CATS[catId]?.color || "#94a3b8",
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const budgetRows = BUDGETS.map((b) => {
    const spent = byCat[b.cat] || 0;
    return {
      ...b,
      label: CATS[b.cat].label,
      spent,
      pct: Math.round((spent / b.amount) * 100),
    };
  });

  const top = donutData[0] || null;
  const over = budgetRows.filter((r) => r.pct >= 100);
  const nearest = [...budgetRows].sort((a, b) => b.pct - a.pct)[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Analisis Pengeluaran
        </h1>
        <p className="mt-1 text-sm text-mute">
          Donut kategori + budget bulanan — dihitung langsung dari riwayat
          transaksi demo.
        </p>
      </div>

      {/* Stat ringkas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-edge bg-card p-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute">
            <ArrowDownLeft className="h-3.5 w-3.5 text-mint" /> Masuk bulan ini
          </p>
          <p className="mt-1 text-2xl font-extrabold text-mint">+{rupiah(totalIn)}</p>
        </div>
        <div className="rounded-2xl border border-edge bg-card p-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute">
            <ArrowUpRight className="h-3.5 w-3.5 text-coral" /> Keluar bulan ini
          </p>
          <p className="mt-1 text-2xl font-extrabold text-coral">−{rupiah(totalOut)}</p>
        </div>
        <div className="rounded-2xl border border-edge bg-card p-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-mute">
            <Target className="h-3.5 w-3.5 text-grapelight" /> Net bulan ini
          </p>
          <p
            className={`mt-1 text-2xl font-extrabold ${
              totalIn - totalOut >= 0 ? "text-ink" : "text-coral"
            }`}
          >
            {totalIn - totalOut >= 0 ? "+" : "−"}
            {rupiah(Math.abs(totalIn - totalOut))}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Donut */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-edge bg-card p-5 md:p-6 lg:col-span-2"
        >
          <h2 className="font-bold text-ink">Pengeluaran per kategori</h2>
          {donutData.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-edge p-6 text-center text-sm font-semibold text-mute">
              Belum ada pengeluaran tercatat bulan ini.
            </p>
          ) : (
            <>
              <div className="mt-4 flex justify-center">
                <DonutChart
                  data={donutData}
                  centerLabel="keluar bulan ini"
                  centerValue={rupiah(totalOut)}
                />
              </div>
              <div className="mt-5 space-y-2">
                {donutData.map((d) => (
                  <div key={d.cat} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="flex-1 font-semibold text-ink">{d.label}</span>
                    <span className="text-mute">{rupiah(d.value)}</span>
                    <span className="w-10 text-right text-xs font-bold text-mute/80">
                      {Math.round((d.value / totalOut) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Budget */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="rounded-2xl border border-edge bg-card p-5 md:p-6 lg:col-span-3"
        >
          <h2 className="font-bold text-ink">Budget bulanan</h2>
          <p className="mt-1 text-xs text-mute">
            Batas belanja per kategori untuk bulan berjalan (nilai demo).
          </p>
          <div className="mt-5 space-y-5">
            {budgetRows.map((r) => {
              const tone = budgetTone(r.pct);
              return (
                <div key={r.cat}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-ink">{r.label}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${tone.chip}`}>
                      {r.pct}%
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cardhi">
                    <div
                      className={`h-full rounded-full ${tone.bar}`}
                      style={{ width: `${Math.min(r.pct, 100)}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-mute">
                    {rupiah(r.spent)} terpakai · budget {rupiah(r.amount)}
                    {r.pct >= 100 && (
                      <span className={`ml-1 font-extrabold ${tone.text}`}>
                        · terlampaui!
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Insight */}
      <div className="rounded-2xl border border-grape/30 bg-grapesoft/50 p-5 text-sm leading-relaxed text-mute md:p-6">
        <p className="font-bold text-ink">Ringkasan otomatis</p>
        <p className="mt-2">
          {top ? (
            <>
              Pengeluaran terbesar bulan ini adalah{" "}
              <span className="font-bold" style={{ color: top.color }}>
                {top.label}
              </span>{" "}
              ({rupiah(top.value)},{" "}
              {Math.round((top.value / totalOut) * 100)}% dari total keluar{" "}
              {rupiah(totalOut)}).
            </>
          ) : (
            <>Belum ada pengeluaran bulan ini — semua kategori masih kosong.</>
          )}{" "}
          {over.length > 0 ? (
            <>
              Budget sudah terlampaui pada{" "}
              <span className="font-bold text-coral">
                {over.map((o) => o.label).join(", ")}
              </span>
              .
            </>
          ) : (
            <>
              Semua budget masih aman; yang paling mendekati batas adalah{" "}
              <span className="font-bold text-ink">
                {nearest ? `${nearest.label} (${nearest.pct}%)` : "—"}
              </span>
              .
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-mute/80">
          Menampilkan {num(monthTxs.length)} transaksi bulan ini dari total{" "}
          {num(ledger.length)} transaksi demo.
        </p>
      </div>
    </div>
  );
}
