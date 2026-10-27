import { pgTable, serial, integer, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  secretPasscode: varchar("secret_passcode", { length: 100 }).notNull().default("2026"),
  friendName: varchar("friend_name", { length: 150 }).notNull().default("سارة"),
  friendNickname: varchar("friend_nickname", { length: 150 }).notNull().default("أميرة قلبي ونور أيامي"),
  senderName: varchar("sender_name", { length: 150 }).notNull().default("أقرب الناس لقلبك"),
  birthdayDate: varchar("birthday_date", { length: 50 }).notNull().default("2026-05-15T00:00"),
  heroTitle: text("hero_title").notNull().default("عيد ميلاد سعيد يا أغلى البشر!"),
  heroSubtitle: text("hero_subtitle").notNull().default("في هذا اليوم الاستثنائي، أشرقت الدنيا بولادتكِ وازدادت حياتي بهجة وجمالاً."),
  heroBadge: varchar("hero_badge", { length: 100 }).notNull().default("✨ يوم ميلاد أجمل الصدف"),
  heroImageUrl: text("hero_image_url").notNull().default("https://images.pexels.com/photos/433527/pexels-photo-433527.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"),
  letterTitle: text("letter_title").notNull().default("رسالة من أعماق القلب لكِ وحدكِ"),
  letterContent: text("letter_content").notNull().default("إلى صديقتي الغالية ورفيقة دربي،\n\nكل عام وأنتِ النور الذي يضيء عتمة الأيام، والضحكة التي تمحو كل تعب. في يوم ميلادكِ، أود أن أخبركِ كم أنا ممتن للقدر الذي جمعني بكِ. أنتِ لستِ مجرد صديقة، بل أخت وروح تسكن روحي.\n\nأتمنى لكِ عاماً مليئاً بالسلام والنجاح والمفاجآت السعيدة التي يستحقها قلبكِ الأبيض النقي. دمتِ لي شمس الأيام وسند العمر."),
  letterQuote: text("letter_quote").notNull().default("«بعض الأرواح كالأزهار، أينما حلّت أزهرت الحياة عطراً»"),
  letterSignature: text("letter_signature").notNull().default("مع كل حبي وامتناني الأبدي ❤️"),
  cakeTitle: text("cake_title").notNull().default("كعكة عيد ميلادكِ الافتراضية"),
  cakeSubtitle: text("cake_subtitle").notNull().default("أغمضي عينيكِ، تمني أمنية من قلبكِ، ثم اضغطي على الشمعة لإطفائها!"),
  cakeWishReveal: text("cake_wish_reveal").notNull().default("🎂 أمنية مباركة: عسى كل دعواتكِ السرية أن تصبح واقعاً يبهج قلبكِ هذا العام! كل عام وأنتِ محاطة بالحب والفرح."),
  giftTitle: text("gift_title").notNull().default("صندوق المفاجأة والهدية الخاصة"),
  giftSubtitle: text("gift_subtitle").notNull().default("اضغطي على الشريط لفتح هديتكِ الرقمية السرية!"),
  giftRevealTitle: text("gift_reveal_title").notNull().default("🎁 قسيمة يوم استثنائي لا يُنسى!"),
  giftRevealMessage: text("gift_reveal_message").notNull().default("هذه بطاقة خاصة بكِ تمنحكِ:\n١. يوم كامل نخصصه لكل ما تحبينه من قهوة وجولة ومفاجآت!\n٢. هدية تذكارية صُممت خصيصاً لتليق بجمال روحكِ.\n٣. وعد دائم بالوقوف بجانبكِ في كل لحظة."),
  giftImageUrl: text("gift_image_url").notNull().default("https://images.pexels.com/photos/13983751/pexels-photo-13983751.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"),
  themeColor: varchar("theme_color", { length: 50 }).notNull().default("rose"),
  musicEnabled: boolean("music_enabled").notNull().default(true),
  musicTitle: varchar("music_title", { length: 150 }).notNull().default("لحن عيد الميلاد السعيد 🎵"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reasons = pgTable("reasons", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  emoji: varchar("emoji", { length: 50 }).notNull().default("💖"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 100 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }).notNull().default("heart"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  senderName: varchar("sender_name", { length: 150 }).notNull(),
  relation: varchar("relation", { length: 100 }).default("صديق"),
  message: text("message").notNull(),
  likes: integer("likes").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type Memory = typeof memories.$inferSelect;
export type Reason = typeof reasons.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type Wish = typeof wishes.$inferSelect;
