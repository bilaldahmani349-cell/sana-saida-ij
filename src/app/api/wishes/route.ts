import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { ensureInitialData } from "@/db/seed";
import { verifyPasscode } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureInitialData();
    const list = await db.select().from(wishes).orderBy(desc(wishes.createdAt));
    return NextResponse.json({ success: true, wishes: list });
  } catch (error) {
    console.error("GET wishes error:", error);
    return NextResponse.json({ success: false, error: "تعذر جلب التهاني" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderName, relation, message } = body;

    if (!senderName || !message) {
      return NextResponse.json({ success: false, error: "الاسم ونص التهنئة مطلوبان" }, { status: 400 });
    }

    await db.insert(wishes).values({
      senderName: senderName.trim(),
      relation: relation ? relation.trim() : "صديق",
      message: message.trim(),
      likes: 0,
      isApproved: true,
    });

    const list = await db.select().from(wishes).orderBy(desc(wishes.createdAt));
    return NextResponse.json({ success: true, message: "تمت إضافة تهنئتكِ بنجاح! شكراً لكِ 💖", wishes: list });
  } catch (error) {
    console.error("POST wish error:", error);
    return NextResponse.json({ success: false, error: "تعذر إرسال التهنئة" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "معرف الرسالة مطلوب" }, { status: 400 });
    }

    await db.delete(wishes).where(eq(wishes.id, Number(id)));
    const list = await db.select().from(wishes).orderBy(desc(wishes.createdAt));
    return NextResponse.json({ success: true, message: "تم حذف الرسالة بنجاح", wishes: list });
  } catch (error) {
    console.error("DELETE wish error:", error);
    return NextResponse.json({ success: false, error: "تعذر الحذف" }, { status: 500 });
  }
}
