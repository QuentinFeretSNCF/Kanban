export function getMonday(input: Date | string | number): Date {
  const date = new Date(input);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function toISODate(d: Date | string | number): string {
  const dt = new Date(d);
  const off = dt.getTimezoneOffset();
  return new Date(dt.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function sprintKeyFor(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  return toISODate(getMonday(new Date(dateStr + "T00:00:00")));
}
