import { MessageCircle, Wallet } from "lucide-react";
import { WA_NUMBER } from "../data/seed";

const NAV = [
  { id: "dompet", label: "Dompet" },
  { id: "riwayat", label: "Riwayat" },
  { id: "analisis", label: "Analisis" },
];

export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
  "Halo Saldoara! Saya mau tanya jasa pembuatan web app seperti ini."
)}`;

export default function Navbar({ view, onNavigate }) {
  return (
    <>
      {/* Bar atas */}
      <header className="sticky top-0 z-30 border-b border-edge bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <button
            onClick={() => onNavigate("dompet")}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-grape">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Saldoara<span className="text-grape">.</span>
            </span>
            <span className="ml-1 hidden rounded-full bg-grapesoft px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-grapelight lg:inline">
              Simulasi demo
            </span>
          </button>

          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 rounded-full bg-cardhi p-1 sm:flex">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onNavigate(n.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    view === n.id
                      ? "bg-grape text-white shadow-sm"
                      : "text-mute hover:text-grapelight"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full bg-grapesoft px-4 py-2 text-sm font-bold text-grapelight transition-colors hover:bg-grape hover:text-white md:inline-flex"
            >
              <MessageCircle className="h-4 w-4" />
              62812-3456-7890
            </a>
          </div>
        </div>
      </header>

      {/* Tab bawah mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-edge bg-card/95 backdrop-blur sm:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
            className={`flex-1 py-3 text-xs font-bold ${
              view === n.id ? "text-grapelight" : "text-mute"
            }`}
          >
            {n.label}
          </button>
        ))}
      </nav>
    </>
  );
}
