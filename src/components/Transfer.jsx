import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CONTACTS, initialsOf } from "../data/seed";
import { rupiah } from "../utils/format";
import ActionSuccess from "./ActionSuccess";

export default function Transfer({ balance, onCommit, onNavigate }) {
  const [contactId, setContactId] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState("form"); // form | process | done
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);

  const contact = CONTACTS.find((c) => c.id === contactId) || null;
  const amt = Number(amount) || 0;
  const pointsEarned = Math.floor(amt / 10000);

  const submit = () => {
    if (!contact) {
      setErr("Pilih dulu salah satu kontak tujuan.");
      return;
    }
    if (!amt || amt < 10000) {
      setErr("Nominal transfer minimal Rp10.000.");
      return;
    }
    if (amt > balance) {
      setErr("Saldo tidak cukup untuk transfer sebesar ini.");
      return;
    }
    setErr("");
    setStep("process");
    setTimeout(() => {
      onCommit({
        ts: Date.now(),
        kind: "keluar",
        delta: -amt,
        cat: "transfer",
        title: `Transfer ke ${contact.name}`,
        note: note.trim() || `Ke ${contact.handle}`,
      });
      setDone({ contact, amount: amt, note: note.trim() });
      setStep("done");
    }, 1100);
  };

  const again = () => {
    setContactId(null);
    setAmount("");
    setNote("");
    setErr("");
    setStep("form");
  };

  if (step === "process") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-edge bg-card p-12">
        <Loader2 className="h-10 w-10 animate-spin text-grape" />
        <p className="text-sm font-semibold text-mute">Mengirim uang…</p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <ActionSuccess
        title={`Transfer ke ${done.contact.name} berhasil`}
        subtitle={done.note ? `Catatan: “${done.note}”` : undefined}
        lines={[
          ["Penerima", `${done.contact.name} (${done.contact.handle})`],
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
      {/* Kontak */}
      <div className="rounded-2xl border border-edge bg-card p-5 md:p-6 lg:col-span-2">
        <h2 className="font-bold text-ink">Pilih kontak (5 kontak demo)</h2>
        <div className="mt-4 space-y-2">
          {CONTACTS.map((c) => {
            const active = contactId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setContactId(c.id);
                  setErr("");
                }}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? "border-grape bg-grapesoft/60"
                    : "border-edge bg-field hover:border-grape/50"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${c.color}`}
                >
                  {initialsOf(c.name)}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-ink">{c.name}</span>
                  <span className="block text-xs text-mute">{c.handle}</span>
                </span>
                <span
                  className={`h-4 w-4 rounded-full border-2 ${
                    active ? "border-grape bg-grape" : "border-edge"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Form transfer */}
      <div className="rounded-2xl border border-edge bg-card p-5 md:p-6 lg:col-span-3">
        <h2 className="font-bold text-ink">Detail transfer</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-bold text-mute">Nominal (Rp)</label>
            <div className="relative mt-1.5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-mute">
                Rp
              </span>
              <input
                type="number"
                min={10000}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErr("");
                }}
                placeholder="cth. 50000"
                className="w-full rounded-xl bg-field py-3 pl-11 pr-4 text-sm font-bold text-ink outline-none ring-1 ring-edge focus:ring-2 focus:ring-grape"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-mute">Catatan (opsional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="cth. patungan makan siang"
              maxLength={60}
              className="mt-1.5 w-full rounded-xl bg-field px-4 py-3 text-sm font-semibold text-ink outline-none ring-1 ring-edge placeholder:font-normal placeholder:text-mute/60 focus:ring-2 focus:ring-grape"
            />
          </div>

          <div className="space-y-1.5 rounded-xl bg-field p-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-mute">Penerima</span>
              <span className="font-bold text-ink">{contact ? contact.name : "—"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-mute">Nominal</span>
              <span className="font-bold text-ink">{amt ? rupiah(amt) : "—"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-mute">Poin didapat</span>
              <span className="font-bold text-gold">
                {amt ? `+${pointsEarned} poin` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-edge pt-1.5">
              <span className="text-mute">Saldo setelah transfer</span>
              <span className="font-extrabold text-ink">
                {amt ? rupiah(Math.max(balance - amt, 0)) : rupiah(balance)}
              </span>
            </div>
          </div>

          {err && (
            <p className="rounded-xl bg-coral/10 px-4 py-2.5 text-xs font-bold text-coral">
              {err}
            </p>
          )}

          <button
            onClick={submit}
            disabled={!contact || !amt}
            className="w-full rounded-xl bg-grape py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-grapedeep disabled:cursor-not-allowed disabled:opacity-40"
          >
            Kirim Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
