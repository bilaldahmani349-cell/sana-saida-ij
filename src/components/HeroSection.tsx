"use client";

import React from "react";
import { Sparkles, Heart, Gift, Cake, Star, ArrowDown } from "lucide-react";
import { launchConfetti, launchHearts } from "@/lib/confetti";
import { playChimeSound } from "@/lib/audio";

interface HeroProps {
  friendName: string;
  friendNickname: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  heroImageUrl: string;
  onOpenLetter?: () => void;
}

export default function HeroSection({
  friendName,
  friendNickname,
  heroTitle,
  heroSubtitle,
  heroBadge,
  heroImageUrl,
}: HeroProps) {
  const handleSurpriseClick = () => {
    launchConfetti();
    launchHearts();
    playChimeSound();
    const letterEl = document.getElementById("letter");
    if (letterEl) {
      letterEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCakeScroll = () => {
    playChimeSound();
    const cakeEl = document.getElementById("cake");
    if (cakeEl) {
      cakeEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background with image & dreamy gradient overlays */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center opacity-25 filter blur-sm scale-105 transition-all duration-1000"
          style={{
            backgroundImage: `url('${heroImageUrl || "https://images.pexels.com/photos/433527/pexels-photo-433527.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0417]/80 via-[#180626]/90 to-[#0b0512]" />
        {/* Subtle radial lights */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full filter blur-[100px] pointer-events-none" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 right-10 text-pink-400/40 animate-bounce pointer-events-none" style={{ animationDuration: "5s" }}>
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-32 left-12 text-rose-400/30 animate-pulse pointer-events-none">
        <Heart className="w-10 h-10 fill-rose-500/20" />
      </div>
      <div className="absolute top-1/3 left-16 text-amber-300/40 pointer-events-none floating-card">
        <Star className="w-6 h-6 fill-amber-300/20" />
      </div>
      <div className="absolute top-2/3 right-16 text-pink-300/40 pointer-events-none floating-card">
        <Star className="w-7 h-7 fill-pink-300/20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-amber-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-rose-950/50 backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span>{heroBadge || "✨ يوم ميلاد أجمل وأعز البشر"}</span>
          <Sparkles className="w-4 h-4 text-rose-300" />
        </div>

        {/* Friend Name Highlight */}
        <div className="relative mb-3 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition duration-700"></div>
          <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-light text-rose-200 tracking-wide font-amiri">
            إلى الغالية على قلبي دوماً
          </h2>
          <h1 className="relative text-5xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-200 to-amber-200 py-2 drop-shadow-md">
            {friendName || "سارة"}
          </h1>
          {friendNickname && (
            <p className="text-sm sm:text-base md:text-lg text-rose-300/90 font-medium mt-1">
              ({friendNickname})
            </p>
          )}
        </div>

        {/* Main Title */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight max-w-2xl">
          {heroTitle || "عيد ميلاد سعيد يا نبض الحياة!"}
        </h3>

        {/* Subtitle / Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-rose-100/80 max-w-2xl leading-relaxed mb-8 px-4 font-normal">
          {heroSubtitle ||
            "في هذا اليوم الاستثنائي، أشرقت شمسكِ على العالم لتجعلي حياتي وكل تفاصيلها أكثر إشراقاً ودلالاً."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto px-4">
          <button
            onClick={handleSurpriseClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white font-bold text-base sm:text-lg shadow-xl shadow-rose-600/40 hover:shadow-rose-600/60 hover:scale-105 active:scale-95 transition-all border border-rose-400/30 group"
          >
            <Gift className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span>افتحي المفاجأة واقرئي رسالتي 💌</span>
          </button>

          <button
            onClick={handleCakeScroll}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-rose-100 font-bold text-base border border-rose-300/30 hover:border-rose-300/60 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
          >
            <Cake className="w-5 h-5 text-pink-300" />
            <span>اطفئي شمعة الكعكة 🎂</span>
          </button>
        </div>

        {/* Sweet Quick Badges */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-14 max-w-xl w-full px-2">
          <div className="bg-white/5 backdrop-blur-md border border-rose-500/20 rounded-2xl p-3 sm:p-4 text-center">
            <span className="block text-2xl sm:text-3xl mb-1">🌸</span>
            <span className="text-xs sm:text-sm font-semibold text-rose-200 block">أطيب قلب</span>
            <span className="text-[10px] sm:text-xs text-rose-300/60">نقاء وعطاء</span>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-rose-500/20 rounded-2xl p-3 sm:p-4 text-center">
            <span className="block text-2xl sm:text-3xl mb-1">✨</span>
            <span className="text-xs sm:text-sm font-semibold text-rose-200 block">أجمل ابتسامة</span>
            <span className="text-[10px] sm:text-xs text-rose-300/60">تنير كل الأيام</span>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-rose-500/20 rounded-2xl p-3 sm:p-4 text-center">
            <span className="block text-2xl sm:text-3xl mb-1">💖</span>
            <span className="text-xs sm:text-sm font-semibold text-rose-200 block">أوفى رفيقة</span>
            <span className="text-[10px] sm:text-xs text-rose-300/60">سند دائم</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#countdown"
          aria-label="النزول للأسفل"
          className="mt-12 text-rose-300/60 hover:text-rose-200 transition-colors animate-bounce"
        >
          <ArrowDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
}
