"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Heart, PartyPopper } from "lucide-react";
import { launchConfetti } from "@/lib/confetti";

interface CountdownProps {
  birthdayDate: string;
  friendName: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isPast: boolean;
}

export default function CountdownTimer({ birthdayDate, friendName }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isToday: false,
    isPast: false,
  });
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    function calculateTime() {
      if (!birthdayDate) return;
      const target = new Date(birthdayDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (isNaN(target)) return;

      if (difference <= 0 && difference > -86400000) {
        // Today is birthday
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isToday: true,
          isPast: false,
        });
        if (!hasCelebrated) {
          launchConfetti();
          setHasCelebrated(true);
        }
      } else if (difference < -86400000) {
        // Birthday in past
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isToday: false,
          isPast: true,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isToday: false,
          isPast: false,
        });
      }
    }

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [birthdayDate, hasCelebrated]);

  const timeCards = [
    { label: "يوم", value: timeLeft.days },
    { label: "ساعة", value: timeLeft.hours },
    { label: "دقيقة", value: timeLeft.minutes },
    { label: "ثانية", value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-3 text-rose-400">
          <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">العداد التنازلي للحظة المنتظرة</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          ننتظر لحظة ميلاد {friendName || "الغالية"} بكل شغف
        </h2>
        <p className="text-rose-200/70 text-sm sm:text-base max-w-xl mx-auto mb-10">
          كل ثانية تقربنا من ذكرى ذلك اليوم الذي أهداكِ الله فيه لهذا العالم لتكوني ألطف وأجمل ما فيه.
        </p>

        {timeLeft.isToday ? (
          /* Today is celebration day! */
          <div className="relative p-8 rounded-3xl bg-gradient-to-r from-rose-600/30 via-pink-600/30 to-amber-600/30 border-2 border-rose-400/50 backdrop-blur-xl shadow-2xl shadow-rose-600/30 max-w-2xl mx-auto animate-bounce">
            <div className="text-4xl sm:text-6xl mb-3">🎉 🎂 ✨</div>
            <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 mb-2">
              اليوم هو يومكِ السعيد والمميز!
            </h3>
            <p className="text-rose-100 text-base sm:text-lg">
              كل عام وأنتِ الخير لكل عام، أسأل الله أن يجعل أيامكِ القادمة كلها بهجة وسعادة وأمنيات محققة!
            </p>
            <button
              onClick={() => launchConfetti()}
              className="mt-4 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-500/40 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <PartyPopper className="w-4 h-4" />
              <span>احتفلي الآن! 🎊</span>
            </button>
          </div>
        ) : (
          /* Countdown Cards */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {timeCards.map((item, idx) => (
              <div
                key={idx}
                className="relative group p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-rose-500/30 hover:border-rose-400/70 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-md bg-rose-600 text-[10px] font-bold text-white shadow-sm">
                  {item.label}
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200 font-mono tracking-tight my-2">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-rose-300/80 font-medium">{item.label} متبقية</div>
              </div>
            ))}
          </div>
        )}

        {birthdayDate && (
          <div className="mt-8 inline-flex items-center gap-2 text-xs sm:text-sm text-rose-300/70 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Calendar className="w-4 h-4 text-pink-400" />
            <span>موعد الاحتفال المحدد: {new Date(birthdayDate).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        )}
      </div>
    </section>
  );
}
