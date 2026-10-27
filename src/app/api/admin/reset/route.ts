import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings, memories, reasons, milestones, wishes } from "@/db/schema";
import { verifyPasscode } from "@/lib/auth";
import { ensureInitialData } from "@/db/seed";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    const isValid = await verifyPasscode(passcode);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "رمز المرور السري غير صحيح" }, { status: 401 });
    }

    // Delete existing and re-seed
    await db.delete(wishes);
    await db.delete(milestones);
    await db.delete(reasons);
    await db.delete(memories);
    await db.delete(siteSettings);

    await ensureInitialData();

    return NextResponse.json({
      success: true,
      message: "تمت إعادة ضبط جميع أقسام الموقع إلى الإعدادات الافتراضية بنجاح!",
    });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ success: false, error: "فشلت إعادة الضبط" }, { status: 500 });
  }
}
