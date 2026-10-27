"use client";

import React from "react";
import { Sparkles, Heart, Trophy, Cake, Shield, Star, Award } from "lucide-react";
import { type Milestone } from "@/db/schema";

interface TimelineProps {
  milestones: Milestone[];
  friendName: string;
}

export default function MilestonesTimeline({ milestones, friendName }: TimelineProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "heart":
        return <Heart className="w-5 h-5 text-rose-400" />;
      case "cake":
        return <Cake className="w-5 h-5 text-pink-400" />;
      case "trophy":
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case "shield":
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case "star":
        return <Star className="w-5 h-5 text-yellow-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-300" />;
    }
  };

  return (
    <section id="timeline" className="py-24 px-4 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-rose-400" />
            <span>محطات لا تمحوها الأيام</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            شريط ذكرياتنا وخطوات الصداقة
          </h2>
          <p className="text-rose-200/70 text-sm sm:text-base max-w-xl mx-auto mt-2">
            من أول لقاء حتى هذه اللحظة، كل خطوة كانت أجمل بصحبة {friendName || "الغالية"}.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-r-2 border-rose-500/30 mr-4 md:mr-32 space-y-12">
          {milestones.map((item) => (
            <div key={item.id} className="relative pr-8 md:pr-12 group">
              {/* Timeline Node */}
              <div className="absolute -right-[17px] top-1 w-8 h-8 rounded-full bg-[#1b0827] border-2 border-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-125 group-hover:border-amber-300 transition-all duration-300">
                {getIcon(item.icon)}
              </div>

              {/* Content Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1d0b2e]/90 to-[#12051f]/90 border border-rose-500/20 hover:border-rose-400/50 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
                <span className="inline-block px-3 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 font-mono">
                  {item.date}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-rose-100/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
