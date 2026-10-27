"use client";

import React, { useState } from "react";
import { Sparkles, Flame, RefreshCw, Heart, Wand2 } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";
import { playBlowCandleSound, playChimeSound } from "@/lib/audio";

interface CakeProps {
  cakeTitle: string;
  cakeSubtitle: string;
  cakeWishReveal: string;
  friendName: string;
}

export default function InteractiveCake({
  cakeTitle,
  cakeSubtitle,
  cakeWishReveal,
  friendName,
}: CakeProps) {
  const [isLit, setIsLit] = useState(true);
  const [hasBlown, setHasBlown] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  const handleBlowCandle = () => {
    if (!isLit) return;

    playBlowCandleSound();
    setIsLit(false);
    setShowSmoke(true);

    setTimeout(() => {
      setShowSmoke(false);
      setHasBlown(true);
      launchConfetti();
      playChimeSound();
    }, 600);
  };

  const handleRelight = () => {
    setIsLit(true);
    setHasBlown(false);
    playChimeSound();
  };

  return (
    <section id="cake" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-4">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>الطقس الأجمل في عيد الميلاد</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3">
          {cakeTitle || "كعكة عيد ميلادكِ السحرية"}
        </h2>
        <p className="text-rose-200/70 text-sm sm:text-base max-w-xl mx-auto mb-10">
          {cakeSubtitle || "أغمضي عينيكِ، تمني أمنية سرية من قلبكِ، ثم اضغطي على الشمعة لتطفئيها!"}
        </p>

        {/* Cake Container */}
        <div className="relative max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#240e34]/70 to-[#170624]/90 border border-rose-500/30 shadow-2xl backdrop-blur-xl">
          {/* Candle & Flame */}
          <div className="flex justify-center items-end h-28 relative mb-2">
            {/* Center Candle */}
            <div
              onClick={handleBlowCandle}
              className="relative flex flex-col items-center cursor-pointer group"
              title={isLit ? "انقري لإطفاء الشمعة!" : "تم إطفاء الشمعة"}
            >
              {/* Flame */}
              {isLit && (
                <div className="relative mb-1">
                  <div className="w-6 h-10 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white candle-flame shadow-lg shadow-amber-400/80" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-amber-400/30 rounded-full filter blur-md pointer-events-none" />
                </div>
              )}

              {/* Smoke Puff when blown */}
              {showSmoke && (
                <div className="absolute -top-8 text-2xl smoke-puff select-none">
                  💨
                </div>
              )}

              {/* Candle Wick */}
              <div className="w-1 h-3 bg-stone-700 rounded-t" />

              {/* Candle Body */}
              <div className="w-6 h-16 rounded-t-sm bg-gradient-to-b from-rose-400 via-pink-400 to-rose-300 border border-rose-300/40 shadow-inner flex flex-col justify-around py-1">
                <div className="w-full h-1 bg-white/40 rotate-12" />
                <div className="w-full h-1 bg-white/40 -rotate-12" />
                <div className="w-full h-1 bg-white/40 rotate-12" />
              </div>
            </div>

            {/* Side decorative small candles */}
            <div className="absolute left-1/4 bottom-0 flex flex-col items-center opacity-80">
              {isLit && <div className="w-4 h-7 rounded-full bg-gradient-to-t from-amber-500 to-yellow-200 candle-flame mb-1" />}
              <div className="w-4 h-12 rounded-t-sm bg-gradient-to-b from-pink-400 to-rose-500" />
            </div>

            <div className="absolute right-1/4 bottom-0 flex flex-col items-center opacity-80">
              {isLit && <div className="w-4 h-7 rounded-full bg-gradient-to-t from-amber-500 to-yellow-200 candle-flame mb-1" />}
              <div className="w-4 h-12 rounded-t-sm bg-gradient-to-b from-pink-400 to-rose-500" />
            </div>
          </div>

          {/* Tier 1 (Top cake layer) */}
          <div className="w-48 mx-auto h-14 rounded-t-2xl bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 border-t-2 border-x-2 border-pink-200/60 shadow-lg relative flex items-center justify-center">
            {/* Frosting drips */}
            <div className="absolute -bottom-2 inset-x-0 flex justify-around text-pink-200 text-xs">
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
            <span className="text-xs font-bold text-rose-900 tracking-wider">
              {friendName || "سارة"} 💖
            </span>
          </div>

          {/* Tier 2 (Middle cake layer) */}
          <div className="w-64 mx-auto h-16 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 border-x-2 border-pink-300/60 shadow-md relative flex items-center justify-around px-4">
            <span className="text-sm">🍓</span>
            <span className="text-sm">✨</span>
            <span className="text-sm font-bold text-white text-xs">Happy Birthday</span>
            <span className="text-sm">✨</span>
            <span className="text-sm">🍓</span>
          </div>

          {/* Tier 3 (Bottom cake base) */}
          <div className="w-80 mx-auto h-20 rounded-b-2xl bg-gradient-to-r from-[#831843] via-[#9d174d] to-[#831843] border-b-4 border-x-2 border-rose-300/50 shadow-2xl relative flex items-center justify-around px-6">
            <span className="text-base">🌸</span>
            <span className="text-base">💎</span>
            <span className="text-base">🎉</span>
            <span className="text-base">💎</span>
            <span className="text-base">🌸</span>
          </div>

          {/* Cake Stand */}
          <div className="w-88 max-w-full mx-auto h-3 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-full shadow-lg mt-1" />
          <div className="w-32 mx-auto h-4 bg-gradient-to-b from-amber-300 to-amber-500 rounded-b-xl shadow-md" />

          {/* Controls: Blow Button / Relight Button */}
          <div className="mt-8 flex justify-center">
            {isLit ? (
              <button
                onClick={handleBlowCandle}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
              >
                <Flame className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>انفخي الشمعة وتمني أمنية! 🎂</span>
              </button>
            ) : (
              <button
                onClick={handleRelight}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-rose-200 border border-rose-400/40 font-bold text-sm transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-amber-300" />
                <span>إشعال الشمعة مجدداً وتمني أمنية أخرى 🔥</span>
              </button>
            )}
          </div>
        </div>

        {/* Revealed Secret Birthday Wish Card */}
        {hasBlown && (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-900/40 via-pink-900/40 to-amber-900/30 border-2 border-amber-400/60 shadow-2xl backdrop-blur-xl max-w-xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-lg mb-2">
              <Wand2 className="w-5 h-5" />
              <span>تحققت الأمنية في السماء! ✨</span>
            </div>
            <p className="text-base sm:text-lg text-rose-100 leading-relaxed font-amiri font-semibold">
              {cakeWishReveal ||
                "🎂 أمنية مباركة: عسى أن يجعل الله هذا العام بداية لأجمل أقداركِ، وأن تُزهر أيامكِ فرحاً لا ينتهي!"}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-rose-300/80">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>أدعو لكِ بكل الخير من صميم الفؤاد</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
