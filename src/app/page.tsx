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
  const fetchMetrics = async (outletId?: number) => {
    setLoadingMetrics(true);
    try {
      const url = outletId ? `/api/dashboard?outletId=${outletId}` : "/api/dashboard";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
      }
    } catch (err) {
      console.error(err);
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
    fetchMetrics(outlet.id);
  };

  // Refresh all state on modification
  const handleRefreshData = () => {
    fetchMetrics(currentOutlet?.id);
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
