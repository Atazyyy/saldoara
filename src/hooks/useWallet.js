import { useEffect, useState } from "react";

const KEY = "saldoara-wallet-v1";
const INITIAL = { extra: [], points: 0 };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw);
    return {
      extra: Array.isArray(parsed.extra) ? parsed.extra : [],
      points: Number.isFinite(parsed.points) ? parsed.points : 0,
    };
  } catch {
    return INITIAL;
  }
}

// State dompet demo: transaksi buatan pengguna + poin reward.
// Saldo TIDAK disimpan — selalu dihitung ulang dari riwayat seed + extra
// supaya saldo berjalan selalu konsisten.
export function useWallet() {
  const [state, setState] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const addTx = (tx) => setState((s) => ({ ...s, extra: [...s.extra, tx] }));
  const earn = (amount) =>
    setState((s) => ({ ...s, points: s.points + Math.floor(amount / 10000) }));
  const reset = () => setState(INITIAL);

  return { extra: state.extra, points: state.points, addTx, earn, reset };
}
