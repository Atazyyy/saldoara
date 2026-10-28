import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dompet from "./components/Dompet";
import Riwayat from "./components/Riwayat";
import Analisis from "./components/Analisis";
import { buildLedger } from "./data/seed";
import { useWallet } from "./hooks/useWallet";

export default function App() {
  const [view, setView] = useState("dompet");
  const wallet = useWallet();
  const ledger = buildLedger(wallet.extra);

  const navigate = (v) => {
    setView(v);
    window.scrollTo({ top: 0 });
  };

  // Semua aksi (top up / transfer / QRIS / tagihan) masuk lewat sini:
  // catat transaksi + kumpulkan poin reward untuk transaksi keluar.
  const commitTx = (tx) => {
    wallet.addTx({
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    });
    if (tx.delta < 0) wallet.earn(Math.abs(tx.delta));
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
      <Navbar view={view} onNavigate={navigate} />
      <main className="flex-1 pb-16 sm:pb-0">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
          {view === "dompet" && (
            <Dompet
              balance={ledger.length ? ledger[0].saldoAfter : undefined}
              ledgerEmpty={ledger.length === 0}
              points={wallet.points}
              paidBillIds={wallet.extra
                .filter((t) => t.meta && t.meta.billId)
                .map((t) => t.meta.billId)}
              onCommit={commitTx}
              onNavigate={navigate}
            />
          )}
          {view === "riwayat" && (
            <Riwayat ledger={ledger} onReset={wallet.reset} />
          )}
          {view === "analisis" && <Analisis ledger={ledger} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
