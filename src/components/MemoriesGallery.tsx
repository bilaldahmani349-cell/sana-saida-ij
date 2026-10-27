"use client";

import React, { useState } from "react";
import { Camera, Heart, Calendar, X, ZoomIn } from "lucide-react";
import { type Memory } from "@/db/schema";
import { playChimeSound } from "@/lib/audio";

interface MemoriesProps {
  initialMemories: Memory[];
  friendName: string;
}

export default function MemoriesGallery({ initialMemories, friendName }: MemoriesProps) {
  const [memoriesList, setMemoriesList] = useState<Memory[]>(initialMemories || []);
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);
  const [likedIds, setLikedIds] = useState<Record<number, boolean>>({});

  const handleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (likedIds[id]) return;

    playChimeSound();
    setLikedIds((prev) => ({ ...prev, [id]: true }));

    // Optimistic update
    setMemoriesList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likesCount: (m.likesCount || 0) + 1 } : m))
    );

    try {
      await fetch("/api/memories/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to like memory", err);
    }
  };

  return (
    <section id="memories" className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>لحظات محفورة في الذاكرة والوجدان</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            أجمل ذكرياتنا مع {friendName || "صديقتي"}
          </h2>
          <p className="text-rose-200/70 text-sm sm:text-base max-w-xl mx-auto mt-2">
            كل صورة تحكي حكاية وفاء، وضحكة صادقة، وأوقات لن يبدلها الزمان.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {memoriesList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer rounded-3xl bg-[#1b0829]/80 border border-rose-500/20 hover:border-rose-400/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-rose-950/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b0829] via-transparent to-transparent opacity-60" />

                {/* Date Tag */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#11051b]/80 backdrop-blur-md border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-pink-400" />
                  <span>{item.date}</span>
                </div>

                {/* Zoom hover indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <span className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm shadow-md">
                    <ZoomIn className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-rose-100/75 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Likes Action */}
                <div className="mt-5 pt-4 border-t border-rose-500/20 flex items-center justify-between text-xs text-rose-300/80">
                  <span className="text-[11px] text-rose-400/70">انقري للتكبير</span>
                  <button
                    onClick={(e) => handleLike(e, item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
                      likedIds[item.id]
                        ? "bg-rose-600/30 border-rose-400 text-rose-200"
                        : "bg-white/5 border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        likedIds[item.id] ? "fill-rose-400 text-rose-400" : "text-rose-300"
                      }`}
                    />
                    <span>{item.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-3xl w-full bg-[#180624] border border-rose-500/40 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-contain bg-black/50"
              />

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
                  <span className="text-xs text-pink-300 bg-pink-950/60 px-3 py-1 rounded-full border border-pink-500/30">
                    {selectedImage.date}
                  </span>
                </div>
                <p className="text-rose-100/90 text-sm sm:text-base leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
