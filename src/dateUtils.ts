export function getMonday(input: Date | string | number): Date {
  const date = new Date(input);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function addDays(date: Date | string, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function toISODate(d: Date | string | number): string {
  const dt = new Date(d);
  const off = dt.getTimezoneOffset();
  return new Date(dt.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function fmtShort(d: string | null | undefined): string {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function sprintKeyFor(dateStr: string | null | undefined): string {
  if (!dateStr) return toISODate(getMonday(new Date()));
  return toISODate(getMonday(new Date(dateStr + "T00:00:00")));
}

export function sprintLabel(mondayISO: string): string {
  const start = new Date(mondayISO + "T00:00:00");
  const end = addDays(start, 4);
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = start.toLocaleDateString("fr-FR", { day: "2-digit", month: sameMonth ? undefined : "short" });
  const endStr = end.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  return `${startStr} → ${endStr}`;
}
