"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Lock, ArrowRight, Eye, EyeOff, Sparkles, Check } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; role: string }) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [identifier, setIdentifier] = useState("owner@dkriuk.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: isRegisterMode ? "Mitra Baru D'Kriuk" : "Budi Santoso",
        email: identifier,
        role: "Owner",
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#FFFBF5] p-6 shadow-2xl border border-amber-100 text-slate-900 max-h-[92vh] overflow-y-auto">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto relative h-16 w-16 overflow-hidden rounded-full border-2 border-red-500 bg-white shadow-md">
            <Image
              src="/images/dkriuk-logo.png"
              alt="D'Kriuk Mascot"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <h2 className="mt-3 text-xl font-extrabold text-slate-900">
            D&apos;Kriuk <span className="text-[#E52D27]">Finance</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Kelola Keuangan, Kembangkan Usaha
          </p>
        </div>

        {/* Fried Chicken Bucket Hero Graphic matching Screen 1 */}
        <div className="my-4 flex justify-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-amber-100/60 p-1 shadow-inner">
            <Image
              src="/images/fried-chicken-bucket.png"
              alt="Fried Chicken Bucket"
              width={110}
              height={110}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email / No. HP
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="0812xxxx atau email@dkriuk.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 shadow-2xs focus:border-[#E52D27] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs font-semibold text-slate-800 shadow-2xs focus:border-[#E52D27] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {!isRegisterMode && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => alert("Silakan hubungi tim IT franchise pusat D'Kriuk untuk reset password.")}
                className="text-[11px] font-medium text-slate-500 hover:text-[#E52D27]"
              >
                Lupa Password?
              </button>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#E52D27] py-3 text-center text-xs font-bold text-white shadow-md shadow-red-200 hover:bg-[#D32F2F] active:scale-98 transition-all disabled:opacity-60"
          >
            {loading ? "Memproses..." : isRegisterMode ? "Daftar Akun Baru" : "Masuk"}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-slate-500">
          {isRegisterMode ? (
            <p>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="font-bold text-[#E52D27] hover:underline"
              >
                Masuk
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="font-bold text-[#E52D27] hover:underline"
              >
                Daftar
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Switcher */}
        <div className="mt-4 rounded-xl bg-amber-50 p-2.5 text-center text-[11px] text-amber-900 border border-amber-200/50">
          <p className="font-semibold">Demo Akun Mitra Franchise:</p>
          <p className="text-slate-600">Budi Santoso (Owner Tebet)</p>
        </div>
      </div>
    </div>
  );
}
