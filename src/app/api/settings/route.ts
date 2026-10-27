import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { ensureInitialData } from "@/db/seed";
import { verifyPasscode } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await ensureInitialData();
    const list = await db.select().from(siteSettings).limit(1);
    if (list.length === 0) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }
    const item = list[0];
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("passcode");

    const isAuthorized = code ? await verifyPasscode(code) : false;

    // If not authorized as admin, do not expose the secret passcode
    const responseData = isAuthorized
      ? item
      : {
          ...item,
          secretPasscode: undefined,
        };

    return NextResponse.json({ success: true, settings: responseData, isAdmin: isAuthorized });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, newPasscode, updates } = body;

    const isValid = await verifyPasscode(passcode);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "رمز المرور السري غير صحيح" }, { status: 401 });
    }

    const currentList = await db.select().from(siteSettings).limit(1);
    if (currentList.length === 0) {
      await ensureInitialData();
    }

    const toUpdate: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates) {
      if (typeof updates.friendName === "string") toUpdate.friendName = updates.friendName;
      if (typeof updates.friendNickname === "string") toUpdate.friendNickname = updates.friendNickname;
      if (typeof updates.senderName === "string") toUpdate.senderName = updates.senderName;
      if (typeof updates.birthdayDate === "string") toUpdate.birthdayDate = updates.birthdayDate;
      if (typeof updates.heroTitle === "string") toUpdate.heroTitle = updates.heroTitle;
      if (typeof updates.heroSubtitle === "string") toUpdate.heroSubtitle = updates.heroSubtitle;
      if (typeof updates.heroBadge === "string") toUpdate.heroBadge = updates.heroBadge;
      if (typeof updates.heroImageUrl === "string") toUpdate.heroImageUrl = updates.heroImageUrl;
      if (typeof updates.letterTitle === "string") toUpdate.letterTitle = updates.letterTitle;
      if (typeof updates.letterContent === "string") toUpdate.letterContent = updates.letterContent;
      if (typeof updates.letterQuote === "string") toUpdate.letterQuote = updates.letterQuote;
      if (typeof updates.letterSignature === "string") toUpdate.letterSignature = updates.letterSignature;
      if (typeof updates.cakeTitle === "string") toUpdate.cakeTitle = updates.cakeTitle;
      if (typeof updates.cakeSubtitle === "string") toUpdate.cakeSubtitle = updates.cakeSubtitle;
      if (typeof updates.cakeWishReveal === "string") toUpdate.cakeWishReveal = updates.cakeWishReveal;
      if (typeof updates.giftTitle === "string") toUpdate.giftTitle = updates.giftTitle;
      if (typeof updates.giftSubtitle === "string") toUpdate.giftSubtitle = updates.giftSubtitle;
      if (typeof updates.giftRevealTitle === "string") toUpdate.giftRevealTitle = updates.giftRevealTitle;
      if (typeof updates.giftRevealMessage === "string") toUpdate.giftRevealMessage = updates.giftRevealMessage;
      if (typeof updates.giftImageUrl === "string") toUpdate.giftImageUrl = updates.giftImageUrl;
      if (typeof updates.themeColor === "string") toUpdate.themeColor = updates.themeColor;
      if (typeof updates.musicEnabled === "boolean") toUpdate.musicEnabled = updates.musicEnabled;
      if (typeof updates.musicTitle === "string") toUpdate.musicTitle = updates.musicTitle;
    }

    // Change passcode if requested
    if (newPasscode && typeof newPasscode === "string" && newPasscode.trim().length > 0) {
      toUpdate.secretPasscode = newPasscode.trim();
    }

    const existing = await db.select().from(siteSettings).limit(1);
    if (existing.length > 0) {
      await db.update(siteSettings).set(toUpdate).where(eq(siteSettings.id, existing[0].id));
    }

    const updatedList = await db.select().from(siteSettings).limit(1);
    return NextResponse.json({
      success: true,
      message: "تم تحديث إعدادات الموقع بنجاح",
      settings: updatedList[0],
    });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ success: false, error: "تعذر حفظ التعديلات" }, { status: 500 });
  }
}
