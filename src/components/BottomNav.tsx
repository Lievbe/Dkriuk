"use client";

import React from "react";
import { Home, ShoppingBag, Receipt, Package, BarChart3 } from "lucide-react";

export type TabType = "beranda" | "penjualan" | "pengeluaran" | "stok" | "laporan";

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount?: number;
  lowStockCount?: number;
}

export default function BottomNav({
  currentTab,
  onTabChange,
  cartCount = 0,
  lowStockCount = 0,
}: BottomNavProps) {
  const navItems = [
    {
      id: "beranda" as TabType,
      label: "Beranda",
      icon: Home,
    },
    {
      id: "penjualan" as TabType,
      label: "Penjualan",
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: "pengeluaran" as TabType,
      label: "Pengeluaran",
      icon: Receipt,
    },
    {
      id: "stok" as TabType,
      label: "Stok",
      icon: Package,
      badge: lowStockCount > 0 ? "!" : undefined,
      badgeColor: "bg-amber-500",
    },
    {
      id: "laporan" as TabType,
      label: "Laporan",
      icon: BarChart3,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-md items-center justify-around py-1.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-[#E52D27] font-bold"
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
                  }`}
                />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-black text-white ${
                      item.badgeColor || "bg-[#E52D27]"
                    } shadow-xs`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? "text-[#E52D27]" : "text-slate-500"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-[#E52D27]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
