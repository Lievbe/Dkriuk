"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  Package, 
  Edit3, 
  Check, 
  X, 
  Trash2, 
  ArrowUpDown,
  Sparkles
} from "lucide-react";
import { Product } from "@/lib/types";
import { formatRupiah, formatNumber } from "@/lib/utils";

interface StockViewProps {
  products: Product[];
  onRefreshData: () => void;
  onOpenAddModal: () => void;
}

export default function StockView({
  products,
  onRefreshData,
  onOpenAddModal,
}: StockViewProps) {
  // Tabs: [Daftar Produk, Stok]
  const [activeTab, setActiveTab] = useState<"Daftar Produk" | "Stok">("Daftar Produk");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter products by search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick adjust stock
  const handleSaveStock = async () => {
    if (!editingStockProduct) return;
    setIsUpdating(true);
    try {
      const newStock = Math.max(0, editingStockProduct.stock + stockAdjustment);
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStockProduct.id,
          stock: newStock,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingStockProduct(null);
        setStockAdjustment(0);
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Hapus produk ini dari daftar?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Action Bar: Search & + Tambah Produk */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk / paket..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 shadow-2xs focus:border-[#E52D27] focus:outline-none"
          />
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-[#E52D27] py-2.5 px-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Tab Switcher: [Daftar Produk, Stok] matching screenshot */}
      <div className="flex rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab("Daftar Produk")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
            activeTab === "Daftar Produk"
              ? "bg-[#E52D27] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Daftar Produk
        </button>
        <button
          onClick={() => setActiveTab("Stok")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
            activeTab === "Stok"
              ? "bg-[#E52D27] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Stok &amp; Inventaris
        </button>
      </div>

      {/* Table Header Row matching screenshot */}
      <div className="rounded-2xl bg-white p-3 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-2">
          <span className="w-1/2">Produk</span>
          <span className="w-1/4 text-center">Stok</span>
          <span className="w-1/4 text-right">Harga Jual</span>
        </div>

        {/* Product Items List */}
        <div className="divide-y divide-slate-100">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock <= p.minStock;

            return (
              <div
                key={p.id}
                className="flex items-center justify-between py-2.5 px-1 text-xs hover:bg-slate-50/60 transition-colors rounded-xl"
              >
                {/* Column 1: Image & Name */}
                <div className="flex items-center gap-2.5 w-1/2">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-amber-50 border border-slate-100">
                    <Image
                      src={p.image || "/images/ayam-original.png"}
                      alt={p.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 pr-1">
                    <p className="font-bold text-slate-900 truncate leading-tight">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      HPP: {formatRupiah(p.costPrice)}
                    </p>
                  </div>
                </div>

                {/* Column 2: Stock Level */}
                <div className="w-1/4 text-center">
                  <button
                    onClick={() => {
                      setEditingStockProduct(p);
                      setStockAdjustment(0);
                    }}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold text-xs transition-colors ${
                      isLowStock
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                    title="Klik untuk ubah stok"
                  >
                    <span>{p.stock}</span>
                    {isLowStock && <AlertTriangle className="h-3 w-3 text-red-600" />}
                  </button>
                  {isLowStock && (
                    <span className="block text-[9px] font-bold text-red-600 mt-0.5">
                      Menipis!
                    </span>
                  )}
                </div>

                {/* Column 3: Selling Price & Actions */}
                <div className="w-1/4 text-right">
                  <span className="font-bold text-slate-900 block">
                    {formatRupiah(p.price)}
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <button
                      onClick={() => {
                        setEditingStockProduct(p);
                        setStockAdjustment(0);
                      }}
                      className="text-slate-400 hover:text-[#E52D27] p-0.5"
                      title="Edit Stok"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-slate-300 hover:text-red-500 p-0.5"
                      title="Hapus"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              Tidak ada produk yang cocok dengan pencarian.
            </div>
          )}
        </div>
      </div>

      {/* Quick Restock Drawer / Modal */}
      {editingStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Update Stok: {editingStockProduct.name}
              </h3>
              <button
                onClick={() => setEditingStockProduct(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-center">
              <p className="text-xs text-slate-500">Stok saat ini di sistem:</p>
              <div className="text-2xl font-black text-slate-900">
                {editingStockProduct.stock} Porsi
              </div>

              {/* Adjustment buttons */}
              <div className="flex items-center justify-center gap-2">
                {[-10, -5, +5, +10, +20].map((adj) => (
                  <button
                    key={adj}
                    onClick={() => setStockAdjustment((prev) => prev + adj)}
                    className="rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    {adj > 0 ? `+${adj}` : adj}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-amber-50 p-3 text-xs border border-amber-200/60">
                <p className="text-slate-600">Perubahan stok:</p>
                <p className="text-sm font-bold text-slate-900">
                  {stockAdjustment >= 0 ? `+${stockAdjustment}` : stockAdjustment} =&gt;{" "}
                  <span className="text-[#E52D27] font-black">
                    {Math.max(0, editingStockProduct.stock + stockAdjustment)} Porsi
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingStockProduct(null)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                disabled={isUpdating}
                onClick={handleSaveStock}
                className="flex-1 rounded-xl bg-[#E52D27] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] disabled:opacity-50"
              >
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
