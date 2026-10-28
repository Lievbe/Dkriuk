"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNav, { TabType } from "@/components/BottomNav";
import DashboardView from "@/components/views/DashboardView";
import SalesPOSView from "@/components/views/SalesPOSView";
import ExpenseView from "@/components/views/ExpenseView";
import StockView from "@/components/views/StockView";
import ReportView from "@/components/views/ReportView";
import ProfitHelpModal from "@/components/ProfitHelpModal";
import LoginModal from "@/components/LoginModal";
import AddProductModal from "@/components/AddProductModal";
import { Outlet, Product, DashboardMetrics } from "@/lib/types";

const mockSalesByDay = [
  { dayName: "Sen", amount: 650000 },
  { dayName: "Sel", amount: 720000 },
  { dayName: "Rab", amount: 680000 },
  { dayName: "Kam", amount: 710000 },
  { dayName: "Jum", amount: 790000 },
  { dayName: "Sab", amount: 750000 },
  { dayName: "Min", amount: 800000 },
];

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createMockDashboardMetrics(
  outletId?: number,
  outletName?: string
): DashboardMetrics {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  return {
    outletName: outletName ?? "Outlet D'Kriuk Tebet",
    outletId: outletId ?? 1,
    netProfitToday: 250000,
    netProfitGrowth: 12,
    salesToday: 800000,
    salesGrowth: 15,
    hppToday: 400000,
    hppGrowth: 8,
    operationalExpensesToday: 150000,
    expensesGrowth: -5,
    itemsSoldToday: 65,
    itemsSoldGrowth: 18,
    dailySales7Days: mockSalesByDay.map((item, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);

      return {
        ...item,
        date: getLocalDateString(date),
        portions: Math.round(item.amount / 12300),
      };
    }),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDashboardMetrics(value: unknown): value is DashboardMetrics {
  if (!isRecord(value) || typeof value.outletName !== "string") {
    return false;
  }

  const numericFields = [
    "outletId",
    "netProfitToday",
    "netProfitGrowth",
    "salesToday",
    "salesGrowth",
    "hppToday",
    "hppGrowth",
    "operationalExpensesToday",
    "expensesGrowth",
    "itemsSoldToday",
    "itemsSoldGrowth",
  ] as const;

  return (
    numericFields.every(
      (field) => typeof value[field] === "number" && Number.isFinite(value[field])
    ) &&
    Array.isArray(value.dailySales7Days) &&
    value.dailySales7Days.every(
      (day) =>
        isRecord(day) &&
        typeof day.dayName === "string" &&
        typeof day.date === "string" &&
        typeof day.amount === "number" &&
        Number.isFinite(day.amount) &&
        typeof day.portions === "number" &&
        Number.isFinite(day.portions)
    )
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("beranda");
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [currentOutlet, setCurrentOutlet] = useState<Outlet | null>(null);

  // Core App Data
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // User state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string }>({
    name: "Budi Santoso",
    email: "owner@dkriuk.com",
    role: "Owner",
  });

  // Fetch initial outlets
  const fetchOutlets = async () => {
    try {
      const res = await fetch("/api/outlets");
      const json = await res.json();
      if (json.success && json.outlets?.length > 0) {
        setOutlets(json.outlets);
        if (!currentOutlet) {
          setCurrentOutlet(json.outlets[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch dashboard metrics
  const fetchMetrics = async (outletId?: number, outletName?: string) => {
    setLoadingMetrics(true);
    try {
      const url = outletId ? `/api/dashboard?outletId=${outletId}` : "/api/dashboard";
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Dashboard API returned HTTP ${res.status}`);
      }

      const json: unknown = await res.json();
      if (!isRecord(json) || json.success !== true || !isDashboardMetrics(json.data)) {
        throw new Error("Dashboard API returned an invalid response");
      }

      setMetrics(json.data);
    } catch (err) {
      console.error("Failed to fetch dashboard metrics; using mock data.", err);
      setMetrics(createMockDashboardMetrics(outletId, outletName));
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) {
        setProducts(json.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOutlets();
    fetchMetrics();
    fetchProducts();
  }, []);

  // When outlet changes
  const handleSelectOutlet = (outlet: Outlet) => {
    setCurrentOutlet(outlet);
    fetchMetrics(outlet.id, outlet.name);
  };

  // Refresh all state on modification
  const handleRefreshData = () => {
    fetchMetrics(currentOutlet?.id, currentOutlet?.name);
    fetchProducts();
  };

  // Calculate low-stock count
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center selection:bg-[#E52D27] selection:text-white">
      {/* Mobile-first centered phone frame container */}
      <div className="relative w-full max-w-md min-h-screen bg-[#FFFBF5] shadow-2xl flex flex-col overflow-x-hidden">
        {/* Top Header */}
        <Header
          outlets={outlets}
          currentOutlet={currentOutlet}
          onSelectOutlet={handleSelectOutlet}
          onOpenHelp={() => setIsHelpOpen(true)}
          lowStockCount={lowStockCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-3">
          {currentTab === "beranda" && (
            <DashboardView
              metrics={metrics}
              loading={loadingMetrics}
              onGoToSales={() => setCurrentTab("penjualan")}
              onGoToExpense={() => setCurrentTab("pengeluaran")}
              onGoToReport={() => setCurrentTab("laporan")}
              onOpenHelp={() => setIsHelpOpen(true)}
            />
          )}

          {currentTab === "penjualan" && (
            <SalesPOSView
              products={products}
              onRefreshData={handleRefreshData}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
            />
          )}

          {currentTab === "pengeluaran" && (
            <ExpenseView onRefreshData={handleRefreshData} />
          )}

          {currentTab === "stok" && (
            <StockView
              products={products}
              onRefreshData={handleRefreshData}
              onOpenAddModal={() => setIsAddProductOpen(true)}
            />
          )}

          {currentTab === "laporan" && (
            <ReportView onOpenHelp={() => setIsHelpOpen(true)} />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          lowStockCount={lowStockCount}
        />

        {/* Modals */}
        <ProfitHelpModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
        />

        <AddProductModal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          onSuccess={handleRefreshData}
        />
      </div>
    </div>
  );
}
