import { db } from "./index";
import { siteSettings, memories, reasons, milestones, wishes } from "./schema";
import { sql } from "drizzle-orm";

export async function ensureInitialData() {
  try {
    // Check if site_settings exists
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({
        secretPasscode: "2026",
        friendName: "سارة",
        friendNickname: "أميرة قلبي ونور أيامي",
        senderName: "أعز الناس لقلبك",
        birthdayDate: "2026-05-15T00:00",
        heroTitle: "عيد ميلاد سعيد يا أجمل ما رأت عيني!",
        heroSubtitle: "في هذا اليوم المميز، أشرقت شمسكِ على العالم لتجعلي حياتي وكل تفاصيلها أكثر إشراقاً ودلالاً.",
        heroBadge: "✨ اليوم يومكِ الاستثنائي يا غالية",
        heroImageUrl: "https://images.pexels.com/photos/433527/pexels-photo-433527.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        letterTitle: "رسالة من أعماق القلب لكِ وحدكِ",
        letterContent: `إلى رفيقة روحي وأغلى صديقة،\n\nكل عام وأنتِ النور الساطع في عالمي، والابتسامة التي لا تغيب عن خاطري. في كل عام يمضي، أكتشف أن وجودكِ بجانبي هو أعظم هدية ساقها القدر لي.\n\nأنتِ لستِ مجرد رفيقة، بل الأمان الذي ألجأ إليه، والضحكة العفوية التي تُنسيني تعب الحياة. شكراً لأنكِ أنتِ.. بنقائك، وطيبتك، وعفويتكِ التي لا تشبه أحداً.\n\nأتمنى لكِ في عامكِ الجديد أن تتحقق كل أمنياتكِ التي تهمسين بها للسماء، وأن يظل قلبكِ الطيب مزهراً بالسعادة دائماً وأبداً.`,
        letterQuote: "«بعض الأرواح كالأزهار النادرة، أينما حلّت تركت أثراً طيباً وعبقاً لا يزول»",
        letterSignature: "مع كل حبي وتقديري الدائم ❤️",
        cakeTitle: "كعكة عيد ميلادكِ السحرية",
        cakeSubtitle: "أغمضي عينيكِ، تمني أمنية سرية من قلبكِ، ثم اضغطي على الشمعة لتطفئيها!",
        cakeWishReveal: "🎂 أمنية مباركة: عسى أن يجعل الله هذا العام بداية لأجمل أقداركِ، وأن تُزهر أيامكِ فرحاً لا ينتهي!",
        giftTitle: "صندوق المفاجأة والهدية الخاصة",
        giftSubtitle: "انقري على الصندوق لفك الشريط واكتشاف هديتكِ!",
        giftRevealTitle: "🎁 تذكرة يوم الدلال والمفاجآت السعيدة!",
        giftRevealMessage: `هذه بطاقة خاصة بكِ صالحة للاستخدام في أي وقت:\n✨ يوم كامل من اختياركِ، نذهب لأماكنكِ المفضلة ونتناول ألذ قهوة وحلوى!\n✨ مفاجأة شخصية مميزة جهزتها لكِ تليق بذوقكِ الرفيع.\n✨ وعد أبدي بالوقوف بجانبكِ في كل خطوة وضحكة وحلم!`,
        giftImageUrl: "https://images.pexels.com/photos/13983751/pexels-photo-13983751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        themeColor: "rose",
        musicEnabled: true,
        musicTitle: "لحن عيد الميلاد الرومانسي 🎵",
      });
    }

    // Check memories
    const existingMemories = await db.select().from(memories).limit(1);
    if (existingMemories.length === 0) {
      await db.insert(memories).values([
        {
          title: "يوم التقينا للمرة الأولى",
          date: "أجمل صدفة في حياتي",
          description: "تلك اللحظة البسيطة التي لم نكن نعلم أنها ستكون بداية لأغلى وأصدق قصة صداقة وأخوة في الوجود.",
          imageUrl: "https://images.pexels.com/photos/7358342/pexels-photo-7358342.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          orderIndex: 1,
          likesCount: 24,
        },
        {
          title: "ضحكاتنا العفوية في المقهى",
          date: "جلسات لا تُنسى",
          description: "ساعات تمر كأنها ثوانٍ معدودة حين نضحك من قلوبنا ونشارك كل الأسرار والأحاديث الصغيرة.",
          imageUrl: "https://images.pexels.com/photos/39910769/pexels-photo-39910769.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          orderIndex: 2,
          likesCount: 31,
        },
        {
          title: "غروب الشمس وأحاديث المستقبل",
          date: "يوم البحر والهدوء",
          description: "حين تحدثنا عن أحلامنا الكبيرة وتمنينا أن نصل إليها سوياً.. واليوم نراها تقترب خطوة بخطوة.",
          imageUrl: "https://images.pexels.com/photos/30307063/pexels-photo-30307063.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          orderIndex: 3,
          likesCount: 19,
        },
        {
          title: "الاحتفال بنجاحكِ وتألقكِ",
          date: "يوم فخري بكِ",
          description: "فرحتي في ذلك اليوم كانت أكبر من أي تعبير، رأيت ثمرة جهدكِ وإشراقة عيونكِ بالانتصار.",
          imageUrl: "https://images.pexels.com/photos/4850237/pexels-photo-4850237.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          orderIndex: 4,
          likesCount: 42,
        },
        {
          title: "مفاجأة العام الماضي والشموع",
          date: "ذكرى لا تمحى",
          description: "حين رأيت لمعة المفاجأة في عينيكِ وعلمت أن سعادتكِ هي دائماً ما يستحق كل التعب والترتيب.",
          imageUrl: "https://images.pexels.com/photos/15075570/pexels-photo-15075570.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          orderIndex: 5,
          likesCount: 38,
        },
        {
          title: "أيام الدعم والمساندة الصادقة",
          date: "كتف إلى كتف",
          description: "في أصعب الأيام كنتِ البلسم والسند الذي لم يتخلَّ عني أبداً، شكراً لعطائكِ الذي لا ينضب.",
          imageUrl: "https://images.pexels.com/photos/36765306/pexels-photo-36765306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          orderIndex: 6,
          likesCount: 29,
        },
      ]);
    }

    // Check reasons
    const existingReasons = await db.select().from(reasons).limit(1);
    if (existingReasons.length === 0) {
      await db.insert(reasons).values([
        {
          title: "قلبكِ الأبيض النقي",
          description: "تمتلكين طيبة قلب نادرة لا تعرف ضغينة، تمنحين الدفء واللطف لكل من يقترب منكِ.",
          emoji: "🌸",
          orderIndex: 1,
        },
        {
          title: "ابتسامتكِ التي تشع أملاً",
          description: "مجرد رؤية ابتسامتكِ قادرة على محو كآبة يوم كامل وإعادة النور إلى أي مكان تدخلينه.",
          emoji: "✨",
          orderIndex: 2,
        },
        {
          title: "أوفى صديقة وسند حقيقي",
          description: "وجودكِ في حياتي يعني الأمان المطلق، أعلم أنكِ السند الذي لا يميل في أي عاصفة.",
          emoji: "🛡️",
          orderIndex: 3,
        },
        {
          title: "عفويتكِ وروحكِ المرحة",
          description: "معكِ تسقط كل التكلفات، نضحك من صميم قلوبنا ونتصرف على سجيتنا بكل راحة وحرية.",
          emoji: "🎈",
          orderIndex: 4,
        },
        {
          title: "طموحكِ وإصراركِ الملهم",
          description: "شغفكِ بالحياة وحبكِ للتطور يلهم كل من حولكِ للسعي وراء أحلامهم دون تردد.",
          emoji: "🌟",
          orderIndex: 5,
        },
        {
          title: "تفهمكِ الصامت لكل مشاعري",
          description: "تفهمين ما في خاطري دون أن أنطق بكلمة واحدة، لغة الأرواح بيننا تتفوق على أي حديث.",
          emoji: "💎",
          orderIndex: 6,
        },
      ]);
    }

    // Check milestones
    const existingMilestones = await db.select().from(milestones).limit(1);
    if (existingMilestones.length === 0) {
      await db.insert(milestones).values([
        {
          date: "المحطة الأولى",
          title: "أول لقاء وبداية الحديث",
          description: "كلمات بسيطة فتحت باباً لعالم من الصداقة المتينة التي لم تهتز يوماً.",
          icon: "sparkles",
          orderIndex: 1,
        },
        {
          date: "المحطة الثانية",
          title: "المغامرات والضحك المشترك",
          description: "اكتشفنا أننا نتشارك نفس الذوق ونفس الجنون وأجمل نوبات الضحك.",
          icon: "heart",
          orderIndex: 2,
        },
        {
          date: "المحطة الثالثة",
          title: "اختبار المواقف الصعبة",
          description: "أثبتت لنا الأيام أن صلتنا أقوى من أي ظرف وأمتن من كل المسافات.",
          icon: "shield",
          orderIndex: 3,
        },
        {
          date: "المحطة الرابعة",
          title: "نجاحات متبادلة وفخر كبير",
          description: "احتفلنا بكل خطوة نجاح وكأنها إنجاز شخصي لكل منا.",
          icon: "trophy",
          orderIndex: 4,
        },
        {
          date: "اليوم وكل يوم",
          title: "عيد ميلادكِ السعيد والجديد",
          description: "نقطة انطلاق لعام جديد نملأه بالذكريات والضحكات التي تستحقينها دائماً.",
          icon: "cake",
          orderIndex: 5,
        },
      ]);
    }

    // Check wishes
    const existingWishes = await db.select().from(wishes).limit(1);
    if (existingWishes.length === 0) {
      await db.insert(wishes).values([
        {
          senderName: "صديقتك المقربة",
          relation: "رفيقة الروح",
          message: "كل عام وأنتِ الأجمل والأغلى في قلبي! عسى سنينكِ كلها أفراح وتحقيق أماني يا أحلى سارة في الدنيا.",
          likes: 12,
          isApproved: true,
        },
        {
          senderName: "صديق العائلة",
          relation: "أخ وصديق",
          message: "سنة حلوة تشبه نقاء قلبكِ وطيبتكِ، ربي يسعدكِ ويوفقكِ في كل خطواتكِ القادمة.",
          likes: 8,
          isApproved: true,
        },
        {
          senderName: "شريك الضحكات",
          relation: "صديق مقرب",
          message: "كل سنة وأنتِ طيبة يا أعظم وأطيب إنسانة! دامت ضحكتكِ شمس أيامنا.",
          likes: 15,
          isApproved: true,
        },
      ]);
    }
  } catch (error) {
    console.error("Error ensuring initial data:", error);
  }
}
