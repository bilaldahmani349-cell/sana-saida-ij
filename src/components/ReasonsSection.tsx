"use client";

import React from "react";
import { Sparkles, HeartHandshake } from "lucide-react";
import { type Reason } from "@/db/schema";

interface ReasonsProps {
  reasons: Reason[];
  friendName: string;
}

export default function ReasonsSection({ reasons, friendName }: ReasonsProps) {
  return (
    <section id="reasons" className="py-24 px-4 relative z-10 bg-gradient-to-b from-transparent via-[#160624]/60 to-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span>لماذا أنتِ استثنائية؟</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            صفات تجعل وجودكِ في حياتي أعظم نعمة
          </h2>
          <p className="text-rose-200/70 text-sm sm:text-base max-w-xl mx-auto mt-2">
            هناك آلاف الأسباب التي تجعلني أفتخر بكِ يا {friendName || "صديقتي الغالية"}، وهذه بعض منها:
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.id}
              className="relative group p-7 rounded-3xl bg-gradient-to-br from-[#1d0b2e]/90 to-[#12041e]/90 border border-rose-500/20 hover:border-amber-400/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-rose-950/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
            >
              {/* Corner Badge */}
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-rose-300">
                0{index + 1}
              </div>

              <div>
                {/* Emoji Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-amber-500/20 border border-rose-400/30 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform shadow-md">
                  {reason.emoji || "💖"}
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-amber-200 transition-colors mb-3">
                  {reason.title}
                </h3>

                <p className="text-sm sm:text-base text-rose-100/75 leading-relaxed">
                  {reason.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-500/10 flex items-center gap-1.5 text-xs text-rose-400/70">
                <Sparkles className="w-3.5 h-3.5 text-amber-400/70" />
                <span>أنتِ نادرة بكل معنى الكلمة</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
