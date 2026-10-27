"use client";

import React, { useState } from "react";
import { MessageSquareHeart, Send, Heart, User, Sparkles } from "lucide-react";
import { type Wish } from "@/db/schema";
import { launchConfetti } from "@/lib/confetti";
import { playChimeSound } from "@/lib/audio";

interface WishesProps {
  initialWishes: Wish[];
  friendName: string;
}

export default function WishesGuestbook({ initialWishes, friendName }: WishesProps) {
  const [wishesList, setWishesList] = useState<Wish[]>(initialWishes || []);
  const [senderName, setSenderName] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderName, relation, message }),
      });
      const data = await res.json();
      if (data.success && data.wishes) {
        setWishesList(data.wishes);
        setSenderName("");
        setRelation("");
        setMessage("");
        launchConfetti();
        playChimeSound();
        setFeedback("تمت إضافة تهنئتكِ بنجاح! شكراً لمشاعركِ الرقيقة 💖");
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback(data.error || "تعذر إرسال التهنئة، حاول ثانية");
      }
    } catch {
      setFeedback("حدث خطأ أثناء الإرسال");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeWish = async (id: number) => {
    if (likedMap[id]) return;

    playChimeSound();
    setLikedMap((prev) => ({ ...prev, [id]: true }));

    // Optimistic update
    setWishesList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: (w.likes || 0) + 1 } : w))
    );

    try {
      await fetch("/api/wishes/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to like wish", err);
    }
  };

  return (
    <section id="wishes" className="py-24 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
            <MessageSquareHeart className="w-4 h-4 text-rose-400" />
            <span>سجل التهاني والكلمات الحلوة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            كلمات تهنئة وأمنيات لـ {friendName || "صديقتي"}
          </h2>
          <p className="text-rose-200/70 text-sm sm:text-base max-w-xl mx-auto mt-2">
            شاركي بكلمة دافئة أو أمنية من قلبكِ لتسعدي يوم ميلادها!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submit Wish Form */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#210c32]/90 to-[#160623]/95 border border-rose-500/30 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>أضيفي تهنئتكِ الخاصة</span>
            </h3>
            <p className="text-xs text-rose-200/70 mb-6">
              اكتبي رسالة لطيفة تخلد في هذا اليوم الجميل:
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-rose-200 mb-1.5">
                  اسمكِ الكريم *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="مثال: ريم، نورا، أو صديق..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white placeholder-rose-300/40 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                  />
                  <User className="absolute left-3 top-3 w-4 h-4 text-rose-400/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-200 mb-1.5">
                  صلة القرابة أو الوصف (اختياري)
                </label>
                <input
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  placeholder="مثال: صديقة الطفولة، أخت، رفيقة الدرب..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white placeholder-rose-300/40 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-200 mb-1.5">
                  نص التهنئة والأمنية *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="كل عام وأنتِ بألف خير وسعادة يا غالية، عسى عامكِ الجديد..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white placeholder-rose-300/40 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none"
                />
              </div>

              {feedback && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-xs text-rose-200 text-center animate-fade-in">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "جارٍ الإرسال..." : "إرسال التهنئة بالحب ❤️"}</span>
              </button>
            </form>
          </div>

          {/* Wishes List */}
          <div className="lg:col-span-7 space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {wishesList.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center text-rose-300/70 text-sm">
                كوني أول من يهنئ {friendName} في هذا اليوم السعيد!
              </div>
            ) : (
              wishesList.map((wish) => (
                <div
                  key={wish.id}
                  className="p-5 rounded-2xl bg-[#1b0829]/80 border border-rose-500/20 hover:border-rose-400/40 shadow-lg backdrop-blur-md transition-all hover:bg-[#200a30]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                        {wish.senderName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {wish.senderName}
                        </span>
                        {wish.relation && (
                          <span className="text-[11px] text-pink-300/70">{wish.relation}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleLikeWish(wish.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors border ${
                        likedMap[wish.id]
                          ? "bg-rose-600/30 border-rose-400 text-rose-200"
                          : "bg-white/5 border-rose-500/20 text-rose-300 hover:bg-rose-500/20"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          likedMap[wish.id] ? "fill-rose-400 text-rose-400" : "text-rose-300"
                        }`}
                      />
                      <span>{wish.likes || 0}</span>
                    </button>
                  </div>

                  <p className="text-sm text-rose-100/90 leading-relaxed font-amiri text-base">
                    {wish.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
