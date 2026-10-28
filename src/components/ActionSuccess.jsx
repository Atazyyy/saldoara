import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

// Kartu sukses bersama untuk semua aksi (top up / transfer / QRIS / tagihan).
export default function ActionSuccess({ title, subtitle, lines = [], onAgain, onHistory }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-mint/30 bg-mint/5 p-6 text-center md:p-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-mint" />
      </motion.div>
      <p className="mt-3 text-lg font-extrabold text-ink">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-mute">{subtitle}</p>}
      {lines.length > 0 && (
        <div className="mx-auto mt-4 max-w-sm space-y-1.5 rounded-xl bg-field p-4 text-sm">
          {lines.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4">
              <span className="text-mute">{k}</span>
              <span className="text-right font-bold text-ink">{v}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          onClick={onAgain}
          className="rounded-xl bg-grapesoft px-5 py-2.5 text-sm font-bold text-grapelight transition-colors hover:bg-grape hover:text-white"
        >
          Transaksi lain
        </button>
        <button
          onClick={onHistory}
          className="rounded-xl border border-edge px-5 py-2.5 text-sm font-bold text-mute transition-colors hover:border-grape hover:text-ink"
        >
          Lihat Riwayat
        </button>
      </div>
    </motion.div>
  );
}
