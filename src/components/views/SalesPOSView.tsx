"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  PlusCircle, 
  CheckCircle2, 
  Printer, 
  Share2, 
  X, 
  CreditCard,
  Banknote,
  QrCode,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { Product, CartItem } from "@/lib/types";
import { formatRupiah, formatNumber } from "@/lib/utils";

interface SalesPOSViewProps {
  products: Product[];
  onRefreshData: () => void;
  onOpenAddProduct: () => void;
}

export default function SalesPOSView({
  products,
  onRefreshData,
  onOpenAddProduct,
}: SalesPOSViewProps) {
  // Tabs: "Produk" | "Paket"
  const [activeCategory, setActiveCategory] = useState<"Produk" | "Paket">("Produk");
  
  // Cart state: Map of productId -> quantity
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({
    // Initial demo values matching screenshot: 20 Ayam Ori, 10 Ayam Pedas, 15 Paket Nasi, 25 Minuman
  });

  const [paymentMethod, setPaymentMethod] = useState<"Tunai" | "QRIS" | "Transfer">("QRIS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<any | null>(null);

  // Initialize standard quantities once products load if empty
  React.useEffect(() => {
    if (Object.keys(cartQuantities).length === 0 && products.length > 0) {
      const initialMap: Record<number, number> = {};
      products.forEach((p) => {
        if (p.name.includes("Ayam Original")) initialMap[p.id] = 20;
        else if (p.name.includes("Ayam Pedas")) initialMap[p.id] = 10;
        else if (p.name.includes("Paket Nasi")) initialMap[p.id] = 15;
        else if (p.name.includes("Minuman")) initialMap[p.id] = 25;
        else initialMap[p.id] = 0;
      });
      setCartQuantities(initialMap);
    }
  }, [products]);

  // Filter products by active category
  const filteredProducts = products.filter((p) => {
    if (activeCategory === "Produk") {
      return p.category === "Produk";
    } else {
      return p.category === "Paket";
    }
  });

  // Quantity handlers
  const handleIncrease = (id: number, maxStock: number) => {
    setCartQuantities((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current + 1 };
    });
  };

  const handleDecrease = (id: number) => {
    setCartQuantities((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.max(0, current - 1) };
    });
  };

  const handleManualQtyChange = (id: number, val: string) => {
    const num = parseInt(val, 10);
    setCartQuantities((prev) => ({
      ...prev,
      [id]: isNaN(num) || num < 0 ? 0 : num,
    }));
  };

  // Calculate Total Omzet
  const totalOmzet = products.reduce((acc, p) => {
    const qty = cartQuantities[p.id] || 0;
    return acc + qty * p.price;
  }, 0);

  const totalPortions = products.reduce((acc, p) => {
    return acc + (cartQuantities[p.id] || 0);
  }, 0);

  // Handle Save Transaction
  const handleSaveTransaction = async () => {
    // Collect non-zero items
    const selectedItems = products
      .filter((p) => (cartQuantities[p.id] || 0) > 0)
      .map((p) => ({
        productId: p.id,
        name: p.name,
        quantity: cartQuantities[p.id],
        price: p.price,
        costPrice: p.costPrice,
      }));

    if (selectedItems.length === 0) {
      alert("Pilih minimal 1 produk untuk menyimpan transaksi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems,
          paymentMethod,
          notes: "Input dari POS D'Kriuk",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setLastCompletedSale(json.sale);
        onRefreshData();
      } else {
        alert("Gagal menyimpan transaksi: " + json.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetOrder = () => {
    const resetMap: Record<number, number> = {};
    products.forEach((p) => {
      resetMap[p.id] = 0;
    });
    setCartQuantities(resetMap);
    setLastCompletedSale(null);
  };

  return (
    <div className="space-y-4 pb-32">
      {/* Top category toggle tabs matching screenshot */}
      <div className="flex rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() => setActiveCategory("Produk")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
            activeCategory === "Produk"
              ? "bg-[#E52D27] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Produk
        </button>
        <button
          onClick={() => setActiveCategory("Paket")}
          className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
            activeCategory === "Paket"
              ? "bg-[#E52D27] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Paket
        </button>
      </div>

      {/* Item List View */}
      <div className="space-y-2.5">
        {filteredProducts.map((item) => {
          const qty = cartQuantities[item.id] || 0;
          const isLowStock = item.stock <= item.minStock;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-2xl bg-white p-3 shadow-xs border transition-all ${
                qty > 0 ? "border-red-200 bg-red-50/20" : "border-slate-100"
              }`}
            >
              {/* Thumbnail & Info */}
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-amber-50 border border-slate-100">
                  <Image
                    src={item.image || "/images/ayam-original.png"}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                  {isLowStock && (
                    <span className="absolute bottom-0 inset-x-0 bg-red-600/90 text-white text-[9px] font-bold text-center py-0.5">
                      Sisa {item.stock}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {formatRupiah(item.price)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Stok: <span className={isLowStock ? "text-red-500 font-bold" : "text-slate-600"}>{item.stock}</span> | HPP: {formatRupiah(item.costPrice)}
                  </p>
                </div>
              </div>

              {/* Counter UI: Minus (-), Qty, Plus (+) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDecrease(item.id)}
                  disabled={qty === 0}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                    qty > 0
                      ? "border-red-300 bg-red-50 text-[#E52D27] hover:bg-red-100"
                      : "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
                  }`}
                  aria-label="Kurang"
                >
                  <Minus className="h-3.5 w-3.5 stroke-[3]" />
                </button>

                <input
                  type="text"
                  value={qty}
                  onChange={(e) => handleManualQtyChange(item.id, e.target.value)}
                  className="w-10 text-center text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-400 rounded-md"
                />

                <button
                  type="button"
                  onClick={() => handleIncrease(item.id, item.stock)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E52D27] text-white shadow-xs hover:bg-[#D32F2F] active:scale-95 transition-all"
                  aria-label="Tambah"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-400 border border-slate-100">
            Tidak ada produk dalam kategori ini.
          </div>
        )}
      </div>

      {/* Button: + Tambah Produk Lain */}
      <button
        onClick={onOpenAddProduct}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 py-3 text-xs font-bold text-[#E52D27] hover:bg-red-50 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>+ Tambah Produk Lain</span>
      </button>

      {/* Payment Method Selector */}
      <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Metode Pembayaran
        </span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("QRIS")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-xs font-bold transition-all ${
              paymentMethod === "QRIS"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>QRIS</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("Tunai")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-xs font-bold transition-all ${
              paymentMethod === "Tunai"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Banknote className="h-3.5 w-3.5" />
            <span>Tunai</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("Transfer")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-xs font-bold transition-all ${
              paymentMethod === "Transfer"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* Floating Sales Summary Footer matching the mockup */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-lg">
        <div className="mx-auto max-w-md">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-700">Ringkasan Penjualan</p>
              <p className="text-[10px] text-slate-400">{totalPortions} Porsi dipilih</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 mr-2">Total Omzet</span>
              <span className="text-lg font-black text-slate-900">
                {formatRupiah(totalOmzet)}
              </span>
            </div>
          </div>

          <button
            disabled={totalOmzet === 0 || isSubmitting}
            onClick={handleSaveTransaction}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-md transition-all ${
              totalOmzet > 0 && !isSubmitting
                ? "bg-[#E52D27] hover:bg-[#D32F2F] shadow-red-200 active:scale-98"
                : "bg-slate-300 cursor-not-allowed shadow-none"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">Menyimpan Transaksi...</span>
            ) : (
              <span>Simpan Transaksi</span>
            )}
          </button>
        </div>
      </div>

      {/* Receipt Modal on Transaction Complete */}
      {lastCompletedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-2 text-lg font-bold text-slate-900">Transaksi Berhasil!</h3>
              <p className="text-xs text-slate-500">{lastCompletedSale.invoiceNumber}</p>
            </div>

            {/* Receipt Details */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-semibold text-slate-700">
                <span>Metode Bayar:</span>
                <span className="text-[#E52D27]">{lastCompletedSale.paymentMethod}</span>
              </div>

              <div className="space-y-1.5 py-1">
                {lastCompletedSale.items?.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-slate-600">
                    <span>
                      {it.quantity}x {it.productName}
                    </span>
                    <span className="font-medium text-slate-900">{formatRupiah(it.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Omzet:</span>
                  <span>{formatRupiah(lastCompletedSale.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Total HPP:</span>
                  <span>{formatRupiah(lastCompletedSale.totalCost)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-emerald-600">
                  <span>Estimasi Laba Kotor:</span>
                  <span>+{formatRupiah(lastCompletedSale.grossProfit)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak</span>
              </button>
              <button
                onClick={handleResetOrder}
                className="flex-1 rounded-xl bg-[#E52D27] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F]"
              >
                Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
