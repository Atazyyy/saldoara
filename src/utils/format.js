export const num = (n) => n.toLocaleString("id-ID");

export const rupiah = (n) => `Rp ${Math.round(n).toLocaleString("id-ID")}`;

export const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDateTime = (ts) => `${fmtDate(ts)}, ${fmtTime(ts)}`;

export const fullDate = () =>
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const isSameDay = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isSameMonth = (a, b) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
};

// Label jatuh tempo tagihan
export const dueLabel = (ts) =>
  isSameDay(ts, Date.now())
    ? "jatuh tempo hari ini"
    : `jatuh tempo ${fmtDate(ts)}`;
