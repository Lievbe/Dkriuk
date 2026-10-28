"use client";

import React, { useState, useEffect } from "react";
import { 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  HelpCircle, 
  TrendingUp, 
  ArrowDownRight, 
  Sparkles,
  Download,
  Share2
} from "lucide-react";
import { FinancialReportData } from "@/lib/types";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import * as XLSX from "xlsx";

interface ReportViewProps {
  onOpenHelp: () => void;
}

export default function ReportView({ onOpenHelp }: ReportViewProps) {
  const [timeframe, setTimeframe] = useState<"Harian" | "Mingguan" | "Bulanan">("Harian");
  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState<FinancialReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?timeframe=${timeframe}&date=${date}`);
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [timeframe, date]);

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    if (!report) return;

    // 1. Financial Summary sheet
    const summaryData = [
      ["LAPORAN KEUANGAN D'KRIUK FINANCE"],
      ["Periode:", report.timeframe],
      ["Tanggal:", report.startDate + " s/d " + report.endDate],
      [""],
      ["KOMPONEN KEUANGAN", "JUMLAH (IDR)", "FORMULA / KETERANGAN"],
      ["Total Penjualan (Omzet)", report.totalSales, "Total omzet transaksi penjualan"],
      ["HPP (Biaya Bahan Baku)", report.totalHpp, "Harga Pokok Penjualan"],
      ["Laba Kotor", report.grossProfit, "= Total Penjualan - HPP"],
      ["Beban Operasional", report.operationalExpenses, "Gaji, Listrik, Sewa & Dll"],
      ["Estimasi Laba Bersih", report.netProfit, "= Laba Kotor - Beban Operasional"],
      [""],
      ["Porsi Terjual Total", report.totalPortions, "Porsi"],
    ];

    // 2. Product breakdown sheet
    const productData = [
      ["PRODUK", "KATEGORI", "PORSI TERJUAL", "OMZET (IDR)", "HPP (IDR)", "LABA KOTOR (IDR)", "MARGIN (%)"],
      ...report.productBreakdown.map((p) => [
        p.name,
        p.category,
        p.portionsSold,
        p.omzet,
        p.totalCost,
        p.grossProfit,
        `${p.marginPercent}%`,
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    const wsProducts = XLSX.utils.aoa_to_sheet(productData);

    XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan Keuangan");
    XLSX.utils.book_append_sheet(wb, wsProducts, "Laba per Produk");

    XLSX.writeFile(wb, `Laporan_Keuangan_DKriuk_${report.timeframe}_${report.startDate}.xlsx`);
  };

  // Export / Print PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-24 print:p-0 print:m-0">
      {/* Time Filter Tabs matching screenshot */}
      <div className="flex rounded-2xl bg-slate-100 p-1 print:hidden">
        {(["Harian", "Mingguan", "Bulanan"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
              timeframe === t
                ? "bg-[#E52D27] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Date Picker row */}
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-xs border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Calendar className="h-4 w-4 text-[#E52D27]" />
          <span>{date ? formatDateIndo(date) : "Hari Ini"}</span>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none"
        />
      </div>

      {/* Financial Summary Section matching screenshot */}
      <div className="rounded-3xl bg-white p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Ringkasan Keuangan</h3>
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#E52D27] hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Rumus Laba</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {/* Total Penjualan (Omzet) */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600 font-medium">Total Penjualan (Omzet)</span>
            <span className="font-extrabold text-slate-900">
              {formatRupiah(report?.totalSales ?? 800000)}
            </span>
          </div>

          {/* HPP */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600 font-medium">HPP</span>
            <span className="font-extrabold text-slate-900">
              {formatRupiah(report?.totalHpp ?? 400000)}
            </span>
          </div>

          {/* Laba Kotor */}
          <div className="flex items-center justify-between py-1 border-t border-slate-100 pt-2 font-semibold">
            <span className="text-slate-800">Laba Kotor</span>
            <span className="font-extrabold text-slate-900">
              {formatRupiah(report?.grossProfit ?? 400000)}
            </span>
          </div>

          {/* Beban Operasional */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-600 font-medium">Beban Operasional</span>
            <span className="font-extrabold text-slate-900">
              {formatRupiah(report?.operationalExpenses ?? 150000)}
            </span>
          </div>

          {/* Estimasi Laba Bersih [Highlighted in Bold Green Text] */}
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-3.5 py-3 border border-emerald-200 mt-2">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                Estimasi Laba Bersih
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                (= Laba Kotor - Beban)
              </span>
            </div>
            <span className="text-lg font-black text-emerald-600">
              {formatRupiah(report?.netProfit ?? 250000)}
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Table: "Laba per Produk" matching screenshot */}
      <div className="rounded-3xl bg-white p-5 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
          <h3 className="text-sm font-bold text-slate-900">Laba per Produk</h3>
          <span className="text-[11px] text-slate-400">Total {report?.totalPortions ?? 70} Porsi</span>
        </div>

        {/* Table header */}
        <div className="flex items-center justify-between py-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
          <span className="w-2/5">Produk</span>
          <span className="w-3/10 text-right">Omzet</span>
          <span className="w-3/10 text-right">Laba Kotor</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-slate-100 text-xs">
          {report?.productBreakdown.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50 transition-colors"
            >
              <div className="w-2/5 min-w-0 pr-1">
                <p className="font-bold text-slate-900 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400">{item.portionsSold} porsi</p>
              </div>

              <div className="w-3/10 text-right">
                <span className="font-semibold text-slate-800">
                  {formatRupiah(item.omzet)}
                </span>
              </div>

              <div className="w-3/10 text-right">
                <span className="font-bold text-emerald-600">
                  {formatRupiah(item.grossProfit)}
                </span>
                <span className="block text-[9px] text-slate-400">
                  Margin {item.marginPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Action Buttons matching requirements */}
      <div className="flex gap-2.5 print:hidden">
        <button
          onClick={handleExportExcel}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 px-4 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-98 transition-all"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Unduh Excel (.xlsx)</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white py-3 px-4 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 active:scale-98 transition-all"
        >
          <Printer className="h-4 w-4 text-slate-600" />
          <span>Cetak / PDF</span>
        </button>
      </div>
    </div>
  );
}
