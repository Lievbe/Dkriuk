"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Bell, HelpCircle, Store, Check, AlertCircle } from "lucide-react";
import { Outlet } from "@/lib/types";

interface HeaderProps {
  outlets: Outlet[];
  currentOutlet: Outlet | null;
  onSelectOutlet: (outlet: Outlet) => void;
  onOpenHelp: () => void;
  lowStockCount?: number;
}

export default function Header({
  outlets,
  currentOutlet,
  onSelectOutlet,
  onOpenHelp,
  lowStockCount = 0,
}: HeaderProps) {
  const [outletMenuOpen, setOutletMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFFBF5]/95 backdrop-blur-md border-b border-amber-100/80 px-4 py-3">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-amber-200 bg-white shadow-xs">
            <Image
              src="/images/dkriuk-logo.png"
              alt="D'Kriuk Finance Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
              D&apos;Kriuk <span className="text-[#E52D27]">Finance</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">Franchise POS &amp; Keuangan</p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Help button */}
          <button
            onClick={onOpenHelp}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
            title="Formula &amp; Panduan Keuntungan"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              title="Notifikasi"
            >
              <Bell className="h-4 w-4" />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E52D27] text-[10px] font-bold text-white shadow-xs">
                  {lowStockCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 z-50 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 font-bold text-slate-800">
                  <span>Pemberitahuan</span>
                  <span className="text-[10px] text-slate-400">Terkini</span>
                </div>
                {lowStockCount > 0 ? (
                  <div className="rounded-xl bg-amber-50 p-2 text-amber-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Peringatan Stok Menipis!</p>
                      <p className="text-[11px] text-amber-700">
                        Ada {lowStockCount} produk di bawah batas aman. Harap lakukan restok bahan.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="py-2 text-center text-slate-500">Semua stok produk dalam status aman 👍</p>
                )}
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-[11px] font-semibold text-[#E52D27] hover:underline"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Outlet Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOutletMenuOpen(!outletMenuOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Store className="h-3.5 w-3.5 text-[#E52D27]" />
              <span className="max-w-[85px] truncate sm:max-w-[120px]">
                {currentOutlet ? currentOutlet.name.replace("Outlet D'Kriuk", "").trim() || "Tebet" : "Outlet"}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {outletMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pilih Outlet D&apos;Kriuk
                </div>
                {outlets.map((outlet) => {
                  const isSelected = currentOutlet?.id === outlet.id;
                  return (
                    <button
                      key={outlet.id}
                      onClick={() => {
                        onSelectOutlet(outlet);
                        setOutletMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-red-50 text-[#E52D27] font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <p>{outlet.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{outlet.address}</p>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-[#E52D27]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
