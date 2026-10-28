"use client";

import React, { useState } from "react";
import { X, Plus, Image as ImageIcon, Check } from "lucide-react";
import Image from "next/image";
import { parseRupiahInput, formatRupiah } from "@/lib/utils";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_IMAGES = [
  { label: "Ayam Original", url: "/images/ayam-original.png" },
  { label: "Ayam Pedas", url: "/images/ayam-pedas.png" },
  { label: "Paket Nasi", url: "/images/paket-nasi-ayam.png" },
  { label: "Minuman Es Teh", url: "/images/es-teh.png" },
  { label: "Bucket Crispy", url: "/images/fried-chicken-bucket.png" },
];

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Produk" | "Paket">("Produk");
  const [price, setPrice] = useState<number>(14000);
  const [costPrice, setCostPrice] = useState<number>(7500);
  const [stock, setStock] = useState<number>(30);
  const [minStock, setMinStock] = useState<number>(10);
  const [selectedImage, setSelectedImage] = useState<string>("/images/ayam-original.png");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Masukkan nama produk");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          price,
          costPrice,
          stock,
          minStock,
          image: selectedImage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
        setName("");
      } else {
        alert("Gagal menambahkan produk: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedProfit = price - costPrice;
  const marginPercent = price > 0 ? Math.round((estimatedProfit / price) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">+ Tambah Produk / Menu Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          {/* Category Toggle */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kategori</label>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setCategory("Produk")}
                className={`flex-1 rounded-lg py-1.5 font-bold transition-all ${
                  category === "Produk" ? "bg-[#E52D27] text-white shadow-2xs" : "text-slate-600"
                }`}
              >
                Produk Satuan
              </button>
              <button
                type="button"
                onClick={() => setCategory("Paket")}
                className={`flex-1 rounded-lg py-1.5 font-bold transition-all ${
                  category === "Paket" ? "bg-[#E52D27] text-white shadow-2xs" : "text-slate-600"
                }`}
              >
                Paket Menu
              </button>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Produk / Paket</label>
            <input
              type="text"
              required
              placeholder="Contoh: Ayam Geprek Sambal Matah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-semibold text-slate-800 focus:border-[#E52D27] focus:outline-none"
            />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Harga Jual (Rp)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-900 focus:border-[#E52D27] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">HPP / Biaya Bahan</label>
              <input
                type="number"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-900 focus:border-[#E52D27] focus:outline-none"
              />
            </div>
          </div>

          {/* Margin Preview */}
          <div className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-100 flex items-center justify-between">
            <span className="font-semibold text-emerald-900">Estimasi Laba Bersih:</span>
            <span className="font-bold text-emerald-700">
              {formatRupiah(estimatedProfit)} ({marginPercent}%)
            </span>
          </div>

          {/* Stock Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stok Awal</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-900 focus:border-[#E52D27] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batas Menipis (Min)</label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-900 focus:border-[#E52D27] focus:outline-none"
              />
            </div>
          </div>

          {/* Image Presets */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Foto Produk</label>
            <div className="flex gap-2 overflow-x-auto py-1">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img.url ? "border-[#E52D27] scale-105" : "border-slate-200 opacity-60"
                  }`}
                >
                  <Image src={img.url} alt={img.label} fill className="object-cover" />
                  {selectedImage === img.url && (
                    <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-[#E52D27] py-2.5 font-bold text-white shadow-xs hover:bg-[#D32F2F] disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
