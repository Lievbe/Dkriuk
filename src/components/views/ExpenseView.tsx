"use client";

import React, { useState, useEffect } from "react";
import { 
  Receipt, 
  Calendar, 
  Tag, 
  DollarSign, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Filter
} from "lucide-react";
import { Expense } from "@/lib/types";
import { formatRupiah, formatDateIndo, parseRupiahInput } from "@/lib/utils";

interface ExpenseViewProps {
  onRefreshData: () => void;
}

export default function ExpenseView({ onRefreshData }: ExpenseViewProps) {
  // Timeframe filter: [Harian, Mingguan, Bulanan]
  const [timeframe, setTimeframe] = useState<"Harian" | "Mingguan" | "Bulanan">("Harian");

  // Form states
  const [category, setCategory] = useState<string>("Bahan Baku");
  const [date, setDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [amountInput, setAmountInput] = useState<string>("Rp 250.000");
  const [amountRaw, setAmountRaw] = useState<number>(250000);
  const [description, setDescription] = useState<string>("Pembelian ayam");

  // Expenses history list
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const categories = [
    "Bahan Baku",
    "Gaji",
    "Listrik/Sewa",
    "Operasional",
    "Dll",
  ];

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses?timeframe=${timeframe}`);
      const data = await res.json();
      if (data.success) {
        setExpenseList(data.expenses);
        setTotalExpense(data.totalAmount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [timeframe]);

  // Handle amount currency mask
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseRupiahInput(e.target.value);
    setAmountRaw(raw);
    setAmountInput(raw > 0 ? formatRupiah(raw) : "");
  };

  // Submit expense
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountRaw <= 0) {
      alert("Masukkan nominal pengeluaran yang valid.");
      return;
    }
    if (!description.trim()) {
      alert("Masukkan keterangan pengeluaran.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          date,
          amount: amountRaw,
          description,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        // Reset form to defaults
        setAmountInput("");
        setAmountRaw(0);
        setDescription("");
        fetchExpenses();
        onRefreshData();
      } else {
        alert("Gagal mencatat pengeluaran: " + data.error);
      }
    } catch (err) {
      alert("Gagal koneksi ke server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus catatan pengeluaran ini?")) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchExpenses();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Time frame filter tabs matching screenshot */}
      <div className="flex rounded-2xl bg-slate-100 p-1">
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

      {/* Input Form Card matching screenshot */}
      <div className="rounded-3xl bg-white p-5 shadow-xs border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kategori
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-800 shadow-2xs focus:border-[#E52D27] focus:outline-none focus:ring-1 focus:ring-[#E52D27]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tanggal
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-800 shadow-2xs focus:border-[#E52D27] focus:outline-none focus:ring-1 focus:ring-[#E52D27]"
              />
            </div>
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Jumlah Nominal
            </label>
            <input
              type="text"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="Rp 250.000"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-bold text-slate-900 shadow-2xs focus:border-[#E52D27] focus:outline-none focus:ring-1 focus:ring-[#E52D27]"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Keterangan
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pembelian ayam karkas atau minyak"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-2xs focus:border-[#E52D27] focus:outline-none focus:ring-1 focus:ring-[#E52D27]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-[#E52D27] py-3.5 text-center text-sm font-bold text-white shadow-md shadow-red-200 hover:bg-[#D32F2F] active:scale-98 transition-all disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>

          {saveSuccess && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>Pengeluaran berhasil disimpan ke pembukuan!</span>
            </div>
          )}
        </form>
      </div>

      {/* History List of Expenses */}
      <div className="rounded-3xl bg-white p-4 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Riwayat Pengeluaran ({timeframe})
            </h3>
            <p className="text-[11px] text-slate-400">Total {expenseList.length} transaksi dicatat</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">Total Beban</span>
            <span className="text-sm font-black text-[#E52D27]">
              {formatRupiah(totalExpense)}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Memuat catatan...</div>
          ) : expenseList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Belum ada pengeluaran dicatat untuk periode ini.
            </div>
          ) : (
            expenseList.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3 text-xs border border-slate-100"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {exp.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateIndo(exp.date)}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-800">{exp.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900">
                    {formatRupiah(exp.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
