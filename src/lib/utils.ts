export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\u00A0/, " ");
}

export function formatNumber(amount: number): string {
  if (isNaN(amount)) return "0";
  return new Intl.NumberFormat("id-ID").format(amount);
}

export function parseRupiahInput(value: string): number {
  const numeric = value.replace(/[^0-9]/g, "");
  return numeric ? parseInt(numeric, 10) : 0;
}

export function formatDateIndo(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export function getDayNameIndo(date: Date): string {
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return days[date.getDay()];
}

// Financial formulas explicitly required:
// 1. Laba Kotor = Total Penjualan (Omzet) - HPP (Biaya Bahan)
export function calculateGrossProfit(omzet: number, hpp: number): number {
  return omzet - hpp;
}

// 2. Laba Bersih = Laba Kotor - Beban Operasional
export function calculateNetProfit(grossProfit: number, operationalExpenses: number): number {
  return grossProfit - operationalExpenses;
}
