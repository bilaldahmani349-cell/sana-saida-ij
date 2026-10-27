"use client";

import React, { useState } from "react";
import { Mail, Heart, Sparkles, Feather } from "lucide-react";
import { launchHearts } from "@/lib/confetti";
import { playChimeSound } from "@/lib/audio";

interface LetterProps {
  letterTitle: string;
  letterContent: string;
  letterQuote: string;
  letterSignature: string;
  senderName: string;
  friendName: string;
}

export default function LetterSection({
  letterTitle,
  letterContent,
  letterQuote,
  letterSignature,
  senderName,
  friendName,
}: LetterProps) {
  const [sealClicked, setSealClicked] = useState(false);

  const handleSealClick = () => {
    setSealClicked(true);
    launchHearts();
    playChimeSound();
  };

  const paragraphs = letterContent ? letterContent.split("\n\n") : [];

  return (
    <section id="letter" className="py-24 px-4 relative z-10">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-rose-600/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-600/15 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
            <Feather className="w-3.5 h-3.5 text-rose-400" />
            <span>كلمات كتبت بمشاعر صادقة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-amiri">
            {letterTitle || "رسالة من أعماق القلب لكِ وحدكِ"}
          </h2>
          <p className="text-rose-200/60 text-sm mt-2">
            لكل من يضيئون حياتنا، هناك كلمات لا يفيها حقها إلا القلب...
          </p>
        </div>

        {/* Vintage / Luxury Letter Card */}
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-14 bg-gradient-to-br from-[#1c0c27]/90 via-[#220d31]/95 to-[#160722]/90 border border-rose-500/30 shadow-2xl shadow-rose-950/80 backdrop-blur-xl group">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400/40 rounded-tr-lg pointer-events-none" />
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400/40 rounded-tl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-400/40 rounded-br-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400/40 rounded-bl-lg pointer-events-none" />

          {/* Letter Header */}
          <div className="border-b border-rose-500/20 pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs text-rose-300/70 block">المُرسَل إليها:</span>
                <span className="text-lg font-bold text-rose-100 font-amiri">
                  أميرتي الغالية {friendName || "سارة"} ✨
                </span>
              </div>
            </div>

            <div className="text-right sm:text-left text-xs text-rose-300/60 font-medium">
              بمناسبة يوم ميلادكِ السعيد 🎂
            </div>
          </div>

          {/* Letter Body Paragraphs */}
          <div className="space-y-6 text-rose-100/90 leading-relaxed font-amiri text-lg sm:text-xl text-justify">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, idx) => (
                <p key={idx} className="indent-4 leading-loose first-letter:text-2xl first-letter:font-bold first-letter:text-rose-300">
                  {p}
                </p>
              ))
            ) : (
              <p>كل عام وأنتِ الأغلى والأجمل لروحي دائماً وأبداً.</p>
            )}
          </div>

          {/* Poetic Quote Box */}
          {letterQuote && (
            <div className="my-8 p-5 rounded-2xl bg-rose-500/10 border-r-4 border-rose-400 border-t border-b border-l border-rose-500/10 text-center">
              <p className="font-amiri text-lg sm:text-xl text-rose-200 italic font-semibold">
                {letterQuote}
              </p>
            </div>
          )}

          {/* Letter Footer & Wax Seal */}
          <div className="mt-10 pt-6 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-right">
              <span className="text-xs text-rose-300/70 block">الراسل بكل فخر ومحبة:</span>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-rose-200 font-amiri">
                {senderName || "أعز الناس لقلبك"}
              </span>
              <p className="text-xs text-rose-300/80 mt-1">{letterSignature || "مع كل حبي وامتناني الأبدي ❤️"}</p>
            </div>

            {/* Interactive Wax Seal Stamp */}
            <button
              onClick={handleSealClick}
              title="اضغطي على الختم لنثر المحبة!"
              className={`relative flex items-center justify-center p-3 rounded-full transition-all duration-300 active:scale-95 group ${
                sealClicked
                  ? "bg-gradient-to-tr from-rose-700 to-red-600 shadow-xl shadow-rose-600/50 scale-105"
                  : "bg-gradient-to-tr from-rose-800 to-red-700 hover:scale-105 shadow-lg shadow-rose-950"
              }`}
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-300/60 flex flex-col items-center justify-center text-center">
                <Heart className="w-5 h-5 text-amber-200 fill-amber-300 animate-pulse" />
                <span className="text-[9px] text-amber-100 font-bold mt-0.5">ختم القلب</span>
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: "10s" }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
