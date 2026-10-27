import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reasons } from "@/db/schema";
import { ensureInitialData } from "@/db/seed";
import { verifyPasscode } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureInitialData();
    const list = await db.select().from(reasons).orderBy(asc(reasons.orderIndex), asc(reasons.id));
    return NextResponse.json({ success: true, reasons: list });
  } catch (error) {
    console.error("GET reasons error:", error);
    return NextResponse.json({ success: false, error: "تعذر جلب الأسباب" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, reason } = body;

    const isValid = await verifyPasscode(passcode);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "رمز المرور السري غير صحيح" }, { status: 401 });
    }

    if (!reason || !reason.title || !reason.description) {
      return NextResponse.json({ success: false, error: "العنوان والتفاصيل مطلوبان" }, { status: 400 });
    }

    if (reason.id) {
      await db
        .update(reasons)
        .set({
          title: reason.title,
          description: reason.description,
          emoji: reason.emoji || "💖",
          orderIndex: Number(reason.orderIndex) || 0,
        })
        .where(eq(reasons.id, Number(reason.id)));
    } else {
      await db.insert(reasons).values({
        title: reason.title,
        description: reason.description,
        emoji: reason.emoji || "💖",
        orderIndex: Number(reason.orderIndex) || 0,
      });
    }

    const list = await db.select().from(reasons).orderBy(asc(reasons.orderIndex), asc(reasons.id));
    return NextResponse.json({ success: true, message: "تم حفظ بطاقة التقدير بنجاح", reasons: list });
  } catch (error) {
    console.error("POST reasons error:", error);
    return NextResponse.json({ success: false, error: "تعذر حفظ البيانات" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const passcode = searchParams.get("passcode") || req.headers.get("x-admin-passcode");

    if (!passcode || !(await verifyPasscode(passcode))) {
      return NextResponse.json({ success: false, error: "رمز المرور السري غير صحيح" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف العنصر مطلوب" }, { status: 400 });
    }

    await db.delete(reasons).where(eq(reasons.id, Number(id)));
    const list = await db.select().from(reasons).orderBy(asc(reasons.orderIndex), asc(reasons.id));
    return NextResponse.json({ success: true, message: "تم الحذف بنجاح", reasons: list });
  } catch (error) {
    console.error("DELETE reason error:", error);
    return NextResponse.json({ success: false, error: "تعذر الحذف" }, { status: 500 });
  }
}
