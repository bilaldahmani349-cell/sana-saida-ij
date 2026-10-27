import { db } from "@/db";
import { siteSettings, memories, reasons, milestones, wishes } from "@/db/schema";
import { ensureInitialData } from "@/db/seed";
import { asc, desc } from "drizzle-orm";
import BirthdayAppClient from "@/components/BirthdayAppClient";

export const revalidate = 0;

export default async function HomePage() {
  await ensureInitialData();

  const [settingsList, memoriesList, reasonsList, milestonesList, wishesList] = await Promise.all([
    db.select().from(siteSettings).limit(1),
    db.select().from(memories).orderBy(asc(memories.orderIndex), asc(memories.id)),
    db.select().from(reasons).orderBy(asc(reasons.orderIndex), asc(reasons.id)),
    db.select().from(milestones).orderBy(asc(milestones.orderIndex), asc(milestones.id)),
    db.select().from(wishes).orderBy(desc(wishes.createdAt)),
  ]);

  const currentSettings = settingsList[0] || {
    id: 1,
    secretPasscode: "2026",
    friendName: "سارة",
    friendNickname: "أميرة قلبي ونور أيامي",
    senderName: "أعز الناس لقلبك",
    birthdayDate: "2026-05-15T00:00",
    heroTitle: "عيد ميلاد سعيد يا أغلى البشر!",
    heroSubtitle: "في هذا اليوم المميز، أشرقت شمسكِ على العالم لتجعلي حياتي وكل تفاصيلها أكثر إشراقاً ودلالاً.",
    heroBadge: "✨ يوم ميلاد أجمل الصدف",
    heroImageUrl: "https://images.pexels.com/photos/433527/pexels-photo-433527.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    letterTitle: "رسالة من أعماق القلب لكِ وحدكِ",
    letterContent: "كل عام وأنتِ النور الساطع في عالمي، والابتسامة التي لا تغيب عن خاطري.",
    letterQuote: "«بعض الأرواح كالأزهار النادرة، أينما حلّت أزهرت الحياة عطراً»",
    letterSignature: "مع كل حبي وتقديري الدائم ❤️",
    cakeTitle: "كعكة عيد ميلادكِ السحرية",
    cakeSubtitle: "أغمضي عينيكِ، تمني أمنية سرية من قلبكِ، ثم اضغطي على الشمعة لتطفئيها!",
    cakeWishReveal: "🎂 أمنية مباركة: عسى أن يجعل الله هذا العام بداية لأجمل أقداركِ، وأن تُزهر أيامكِ فرحاً لا ينتهي!",
    giftTitle: "صندوق المفاجأة والهدية الخاصة",
    giftSubtitle: "انقري على الصندوق لفك الشريط واكتشاف هديتكِ!",
    giftRevealTitle: "🎁 تذكرة يوم الدلال والمفاجآت السعيدة!",
    giftRevealMessage: "يوم كامل من اختياركِ، نذهب لأماكنكِ المفضلة ونتناول ألذ قهوة وحلوى!",
    giftImageUrl: "https://images.pexels.com/photos/13983751/pexels-photo-13983751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    themeColor: "rose",
    musicEnabled: true,
    musicTitle: "لحن عيد الميلاد الرومانسي 🎵",
    updatedAt: new Date(),
  };

  return (
    <BirthdayAppClient
      initialSettings={currentSettings}
      initialMemories={memoriesList}
      initialReasons={reasonsList}
      initialMilestones={milestonesList}
      initialWishes={wishesList}
    />
  );
}
