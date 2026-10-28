import { useState } from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import { CATS, MERCHANTS } from "../data/seed";
import { rupiah } from "../utils/format";
import ActionSuccess from "./ActionSuccess";
import QrMock from "./QrMock";

export default function QrisPay({ balance, onCommit, onNavigate }) {
  const [merchantId, setMerchantId] = useState(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState("form"); // form | process | done
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const merchant = MERCHANTS.find((m) => m.id === merchantId) || null;
  const amt = Number(amount) || 0;
  const cat = merchant ? CATS[merchant.cat] : null;

  const pickMerchant = (m) => {
    setMerchantId(m.id);
    setAmount(String(m.suggest));
    setErr("");
  };

  const submit = () => {
    if (!merchant) {
      setErr("Pilih dulu merchant tujuan.");
      return;
    }
    if (!amt || amt < 500) {
      setErr("Nominal pembayaran minimal Rp500.");
      return;
    }
    if (amt > balance) {
      setErr("Saldo tidak cukup untuk pembayaran ini.");
      return;
    }
    setErr("");
    setStep("process");
    setTimeout(() => {
      onCommit({
        ts: Date.now(),
        kind: "keluar",
        delta: -amt,
        cat: merchant.cat,
        title: `QRIS — ${merchant.name}`,
        note: merchant.desc,
      });
      setDone({ merchant, amount: amt });
      setStep("done");
    }, 1400);
  };

  const again = () => {
    setMerchantId(null);
    setAmount("");
    setErr("");
    setStep("form");
  };

  if (step === "process") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-edge bg-card p-12">
        <Loader2 className="h-10 w-10 animate-spin text-grape" />
        <p className="text-sm font-semibold text-mute">
          Menunggu konfirmasi merchant…
        </p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <ActionSuccess
        title={`Pembayaran di ${done.merchant.name} berhasil`}
        subtitle="Dibayar via QRIS (simulasi)."
        lines={[
          ["Merchant", done.merchant.name],
          ["Nominal", rupiah(done.amount)],
          ["Poin didapat", `+${Math.floor(done.amount / 10000)} poin`],
          ["Saldo sekarang", rupiah(balance)],
        ]}
        onAgain={again}
        onHistory={() => onNavigate("riwayat")}
      />
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* Daftar merchant */}
      <div className="rounded-2xl border border-edge bg-card p-5 md:p-6 lg:col-span-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-ink">Pilih merchant demo</h2>
          {merchant && (
            <button
              onClick={again}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-grapelight hover:text-grape"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              reset pilihan
            </button>
          )}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {MERCHANTS.map((m) => {
            const active = merchantId === m.id;
            const c = CATS[m.cat];
            return (
              <button
                key={m.id}
                onClick={() => pickMerchant(m)}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                  active
                    ? "border-grape bg-grapesoft/60"
                    : "border-edge bg-field hover:border-grape/50"
                }`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base"
                  style={{ backgroundColor: `${c.color}22`, color: c.color }}
                >
                  {m.name.slice(0, 1)}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-ink">{m.name}</span>
                  <span className="block text-xs text-mute">
                    {c.label} · {m.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <label className="text-xs font-bold text-mute">Nominal bayar (Rp)</label>
          <div className="relative mt-1.5 max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-mute">
              Rp
            </span>
            <input
              type="number"
              min={500}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErr("");
              }}
              placeholder="cth. 28000"
              className="w-full rounded-xl bg-field py-3 pl-11 pr-4 text-sm font-bold text-ink outline-none ring-1 ring-edge focus:ring-2 focus:ring-grape"
            />
          </div>
          {err && (
            <p className="mt-3 rounded-xl bg-coral/10 px-4 py-2.5 text-xs font-bold text-coral">
              {err}
            </p>
          )}
        </div>
      </div>

      {/* Panel QR */}
      <div className="rounded-2xl border border-edge bg-card p-5 text-center md:p-6 lg:col-span-2">
        <h2 className="text-left font-bold text-ink">Scan untuk bayar</h2>
        {merchant ? (
          <>
            <div className="mx-auto mt-4 w-fit rounded-2xl bg-white p-4 shadow-lg">
              <QrMock seed={`${merchant.id}-${amount || "0"}`} />
            </div>
            <p className="mt-3 text-sm font-extrabold text-ink">{merchant.name}</p>
            <p className="text-xs text-mute">
              {cat.label} · NMID ID20SALD•••• (mock)
            </p>
            <p className="mt-1 text-2xl font-extrabold text-grapelight">
              {amt ? rupiah(amt) : "Rp 0"}
            </p>
            <p className="mt-2 rounded-xl bg-gold/10 px-3 py-2 text-[11px] font-semibold leading-relaxed text-gold">
              QR dekoratif — bukan kode pembayaran asli. QRIS disebut sebagai
              metode generik, tanpa afiliasi resmi.
            </p>
            <button
              onClick={submit}
              disabled={!amt}
              className="mt-4 w-full rounded-xl bg-grape py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-grapedeep disabled:cursor-not-allowed disabled:opacity-40"
            >
              Simulasikan Pembayaran
            </button>
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge p-8 text-mute">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-grapesoft text-grapelight">
              <QrPlaceholder />
            </div>
            <p className="text-sm font-semibold">
              Pilih merchant untuk menampilkan QR simulasi
            </p>
            <p className="text-xs text-mute/80">
              QR yang muncul adalah gambar dekoratif buatan sendiri, bukan kode
              pembayaran asli.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function QrPlaceholder() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M21 14v.01" />
      <path d="M14 21v.01" />
      <path d="M17.5 17.5H21v3.5" />
    </svg>
  );
}
