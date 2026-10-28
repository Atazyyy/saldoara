import { useState } from "react";
import { Loader2 } from "lucide-react";
import { TOPUP_METHODS } from "../data/seed";
import { num, rupiah } from "../utils/format";
import ActionSuccess from "./ActionSuccess";

const NOMINALS = [25000, 50000, 100000, 200000, 500000];

export default function TopUp({ balance, onCommit, onNavigate }) {
  const [amount, setAmount] = useState(null);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("va");
  const [step, setStep] = useState("form"); // form | process | done
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const activeAmount = custom ? Number(custom) : amount;

  const submit = () => {
    const m = TOPUP_METHODS.find((x) => x.id === method);
    if (!activeAmount || activeAmount < 10000) {
      setErr("Nominal top up minimal Rp10.000.");
      return;
    }
    if (activeAmount > 5000000) {
      setErr("Maksimal top up Rp5.000.000 per transaksi.");
      return;
    }
    setErr("");
    setStep("process");
    setTimeout(() => {
      onCommit({
        ts: Date.now(),
        kind: "masuk",
        delta: activeAmount,
        cat: "topup",
        title: `Top Up — ${m.label}`,
        note: m.desc,
      });
      setDone({ amount: activeAmount, method: m.label });
      setStep("done");
    }, 1100);
  };

  const again = () => {
    setAmount(null);
    setCustom("");
    setErr("");
    setStep("form");
  };

  if (step === "process") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-edge bg-card p-12">
        <Loader2 className="h-10 w-10 animate-spin text-grape" />
        <p className="text-sm font-semibold text-mute">Memproses top up…</p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <ActionSuccess
        title={`Top up ${rupiah(done.amount)} berhasil`}
        subtitle="Saldo sudah masuk ke dompet demo."
        lines={[
          ["Metode", done.method],
          ["Nominal", rupiah(done.amount)],
          ["Saldo sekarang", rupiah(balance)],
        ]}
        onAgain={again}
        onHistory={() => onNavigate("riwayat")}
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Nominal */}
      <div className="rounded-2xl border border-edge bg-card p-5 md:p-6">
        <h2 className="font-bold text-ink">Pilih nominal top up</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {NOMINALS.map((v) => {
            const active = !custom && amount === v;
            return (
              <button
                key={v}
                onClick={() => {
                  setAmount(v);
                  setCustom("");
                  setErr("");
                }}
                className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${
                  active
                    ? "border-grape bg-grape text-white"
                    : "border-edge bg-field text-mute hover:border-grape/60 hover:text-ink"
                }`}
              >
                {num(v)}
              </button>
            );
          })}
        </div>
        <label className="mt-4 block text-xs font-bold text-mute">
          Atau ketik nominal lain (Rp)
        </label>
        <div className="relative mt-1.5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-mute">
            Rp
          </span>
          <input
            type="number"
            min={10000}
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setErr("");
            }}
            placeholder="cth. 75000"
            className="w-full rounded-xl bg-field py-3 pl-11 pr-4 text-sm font-bold text-ink outline-none ring-1 ring-edge focus:ring-2 focus:ring-grape"
          />
        </div>
        <p className="mt-3 text-xs text-mute">
          Minimal Rp10.000 · maksimal Rp5.000.000 per transaksi.
        </p>
      </div>

      {/* Metode */}
      <div className="rounded-2xl border border-edge bg-card p-5 md:p-6">
        <h2 className="font-bold text-ink">Metode pembayaran</h2>
        <div className="mt-4 space-y-2">
          {TOPUP_METHODS.map((m) => {
            const active = method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                  active
                    ? "border-grape bg-grapesoft/60"
                    : "border-edge bg-field hover:border-grape/50"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-grapesoft text-grapelight">
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">{m.label}</p>
                  <p className="text-xs text-mute">{m.desc}</p>
                </div>
                <span
                  className={`h-4 w-4 rounded-full border-2 ${
                    active ? "border-grape bg-grape" : "border-edge"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-field px-4 py-3 text-sm">
          <span className="text-mute">Nominal dipilih</span>
          <span className="font-extrabold text-ink">
            {activeAmount ? rupiah(activeAmount) : "—"}
          </span>
        </div>

        {err && (
          <p className="mt-3 rounded-xl bg-coral/10 px-4 py-2.5 text-xs font-bold text-coral">
            {err}
          </p>
        )}

        <button
          onClick={submit}
          disabled={!activeAmount}
          className="mt-4 w-full rounded-xl bg-grape py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-grapedeep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Top Up Sekarang
        </button>
      </div>
    </div>
  );
}
