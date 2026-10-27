"use client";

import React, { useState } from "react";
import { Gift, Sparkles, Heart, CheckCircle2, RotateCcw } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playChimeSound } from "@/lib/audio";

interface GiftProps {
  giftTitle: string;
  giftSubtitle: string;
  giftRevealTitle: string;
  giftRevealMessage: string;
  giftImageUrl: string;
  friendName: string;
}

export default function SecretGiftBox({
  giftTitle,
  giftSubtitle,
  giftRevealTitle,
  giftRevealMessage,
  giftImageUrl,
  friendName,
}: GiftProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGift = () => {
    if (isOpen) return;
    setIsOpen(true);
    launchConfetti();
    playChimeSound();
  };

  const handleRewrap = () => {
    setIsOpen(false);
    playChimeSound();
  };

  const giftLines = giftRevealMessage ? giftRevealMessage.split("\n") : [];

  return (
    <section id="gift" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
          <Gift className="w-4 h-4 text-amber-300" />
          <span>مفاجأة صُممت خصيصاً لكِ</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
          {giftTitle || "صندوق المفاجأة والهدية الخاصة"}
        </h2>
        <p className="text-rose-200/70 text-sm sm:text-base max-w-xl mx-auto mb-10">
          {giftSubtitle || "انقري على الصندوق لفك الشريط واكتشاف هديتكِ السرية!"}
        </p>

        {/* Gift Box Container */}
        <div className="relative max-w-lg mx-auto">
          {!isOpen ? (
            /* Wrapped Gift Box (Clickable) */
            <div
              onClick={handleOpenGift}
              className="cursor-pointer group relative p-10 sm:p-12 rounded-3xl bg-gradient-to-br from-[#2a0c3b]/90 via-[#3b1252]/90 to-[#1e072b]/95 border-2 border-rose-400/40 hover:border-amber-300 shadow-2xl hover:shadow-rose-600/40 transition-all duration-300 hover:scale-103 active:scale-98 flex flex-col items-center"
            >
              {/* Floating Sparkles */}
              <Sparkles className="absolute top-6 right-8 w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: "7s" }} />
              <Heart className="absolute bottom-6 left-8 w-6 h-6 text-pink-400 fill-pink-500/30 animate-pulse" />

              {/* Gift Visual */}
              <div className="relative my-4">
                {/* Gift Ribbon Bow */}
                <div className="w-20 h-10 mx-auto relative flex justify-center items-center">
                  <div className="w-8 h-8 rounded-full border-4 border-amber-300 bg-amber-400/80 -rotate-45 shadow-md" />
                  <div className="w-8 h-8 rounded-full border-4 border-amber-300 bg-amber-400/80 rotate-45 shadow-md -mr-3" />
                </div>

                {/* Gift Box Body */}
                <div className="w-44 h-40 sm:w-52 sm:h-48 rounded-2xl bg-gradient-to-tr from-rose-700 via-pink-600 to-rose-600 border-2 border-rose-300/40 shadow-2xl relative overflow-hidden flex items-center justify-center group-hover:rotate-1 transition-transform">
                  {/* Vertical Ribbon */}
                  <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 shadow-md" />
                  {/* Horizontal Ribbon */}
                  <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-300 shadow-md" />

                  <div className="relative z-10 text-white font-black text-center drop-shadow-md">
                    <span className="text-3xl block">🎁</span>
                    <span className="text-xs tracking-wider uppercase font-sans">For {friendName || "You"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold text-sm shadow-lg group-hover:scale-105 transition-all">
                <Sparkles className="w-4 h-4" />
                <span>انقري لفك الشريط وفتح الهدية! ✨</span>
              </div>
            </div>
          ) : (
            /* Unwrapped Gift Voucher / Content */
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#240a33] via-[#330e46] to-[#1c0628] border-2 border-amber-400/70 shadow-2xl shadow-amber-500/20 backdrop-blur-xl animate-fade-in text-right">
              {/* Top Voucher Badge */}
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-300 font-bold block">قسيمة هدية خاصة</span>
                    <span className="text-sm text-rose-200">صادرة بحب لـ: {friendName || "سارة"}</span>
                  </div>
                </div>
                <div className="text-xs text-rose-300/70 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  صلاحية دائمة ومضمونة ♾️
                </div>
              </div>

              {/* Reveal Title */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-white mb-4">
                {giftRevealTitle || "🎁 تذكرة يوم الدلال والمفاجآت السعيدة!"}
              </h3>

              {/* Optional Gift Image */}
              {giftImageUrl && (
                <div className="my-5 rounded-2xl overflow-hidden border border-rose-500/30 max-h-56 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={giftImageUrl}
                    alt={giftRevealTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Lines / Points */}
              <div className="space-y-3 my-6">
                {giftLines.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-rose-100/90 text-sm sm:text-base leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-rose-300">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <span>تُقدّم بكل مشاعر التقدير والحب</span>
                </div>

                <button
                  onClick={handleRewrap}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 text-xs font-semibold border border-rose-400/30 transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة لف الصندوق</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
