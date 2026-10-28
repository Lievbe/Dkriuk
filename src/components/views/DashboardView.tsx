"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Package, 
  Wallet, 
  UtensilsCrossed, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  Receipt
} from "lucide-react";
import { formatRupiah, formatNumber } from "@/lib/utils";
import { DashboardMetrics } from "@/lib/types";

interface DashboardViewProps {
  metrics: DashboardMetrics | null;
  loading: boolean;
  onGoToSales: () => void;
  onGoToExpense: () => void;
  onGoToReport: () => void;
  onOpenHelp: () => void;
}

export default function DashboardView({
  metrics,
  loading,
  onGoToSales,
  onGoToExpense,
  onGoToReport,
  onOpenHelp,
}: DashboardViewProps) {
  const [selectedBar, setSelectedBar] = useState<number | null>(6); // Default to today (last bar)

  if (loading || !metrics) {
    return (
      <div className="space-y-4 animate-pulse p-4">
        <div className="h-44 rounded-3xl bg-slate-200/80" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 rounded-2xl bg-slate-200/70" />
          <div className="h-28 rounded-2xl bg-slate-200/70" />
          <div className="h-28 rounded-2xl bg-slate-200/70" />
          <div className="h-28 rounded-2xl bg-slate-200/70" />
        </div>
        <div className="h-60 rounded-3xl bg-slate-200/60" />
      </div>
    );
  }

  // Find maximum amount in 7 days for scaling bars
  const maxAmount = Math.max(...metrics.dailySales7Days.map((d) => d.amount), 900000);

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Top Hero Card (Dark Red Background #D32F2F / #B71C1C) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E52D27] via-[#D32F2F] to-[#B71C1C] p-5 text-white shadow-lg shadow-red-900/15">
        {/* Subtle decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-amber-400/15 blur-lg pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-100">
              Estimasi Laba Bersih Hari Ini
            </span>
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs backdrop-blur-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+{metrics.netProfitGrowth}%</span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {formatRupiah(metrics.netProfitToday)}
            </h2>
          </div>

          <div className="mt-1 flex items-center justify-between text-xs text-red-100/90">
            <p>Dibanding kemarin</p>
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-200 hover:text-white transition-colors underline underline-offset-2"
            >
              <Sparkles className="h-3 w-3" />
              Cara Hitung
            </button>
          </div>
        </div>
      </div>

      {/* 2. Summary Metrics Grid (4 Cards) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Penjualan */}
        <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{metrics.salesGrowth}%</span>
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[11px] font-medium text-slate-500">Penjualan (Omzet)</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatRupiah(metrics.salesToday)}
            </p>
          </div>
        </div>

        {/* Card 2: HPP */}
        <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-0.5 text-[11px] font-bold text-orange-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{metrics.hppGrowth}%</span>
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[11px] font-medium text-slate-500">HPP (Bahan Baku)</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatRupiah(metrics.hppToday)}
            </p>
          </div>
        </div>

        {/* Card 3: Beban Operasional */}
        <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
              <TrendingDown className="h-3 w-3" />
              <span>{metrics.expensesGrowth > 0 ? `+${metrics.expensesGrowth}` : metrics.expensesGrowth}%</span>
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[11px] font-medium text-slate-500">Beban Operasional</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatRupiah(metrics.operationalExpensesToday)}
            </p>
          </div>
        </div>

        {/* Card 4: Produk Terjual */}
        <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{metrics.itemsSoldGrowth}%</span>
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-[11px] font-medium text-slate-500">Produk Terjual</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatNumber(metrics.itemsSoldToday)} Porsi
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onGoToSales}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#E52D27] py-3 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] active:scale-98 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Input Penjualan</span>
        </button>
        <button
          onClick={onGoToExpense}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 px-4 text-xs font-bold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all"
        >
          <Receipt className="h-4 w-4" />
          <span>Input Pengeluaran</span>
        </button>
      </div>

      {/* 3. Chart Section: "Grafik Penjualan 7 Hari Terakhir" */}
      <div className="rounded-3xl bg-white p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Grafik Penjualan 7 Hari Terakhir
            </h3>
            <p className="text-[11px] text-slate-400">Total volume penjualan harian</p>
          </div>
          <button
            onClick={onGoToReport}
            className="flex items-center gap-0.5 text-xs font-semibold text-[#E52D27] hover:underline"
          >
            <span>Lihat Detail</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Selected bar tooltip summary */}
        {selectedBar !== null && metrics.dailySales7Days[selectedBar] && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-amber-50/80 px-3 py-2 text-xs border border-amber-200/50">
            <div>
              <span className="font-bold text-slate-800">
                {metrics.dailySales7Days[selectedBar].dayName},{" "}
                {metrics.dailySales7Days[selectedBar].date}
              </span>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-[#E52D27]">
                {formatRupiah(metrics.dailySales7Days[selectedBar].amount)}
              </span>
              <span className="ml-1 text-[10px] text-slate-500">
                ({metrics.dailySales7Days[selectedBar].portions} porsi)
              </span>
            </div>
          </div>
        )}

        {/* Bar Chart Visualization */}
        <div className="flex h-44 items-end justify-between gap-2 pt-4 pb-2 px-1">
          {metrics.dailySales7Days.map((item, index) => {
            const heightPercent = Math.max(15, Math.round((item.amount / maxAmount) * 100));
            const isSelected = selectedBar === index;
            const isToday = index === metrics.dailySales7Days.length - 1;

            return (
              <div
                key={index}
                onClick={() => setSelectedBar(index)}
                className="group flex flex-1 flex-col items-center cursor-pointer transition-all"
              >
                {/* Bar */}
                <div className="relative flex h-32 w-full max-w-[28px] items-end justify-center rounded-xl bg-slate-100 p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-300 ${
                      isSelected
                        ? "bg-[#E52D27] shadow-md shadow-red-300"
                        : isToday
                        ? "bg-red-400 hover:bg-[#E52D27]"
                        : "bg-blue-400 group-hover:bg-blue-500"
                    }`}
                  />
                </div>
                {/* Day label */}
                <span
                  className={`mt-2 text-[11px] font-semibold transition-colors ${
                    isSelected
                      ? "text-[#E52D27] font-bold"
                      : isToday
                      ? "text-slate-900 font-bold"
                      : "text-slate-400"
                  }`}
                >
                  {item.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
