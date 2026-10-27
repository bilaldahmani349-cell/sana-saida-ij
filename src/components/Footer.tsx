"use client";

import React from "react";
import { Heart, Sparkles, Lock } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  friendName: string;
  senderName: string;
  onOpenAdminModal?: () => void;
}

export default function Footer({ friendName, senderName, onOpenAdminModal }: FooterProps) {
  return (
    <footer className="relative border-t border-rose-500/20 bg-[#0e0417] py-12 px-4 z-10 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Heart Icon */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-600/30 mb-4 animate-pulse">
          <Heart className="w-6 h-6 text-white fill-white" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-amiri">
          صُنِع بكل ذرة حب وتقدير لـ {friendName || "صديقتي الغالية"}
        </h3>

        <p className="text-rose-200/60 text-xs sm:text-sm max-w-md mx-auto mb-6">
          «يبقى الأثر الجميل لمن يزرعون في قلوبنا بساتين من الفرح والصدق»
        </p>

        <div className="flex items-center gap-4 text-xs text-rose-300/80 mb-8">
          <span>من: {senderName || "أعز الناس لقلبك"}</span>
          <span>•</span>
          <span>إلى: {friendName || "سارة"}</span>
          <span>•</span>
          <span>يوم ميلاد سعيد 🎉</span>
        </div>

        {/* Admin Link with Lock */}
        <div className="pt-6 border-t border-rose-500/10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-400/60">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} — احتفال عيد الميلاد الخاص
          </div>

          <div>
            {onOpenAdminModal ? (
              <button
                onClick={onOpenAdminModal}
                className="hover:text-rose-200 flex items-center gap-1.5 transition-colors p-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>لوحة التحكم وتعديل الموقع (رمز سري)</span>
              </button>
            ) : (
              <Link
                href="/admin"
                className="hover:text-rose-200 flex items-center gap-1.5 transition-colors p-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>لوحة التحكم وتعديل الموقع (رمز سري)</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
