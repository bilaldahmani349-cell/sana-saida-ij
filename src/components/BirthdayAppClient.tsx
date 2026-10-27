"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CountdownTimer from "@/components/CountdownTimer";
import LetterSection from "@/components/LetterSection";
import InteractiveCake from "@/components/InteractiveCake";
import MemoriesGallery from "@/components/MemoriesGallery";
import ReasonsSection from "@/components/ReasonsSection";
import SecretGiftBox from "@/components/SecretGiftBox";
import MilestonesTimeline from "@/components/MilestonesTimeline";
import WishesGuestbook from "@/components/WishesGuestbook";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/AdminDashboard";
import { type SiteSettings, type Memory, type Reason, type Milestone, type Wish } from "@/db/schema";
import { X } from "lucide-react";

interface BirthdayAppClientProps {
  initialSettings: SiteSettings;
  initialMemories: Memory[];
  initialReasons: Reason[];
  initialMilestones: Milestone[];
  initialWishes: Wish[];
}

export default function BirthdayAppClient({
  initialSettings,
  initialMemories,
  initialReasons,
  initialMilestones,
  initialWishes,
}: BirthdayAppClientProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [memories] = useState<Memory[]>(initialMemories);
  const [reasons] = useState<Reason[]>(initialReasons);
  const [milestones] = useState<Milestone[]>(initialMilestones);
  const [wishes] = useState<Wish[]>(initialWishes);

  return (
    <div className="relative min-h-screen bg-[#0b0512] text-[#fce7f3] selection:bg-rose-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        friendName={settings.friendName}
        musicEnabled={settings.musicEnabled}
        onOpenAdminModal={() => setIsAdminOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        friendName={settings.friendName}
        friendNickname={settings.friendNickname}
        heroTitle={settings.heroTitle}
        heroSubtitle={settings.heroSubtitle}
        heroBadge={settings.heroBadge}
        heroImageUrl={settings.heroImageUrl}
      />

      {/* Countdown Timer */}
      <CountdownTimer
        birthdayDate={settings.birthdayDate}
        friendName={settings.friendName}
      />

      {/* Letter Section */}
      <LetterSection
        letterTitle={settings.letterTitle}
        letterContent={settings.letterContent}
        letterQuote={settings.letterQuote}
        letterSignature={settings.letterSignature}
        senderName={settings.senderName}
        friendName={settings.friendName}
      />

      {/* Interactive Birthday Cake */}
      <InteractiveCake
        cakeTitle={settings.cakeTitle}
        cakeSubtitle={settings.cakeSubtitle}
        cakeWishReveal={settings.cakeWishReveal}
        friendName={settings.friendName}
      />

      {/* Photo Memories Gallery */}
      <MemoriesGallery
        initialMemories={memories}
        friendName={settings.friendName}
      />

      {/* Reasons Why She Is Special */}
      <ReasonsSection
        reasons={reasons}
        friendName={settings.friendName}
      />

      {/* Secret Gift Box / Voucher */}
      <SecretGiftBox
        giftTitle={settings.giftTitle}
        giftSubtitle={settings.giftSubtitle}
        giftRevealTitle={settings.giftRevealTitle}
        giftRevealMessage={settings.giftRevealMessage}
        giftImageUrl={settings.giftImageUrl}
        friendName={settings.friendName}
      />

      {/* Milestones Timeline */}
      <MilestonesTimeline
        milestones={milestones}
        friendName={settings.friendName}
      />

      {/* Wishes Guestbook */}
      <WishesGuestbook
        initialWishes={wishes}
        friendName={settings.friendName}
      />

      {/* Footer */}
      <Footer
        friendName={settings.friendName}
        senderName={settings.senderName}
        onOpenAdminModal={() => setIsAdminOpen(true)}
      />

      {/* In-Place Admin Dashboard Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl my-8 bg-[#0d0516] rounded-3xl border border-rose-500/40 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAdminOpen(false);
                // Refresh data if needed
                window.location.reload();
              }}
              className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors"
              aria-label="إغلاق لوحة التحكم"
            >
              <X className="w-5 h-5" />
            </button>
            <AdminDashboard
              isModal={true}
              onClose={() => {
                setIsAdminOpen(false);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
