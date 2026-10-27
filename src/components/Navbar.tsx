"use client";

import React, { useState, useEffect } from "react";
import { Music, VolumeX, Sparkles, Lock, Heart, Menu, X } from "lucide-react";
import { toggleBirthdayMusic, playChimeSound } from "@/lib/audio";
import { launchConfetti } from "@/lib/confetti";
import Link from "next/link";

interface NavbarProps {
  friendName: string;
  musicEnabled?: boolean;
  onOpenAdminModal?: () => void;
}

export default function Navbar({ friendName, onOpenAdminModal }: NavbarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMusicToggle = () => {
    const newState = toggleBirthdayMusic(isPlaying);
    setIsPlaying(newState);
    if (newState) {
      playChimeSound();
    }
  };

  const handleConfettiClick = () => {
    launchConfetti();
    playChimeSound();
  };

  const navLinks = [
    { name: "الرئيسية", href: "#hero" },
    { name: "العداد التنازلي", href: "#countdown" },
    { name: "رسالة القلب", href: "#letter" },
    { name: "إطفاء الشموع", href: "#cake" },
    { name: "أجمل الذكريات", href: "#memories" },
    { name: "لماذا أنتِ مميزة", href: "#reasons" },
    { name: "صندوق الهدية", href: "#gift" },
    { name: "التهاني", href: "#wishes" },
  ];

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#11051b]/90 backdrop-blur-md border-b border-rose-500/20 shadow-lg shadow-rose-950/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Name */}
        <a
          href="#hero"
          className="flex items-center gap-2 text-rose-300 hover:text-white transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200">
              عيد ميلاد {friendName || "صديقتي"}
            </span>
            <span className="text-[11px] text-rose-300/70 font-medium">يومكِ السعيد والخاص ✨</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-rose-200/80 hover:text-rose-100 hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-rose-400 hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Actions: Music + Confetti + Admin */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Confetti Trigger */}
          <button
            onClick={handleConfettiClick}
            title="انثري الفرح والمفرقعات!"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-200 hover:text-white hover:bg-amber-500/30 text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="hidden sm:inline">انثري الفرح!</span>
          </button>

          {/* Music Button */}
          <button
            onClick={handleMusicToggle}
            title={isPlaying ? "إيقاف الموسيقى" : "تشغيل لحن عيد الميلاد"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium transition-all active:scale-95 ${
              isPlaying
                ? "bg-rose-600/30 border-rose-400 text-rose-200 shadow-md shadow-rose-600/30"
                : "bg-white/5 border-white/20 text-rose-300 hover:bg-white/10"
            }`}
          >
            {isPlaying ? (
              <>
                <Music className="w-4 h-4 text-rose-300 animate-bounce" />
                <span className="hidden sm:inline">الموسيقى تعمل 🎵</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-400/70" />
                <span className="hidden sm:inline">تشغيل اللحن</span>
              </>
            )}
          </button>

          {/* Admin Dashboard Button */}
          {onOpenAdminModal ? (
            <button
              onClick={onOpenAdminModal}
              title="لوحة تحكم الموقع (رمز سري)"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/20 text-rose-200 text-xs sm:text-sm font-medium transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">لوحة التحكم</span>
            </button>
          ) : (
            <Link
              href="/admin"
              title="لوحة تحكم الموقع (رمز سري)"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/20 text-rose-200 text-xs sm:text-sm font-medium transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">لوحة التحكم</span>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-rose-200 hover:bg-white/10"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#150722] border-b border-rose-500/20 px-4 py-4 mt-2 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-rose-200 hover:bg-rose-500/20 font-medium text-sm transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-rose-500/20 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdminModal) onOpenAdminModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-600/20 border border-rose-500/30 text-rose-200 text-sm font-medium"
            >
              <Lock className="w-4 h-4" />
              لوحة التحكم وتعديل الأقسام (برمز سري)
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
