"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  KeyRound,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Home,
  Sparkles,
  Camera,
  Heart,
  Cake,
  Gift,
  Clock,
  Feather,
  MessageSquare,
  X,
  ExternalLink,
} from "lucide-react";
import { type SiteSettings, type Memory, type Reason, type Milestone, type Wish } from "@/db/schema";
import Link from "next/link";

interface AdminDashboardProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function AdminDashboard({ onClose, isModal = false }: AdminDashboardProps) {
  // Auth state
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<
    "general" | "hero" | "letter" | "cake" | "gift" | "memories" | "reasons" | "timeline" | "wishes"
  >("general");

  // Data state
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [newPasscode, setNewPasscode] = useState("");
  const [memoriesList, setMemoriesList] = useState<Memory[]>([]);
  const [reasonsList, setReasonsList] = useState<Reason[]>([]);
  const [milestonesList, setMilestonesList] = useState<Milestone[]>([]);
  const [wishesList, setWishesList] = useState<Wish[]>([]);

  // Sub-entity editing modals/forms
  const [editingMemory, setEditingMemory] = useState<Partial<Memory> | null>(null);
  const [editingReason, setEditingReason] = useState<Partial<Reason> | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Partial<Milestone> | null>(null);

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check saved session in sessionStorage
  useEffect(() => {
    const savedPin = sessionStorage.getItem("admin_pin");
    if (savedPin) {
      setPasscode(savedPin);
      verifyPin(savedPin);
    }
  }, []);

  const verifyPin = async (pinToTest: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: pinToTest }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_pin", pinToTest);
        fetchAllData(pinToTest);
      } else {
        setAuthError(data.error || "رمز المرور غير صحيح");
        sessionStorage.removeItem("admin_pin");
      }
    } catch {
      setAuthError("تعذر التحقق من الرمز، حاول ثانية");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (pin: string) => {
    try {
      const [resSettings, resMemories, resReasons, resMilestones, resWishes] = await Promise.all([
        fetch(`/api/settings?passcode=${encodeURIComponent(pin)}`).then((r) => r.json()),
        fetch("/api/memories").then((r) => r.json()),
        fetch("/api/reasons").then((r) => r.json()),
        fetch("/api/milestones").then((r) => r.json()),
        fetch("/api/wishes").then((r) => r.json()),
      ]);

      if (resSettings.success && resSettings.settings) {
        setSettings(resSettings.settings);
      }
      if (resMemories.success && resMemories.memories) {
        setMemoriesList(resMemories.memories);
      }
      if (resReasons.success && resReasons.reasons) {
        setReasonsList(resReasons.reasons);
      }
      if (resMilestones.success && resMilestones.milestones) {
        setMilestonesList(resMilestones.milestones);
      }
      if (resWishes.success && resWishes.wishes) {
        setWishesList(resWishes.wishes);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyPin(passcode.trim());
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode,
          newPasscode: newPasscode.trim() || undefined,
          updates: settings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", text: "تم حفظ التعديلات بنجاح! ستظهر التغييرات فوراً في الموقع." });
        if (newPasscode.trim()) {
          setPasscode(newPasscode.trim());
          sessionStorage.setItem("admin_pin", newPasscode.trim());
          setNewPasscode("");
        }
        if (data.settings) {
          setSettings(data.settings);
        }
      } else {
        setStatusMsg({ type: "error", text: data.error || "فشل حفظ التعديلات" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "حدث خطأ أثناء الحفظ" });
    } finally {
      setLoading(false);
    }
  };

  // Memory Actions
  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;
    setLoading(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, memory: editingMemory }),
      });
      const data = await res.json();
      if (data.success) {
        setMemoriesList(data.memories);
        setEditingMemory(null);
        setStatusMsg({ type: "success", text: "تم حفظ الذكرى بنجاح!" });
      } else {
        setStatusMsg({ type: "error", text: data.error || "فشل حفظ الذكرى" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "حدث خطأ أثناء الحفظ" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemory = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الذكرى؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/memories?id=${id}&passcode=${encodeURIComponent(passcode)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMemoriesList(data.memories);
        setStatusMsg({ type: "success", text: "تم حذف الذكرى بنجاح" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "فشل حذف الذكرى" });
    } finally {
      setLoading(false);
    }
  };

  // Reason Actions
  const handleSaveReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReason) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, reason: editingReason }),
      });
      const data = await res.json();
      if (data.success) {
        setReasonsList(data.reasons);
        setEditingReason(null);
        setStatusMsg({ type: "success", text: "تم حفظ بطاقة الميزة بنجاح!" });
      } else {
        setStatusMsg({ type: "error", text: data.error || "فشل حفظ البطاقة" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "حدث خطأ أثناء الحفظ" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReason = async (id: number) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reasons?id=${id}&passcode=${encodeURIComponent(passcode)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setReasonsList(data.reasons);
        setStatusMsg({ type: "success", text: "تم الحذف بنجاح" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "فشل الحذف" });
    } finally {
      setLoading(false);
    }
  };

  // Milestone Actions
  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;
    setLoading(true);
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, milestone: editingMilestone }),
      });
      const data = await res.json();
      if (data.success) {
        setMilestonesList(data.milestones);
        setEditingMilestone(null);
        setStatusMsg({ type: "success", text: "تم حفظ المحطة بنجاح!" });
      } else {
        setStatusMsg({ type: "error", text: data.error || "فشل حفظ المحطة" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "حدث خطأ أثناء الحفظ" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMilestone = async (id: number) => {
    if (!confirm("هل تريد حذف هذه المحطة؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/milestones?id=${id}&passcode=${encodeURIComponent(passcode)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMilestonesList(data.milestones);
        setStatusMsg({ type: "success", text: "تم حذف المحطة" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "فشل الحذف" });
    } finally {
      setLoading(false);
    }
  };

  // Wish Actions
  const handleDeleteWish = async (id: number) => {
    if (!confirm("هل تريد حذف هذه التهنئة؟")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/wishes?id=${id}&passcode=${encodeURIComponent(passcode)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setWishesList(data.wishes);
        setStatusMsg({ type: "success", text: "تم حذف التهنئة" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "فشل الحذف" });
    } finally {
      setLoading(false);
    }
  };

  // Reset to default
  const handleResetToDefault = async () => {
    if (!confirm("تحذير: هل أنت متأكد من إعادة ضبط كل محتويات الموقع إلى البيانات الأصلية؟ ستحل البيانات الافتراضية محل التعديلات.")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", text: "تمت إعادة ضبط الموقع للبيانات الافتراضية بنجاح!" });
        fetchAllData(passcode);
      } else {
        setStatusMsg({ type: "error", text: data.error || "فشلت إعادة الضبط" });
      }
    } catch {
      setStatusMsg({ type: "error", text: "حدث خطأ أثناء إعادة الضبط" });
    } finally {
      setLoading(false);
    }
  };

  // IF NOT AUTHENTICATED: Show Secret PIN screen
  if (!isAuthenticated) {
    return (
      <div className={`${isModal ? "p-6" : "min-h-screen flex items-center justify-center p-4"} bg-[#0b0512] text-rose-100`}>
        <div className="max-w-md w-full mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#1e0a2e] to-[#12041c] border-2 border-rose-500/40 shadow-2xl relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 text-rose-300 hover:text-white"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-600/40">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-black text-center text-white mb-2">
            لوحة التحكم المحمية
          </h2>
          <p className="text-xs sm:text-sm text-center text-rose-200/70 mb-6">
            أدخل الرمز السري للتحكم وتعديل كافة أقسام موقع عيد الميلاد
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-rose-200 mb-2">
                الرمز السري (Passcode / PIN)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="أدخل الرمز السري..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-rose-500/40 text-white placeholder-rose-300/30 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-rose-400"
                />
                <KeyRound className="absolute right-3 top-3.5 w-5 h-5 text-rose-400/50" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "جارٍ التحقق..." : "دخول لوحة التحكم 🔓"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-rose-500/20 text-center text-[11px] text-rose-300/50">
            💡 ملاحظة للمسؤول: الرمز السري الافتراضي هو: <code className="bg-rose-950/60 px-2 py-0.5 rounded text-amber-300 font-mono">2026</code> ويمكنك تغييره من الداخل في أي وقت.
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED: Full Admin Dashboard
  return (
    <div className={`${isModal ? "p-4 sm:p-6" : "min-h-screen py-10 px-4 sm:px-6 lg:px-8"} bg-[#0d0516] text-rose-100`}>
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-rose-500/20 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                لوحة تحكم موقع عيد ميلاد {settings.friendName || "صديقتي"}
              </h1>
              <span className="text-xs text-rose-300/70">
                يمكنك تخصيص وتعديل أي كلمة، صورة، أو قسم في الموقع
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-rose-200 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>معاينة الموقع الرئيسي</span>
            </Link>

            <button
              onClick={handleResetToDefault}
              title="إعادة تعيين كافة الأقسام للبيانات الأصلية"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">إعادة ضبط للبيانات الافتراضية</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm animate-fade-in ${
              statusMsg.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-200"
                : "bg-red-500/20 border border-red-500/40 text-red-200"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none border-b border-rose-500/15">
          {[
            { id: "general", label: "الإعدادات العامة والرمز", icon: Lock },
            { id: "hero", label: "قسم البداية (Hero)", icon: Sparkles },
            { id: "letter", label: "رسالة القلب", icon: Feather },
            { id: "cake", label: "الكعكة والشموع", icon: Cake },
            { id: "gift", label: "صندوق الهدية", icon: Gift },
            { id: "memories", label: "أجمل الذكريات", icon: Camera },
            { id: "reasons", label: "لماذا أنتِ مميزة؟", icon: Heart },
            { id: "timeline", label: "الخط الزمني", icon: Clock },
            { id: "wishes", label: "سجل التهاني", icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  active
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30"
                    : "bg-white/5 hover:bg-white/10 text-rose-200/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: General Settings & Passcode */}
        {activeTab === "general" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-400" />
              <span>الإعدادات الأساسية والرمز السري</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  اسم الصديقة (الاسم الرئيسي المعروض) *
                </label>
                <input
                  type="text"
                  value={settings.friendName || ""}
                  onChange={(e) => setSettings({ ...settings, friendName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  اللقب الخاص أو العبارة التكريمية
                </label>
                <input
                  type="text"
                  value={settings.friendNickname || ""}
                  onChange={(e) => setSettings({ ...settings, friendNickname: e.target.value })}
                  placeholder="مثال: أميرة قلبي ونور أيامي"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  اسم المُرسل (اسمك أنتِ أو لقبك)
                </label>
                <input
                  type="text"
                  value={settings.senderName || ""}
                  onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  تاريخ ووقت عيد الميلاد (للعداد التنازلي)
                </label>
                <input
                  type="datetime-local"
                  value={settings.birthdayDate || ""}
                  onChange={(e) => setSettings({ ...settings, birthdayDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="md:col-span-2 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-3">
                <label className="block text-xs font-bold text-amber-300">
                  🔐 تغيير الرمز السري للوحة التحكم (اتركه فارغاً إن كنت لا تريد تغييره)
                </label>
                <input
                  type="text"
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  placeholder="اكتب الرمز السري الجديد هنا (مثال: 5544 أو عيدميلاد)"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:scale-103 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Hero Section */}
        {activeTab === "hero" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>تعديل قسم البداية والترحيب (Hero Section)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  شارة التميز العلوية (Badge)
                </label>
                <input
                  type="text"
                  value={settings.heroBadge || ""}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  placeholder="✨ يوم ميلاد أجمل وأعز البشر"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  العنوان الرئيسي الكبير
                </label>
                <input
                  type="text"
                  value={settings.heroTitle || ""}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  النص الترحيبي العاطفي (الوصف)
                </label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitle || ""}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  رابط صورة الغلاف الخلفية (Hero Background Image URL)
                </label>
                <input
                  type="text"
                  value={settings.heroImageUrl || ""}
                  onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 font-mono text-xs"
                />
                {settings.heroImageUrl && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-rose-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.heroImageUrl}
                      alt="معاينة الغلاف"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:scale-103 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ قسم البداية</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Heartfelt Letter */}
        {activeTab === "letter" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Feather className="w-5 h-5 text-rose-400" />
              <span>تعديل رسالة القلب الشخصية</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  عنوان الرسالة
                </label>
                <input
                  type="text"
                  value={settings.letterTitle || ""}
                  onChange={(e) => setSettings({ ...settings, letterTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  نص الرسالة الكامل (استخدم سطرين فارغين بين الفقرات للفصل بينها)
                </label>
                <textarea
                  rows={8}
                  value={settings.letterContent || ""}
                  onChange={(e) => setSettings({ ...settings, letterContent: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 leading-relaxed font-amiri text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  المقولة أو العبارة الشعرية الخاصة
                </label>
                <input
                  type="text"
                  value={settings.letterQuote || ""}
                  onChange={(e) => setSettings({ ...settings, letterQuote: e.target.value })}
                  placeholder="«بعض الأرواح كالأزهار، أينما حلّت أزهرت الحياة عطراً»"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  التوقيع الختامي
                </label>
                <input
                  type="text"
                  value={settings.letterSignature || ""}
                  onChange={(e) => setSettings({ ...settings, letterSignature: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:scale-103 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ رسالة القلب</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Cake & Wish */}
        {activeTab === "cake" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cake className="w-5 h-5 text-rose-400" />
              <span>تعديل كعكة عيد الميلاد والأمنية السرية</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  عنوان قسم الكعكة
                </label>
                <input
                  type="text"
                  value={settings.cakeTitle || ""}
                  onChange={(e) => setSettings({ ...settings, cakeTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  التعليمات (نص الطلب بإطفاء الشموع)
                </label>
                <input
                  type="text"
                  value={settings.cakeSubtitle || ""}
                  onChange={(e) => setSettings({ ...settings, cakeSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  الأمنية أو الرسالة السرية التي تظهر عند إطفاء الشمعة! ✨
                </label>
                <textarea
                  rows={4}
                  value={settings.cakeWishReveal || ""}
                  onChange={(e) => setSettings({ ...settings, cakeWishReveal: e.target.value })}
                  placeholder="🎂 أمنية مباركة: عسى أن يجعل الله هذا العام..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:scale-103 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ إعدادات الكعكة</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Secret Gift Box */}
        {activeTab === "gift" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-rose-400" />
              <span>تعديل صندوق المفاجأة والهدية الخاصة (القسيمة)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  عنوان الصندوق الخارجي
                </label>
                <input
                  type="text"
                  value={settings.giftTitle || ""}
                  onChange={(e) => setSettings({ ...settings, giftTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  الوصف أو التلميح الخارجي
                </label>
                <input
                  type="text"
                  value={settings.giftSubtitle || ""}
                  onChange={(e) => setSettings({ ...settings, giftSubtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  عنوان المفاجأة المكشوفة (Voucher Title)
                </label>
                <input
                  type="text"
                  value={settings.giftRevealTitle || ""}
                  onChange={(e) => setSettings({ ...settings, giftRevealTitle: e.target.value })}
                  placeholder="🎁 تذكرة يوم الدلال والمفاجآت السعيدة!"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  تفاصيل الهدية أو بنود القسيمة (كل سطر يعتبر بنداً)
                </label>
                <textarea
                  rows={5}
                  value={settings.giftRevealMessage || ""}
                  onChange={(e) => setSettings({ ...settings, giftRevealMessage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-200 mb-1.5">
                  رابط صورة الهدية أو التذكار (اختياري)
                </label>
                <input
                  type="text"
                  value={settings.giftImageUrl || ""}
                  onChange={(e) => setSettings({ ...settings, giftImageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-rose-500/30 text-white text-sm focus:outline-none focus:border-rose-400 font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:scale-103 active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ إعدادات الهدية</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 6: Photo Memories Gallery */}
        {activeTab === "memories" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-400" />
                <span>إدارة معرض الصور والذكريات ({memoriesList.length})</span>
              </h2>

              <button
                onClick={() =>
                  setEditingMemory({
                    title: "",
                    date: "ذكرى خاصة",
                    description: "",
                    imageUrl: "https://images.pexels.com/photos/7358342/pexels-photo-7358342.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                    orderIndex: memoriesList.length + 1,
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صورة وذكرى جديدة</span>
              </button>
            </div>

            {/* List of Memories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memoriesList.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.imageUrl}
                      alt={m.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-rose-500/30"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-sm truncate">{m.title}</h4>
                      <span className="text-[11px] text-pink-300 block">{m.date}</span>
                      <p className="text-xs text-rose-200/70 truncate">{m.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingMemory(m)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 transition-colors"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Memory Edit Modal Form */}
            {editingMemory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="bg-[#1c082b] border border-rose-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                    <h3 className="font-bold text-lg text-white">
                      {editingMemory.id ? "تعديل الذكرى" : "إضافة ذكرى جديدة"}
                    </h3>
                    <button
                      onClick={() => setEditingMemory(null)}
                      className="text-rose-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMemory} className="space-y-3">
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">عنوان الذكرى *</label>
                      <input
                        type="text"
                        required
                        value={editingMemory.title || ""}
                        onChange={(e) => setEditingMemory({ ...editingMemory, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-rose-200 mb-1">التاريخ أو المناسبة</label>
                      <input
                        type="text"
                        value={editingMemory.date || ""}
                        onChange={(e) => setEditingMemory({ ...editingMemory, date: e.target.value })}
                        placeholder="مثال: صيف 2023، أو يوم التخرج..."
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-rose-200 mb-1">رابط الصورة (Image URL) *</label>
                      <input
                        type="text"
                        required
                        value={editingMemory.imageUrl || ""}
                        onChange={(e) => setEditingMemory({ ...editingMemory, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-rose-200 mb-1">وصف الذكرى والكلمات المعبرة</label>
                      <textarea
                        rows={3}
                        value={editingMemory.description || ""}
                        onChange={(e) => setEditingMemory({ ...editingMemory, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-rose-200 mb-1">ترتيب الظهور</label>
                      <input
                        type="number"
                        value={editingMemory.orderIndex || 0}
                        onChange={(e) => setEditingMemory({ ...editingMemory, orderIndex: Number(e.target.value) })}
                        className="w-24 px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingMemory(null)}
                        className="px-4 py-2 rounded-xl bg-white/10 text-rose-200 text-xs font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold"
                      >
                        حفظ الذكرى
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Reasons Section */}
        {activeTab === "reasons" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <span>إدارة أسباب التقدير ("لماذا أنتِ مميزة؟") ({reasonsList.length})</span>
              </h2>

              <button
                onClick={() =>
                  setEditingReason({
                    title: "",
                    description: "",
                    emoji: "🌸",
                    orderIndex: reasonsList.length + 1,
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سبب أو ميزة جديدة</span>
              </button>
            </div>

            {/* List of Reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reasonsList.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.emoji}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{r.title}</h4>
                      <p className="text-xs text-rose-200/70 line-clamp-1">{r.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingReason(r)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 transition-colors"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReason(r.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reason Modal Form */}
            {editingReason && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="bg-[#1c082b] border border-rose-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                    <h3 className="font-bold text-lg text-white">
                      {editingReason.id ? "تعديل الميزة" : "إضافة ميزة جديدة"}
                    </h3>
                    <button onClick={() => setEditingReason(null)} className="text-rose-300 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveReason} className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-20">
                        <label className="block text-xs text-rose-200 mb-1">الأيقونة</label>
                        <input
                          type="text"
                          value={editingReason.emoji || "💖"}
                          onChange={(e) => setEditingReason({ ...editingReason, emoji: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-center text-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-rose-200 mb-1">عنوان الميزة أو السبب *</label>
                        <input
                          type="text"
                          required
                          value={editingReason.title || ""}
                          onChange={(e) => setEditingReason({ ...editingReason, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-rose-200 mb-1">الوصف التفصيلي *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingReason.description || ""}
                        onChange={(e) => setEditingReason({ ...editingReason, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingReason(null)}
                        className="px-4 py-2 rounded-xl bg-white/10 text-rose-200 text-xs font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold"
                      >
                        حفظ الميزة
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: Milestones Timeline */}
        {activeTab === "timeline" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-400" />
                <span>إدارة محطات الخط الزمني ({milestonesList.length})</span>
              </h2>

              <button
                onClick={() =>
                  setEditingMilestone({
                    date: "سنة 2024",
                    title: "",
                    description: "",
                    icon: "heart",
                    orderIndex: milestonesList.length + 1,
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة محطة جديدة</span>
              </button>
            </div>

            <div className="space-y-3">
              {milestonesList.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs text-amber-300 font-mono block">{m.date}</span>
                    <h4 className="font-bold text-white text-sm">{m.title}</h4>
                    <p className="text-xs text-rose-200/70">{m.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingMilestone(m)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Milestone Edit Modal */}
            {editingMilestone && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <div className="bg-[#1c082b] border border-rose-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                    <h3 className="font-bold text-lg text-white">
                      {editingMilestone.id ? "تعديل المحطة" : "إضافة محطة جديدة"}
                    </h3>
                    <button onClick={() => setEditingMilestone(null)} className="text-rose-300 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMilestone} className="space-y-3">
                    <div>
                      <label className="block text-xs text-rose-200 mb-1">التاريخ أو التوقيت *</label>
                      <input
                        type="text"
                        required
                        value={editingMilestone.date || ""}
                        onChange={(e) => setEditingMilestone({ ...editingMilestone, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-rose-200 mb-1">عنوان المحطة *</label>
                      <input
                        type="text"
                        required
                        value={editingMilestone.title || ""}
                        onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-rose-200 mb-1">التفاصيل</label>
                      <textarea
                        rows={3}
                        value={editingMilestone.description || ""}
                        onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-rose-500/30 text-white text-sm"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingMilestone(null)}
                        className="px-4 py-2 rounded-xl bg-white/10 text-rose-200 text-xs font-semibold"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold"
                      >
                        حفظ المحطة
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 9: Wishes Guestbook */}
        {activeTab === "wishes" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#190726] border border-rose-500/20 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-400" />
              <span>إدارة رسائل وسجل التهاني ({wishesList.length})</span>
            </h2>

            <div className="space-y-3">
              {wishesList.length === 0 ? (
                <div className="p-6 text-center text-rose-300/60 text-sm">لا توجد رسائل حالياً</div>
              ) : (
                wishesList.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl bg-black/40 border border-rose-500/20 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{w.senderName}</span>
                        {w.relation && (
                          <span className="text-[11px] text-pink-300">({w.relation})</span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed font-amiri text-base">
                        {w.message}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteWish(w.id)}
                      className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors shrink-0"
                      title="حذف الرسالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
