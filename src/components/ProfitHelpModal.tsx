"use client";

import React, { useState } from "react";
import { X, HelpCircle, ArrowRight, Minus, Equal, Sparkles, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface ProfitHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfitHelpModal({ isOpen, onClose }: ProfitHelpModalProps) {
  const [simOmzet, setSimOmzet] = useState<number>(800000);
  const [simHpp, setSimHpp] = useState<number>(400000);
  const [simBeban, setSimBeban] = useState<number>(150000);

  if (!isOpen) return null;

  const simLabaKotor = Math.max(0, simOmzet - simHpp);
  const simLabaBersih = simLabaKotor - simBeban;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#FFFBF5] p-6 shadow-2xl border border-amber-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E52D27]/10 text-[#E52D27]">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              Bagaimana Aplikasi Mengetahui Keuntungan?
            </h2>
            <p className="text-xs text-slate-500">
              Formula standar keuangan franchise D&apos;Kriuk
            </p>
          </div>
        </div>

        {/* Visual formula cards */}
        <div className="mt-5 space-y-4">
          {/* Step 1: Laba Kotor */}
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-amber-100/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E52D27]">
              Langkah 1: Menghitung Laba Kotor
            </span>
            <div className="mt-3 flex items-center justify-between text-center">
              {/* Box 1 */}
              <div className="flex-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <span className="text-base font-bold">💰</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-800">Penjualan</p>
                <p className="text-[10px] text-slate-500">(Omzet)</p>
              </div>

              <div className="px-1 text-slate-400 font-black">
                <Minus className="h-4 w-4" />
              </div>

              {/* Box 2 */}
              <div className="flex-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <span className="text-base font-bold">📦</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-800">HPP</p>
                <p className="text-[10px] text-slate-500">(Biaya Bahan)</p>
              </div>

              <div className="px-1 text-slate-400 font-black">
                <Equal className="h-4 w-4" />
              </div>

              {/* Box 3 */}
              <div className="flex-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <span className="text-base font-bold">📈</span>
                </div>
                <p className="mt-1 text-xs font-bold text-blue-900">Laba Kotor</p>
                <p className="text-[10px] text-blue-600">Untung Produk</p>
              </div>
            </div>
          </div>

          {/* Step 2: Laba Bersih */}
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-amber-100/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Langkah 2: Menghitung Laba Bersih
            </span>
            <div className="mt-3 flex items-center justify-between text-center">
              {/* Box 1 */}
              <div className="flex-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <span className="text-base font-bold">📈</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-800">Laba Kotor</p>
                <p className="text-[10px] text-slate-500">Omzet - HPP</p>
              </div>

              <div className="px-1 text-slate-400 font-black">
                <Minus className="h-4 w-4" />
              </div>

              {/* Box 2 */}
              <div className="flex-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <span className="text-base font-bold">👛</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-slate-800">Beban Operasional</p>
                <p className="text-[10px] text-slate-500">(Gaji &amp; Listrik)</p>
              </div>

              <div className="px-1 text-slate-400 font-black">
                <Equal className="h-4 w-4" />
              </div>

              {/* Box 3 */}
              <div className="flex-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <span className="text-base font-bold">💵</span>
                </div>
                <p className="mt-1 text-xs font-bold text-emerald-900">Laba Bersih</p>
                <p className="text-[10px] text-emerald-600">Uang Masuk Kas</p>
              </div>
            </div>
          </div>

          {/* Interactive Calculator / Illustration */}
          <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wide text-amber-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                Simulasi Perhitungan Nyata
              </h3>
              <span className="text-[11px] font-medium text-amber-700">Contoh Kasus D&apos;Kriuk</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-amber-200/40">
                <span className="text-slate-600">Total Penjualan (Omzet)</span>
                <span className="font-semibold text-slate-900">{formatRupiah(simOmzet)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-200/40">
                <span className="text-slate-600">HPP (Ayam, Tepung, Minyak)</span>
                <span className="font-semibold text-red-600">- {formatRupiah(simHpp)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-200/40 bg-white/60 px-2 rounded-lg">
                <span className="font-bold text-slate-800">Laba Kotor</span>
                <span className="font-bold text-blue-700">{formatRupiah(simLabaKotor)}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-amber-200/40">
                <span className="text-slate-600">Beban Operasional (Listrik &amp; Karyawan)</span>
                <span className="font-semibold text-red-600">- {formatRupiah(simBeban)}</span>
              </div>
              <div className="flex items-center justify-between py-2 bg-emerald-50 px-2.5 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 text-sm">Laba Bersih Akhir</span>
                <span className="font-extrabold text-emerald-700 text-base">{formatRupiah(simLabaBersih)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational footer banner */}
        <div className="mt-5 rounded-2xl bg-amber-100/60 p-3.5 text-center text-xs text-amber-900 italic flex items-center justify-center gap-2">
          <span>✨ &ldquo;Pencatatan yang baik, untuk keuntungan yang lebih besar!&rdquo;</span>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-[#E52D27] py-3 text-center text-sm font-bold text-white shadow-md shadow-red-200 hover:bg-[#D32F2F] transition-all"
        >
          Mengerti, Lanjutkan
        </button>
      </div>
    </div>
  );
}
