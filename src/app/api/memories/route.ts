import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { ensureInitialData } from "@/db/seed";
import { verifyPasscode } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureInitialData();
    const list = await db.select().from(memories).orderBy(asc(memories.orderIndex), asc(memories.id));
    return NextResponse.json({ success: true, memories: list });
  } catch (error) {
    console.error("GET memories error:", error);
    return NextResponse.json({ success: false, error: "تعذر جلب الذكريات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, memory } = body;

    const isValid = await verifyPasscode(passcode);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "رمز المرور السري غير صحيح" }, { status: 401 });
    }

    if (!memory || !memory.title || !memory.imageUrl) {
      return NextResponse.json({ success: false, error: "العنوان ورابط الصورة مطلوبان" }, { status: 400 });
    }

    if (memory.id) {
      // Update
      await db
        .update(memories)
        .set({
          title: memory.title,
          date: memory.date || "ذكرى جميلة",
          description: memory.description || "",
          imageUrl: memory.imageUrl,
          orderIndex: Number(memory.orderIndex) || 0,
        })
        .where(eq(memories.id, Number(memory.id)));
    } else {
      // Insert
      await db.insert(memories).values({
        title: memory.title,
        date: memory.date || "ذكرى جميلة",
        description: memory.description || "",
        imageUrl: memory.imageUrl,
        orderIndex: Number(memory.orderIndex) || 0,
        likesCount: 0,
      });
    }

    const list = await db.select().from(memories).orderBy(asc(memories.orderIndex), asc(memories.id));
    return NextResponse.json({ success: true, message: "تم حفظ الذكرى بنجاح", memories: list });
  } catch (error) {
    console.error("POST memories error:", error);
    return NextResponse.json({ success: false, error: "تعذر حفظ الذكرى" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "معرف الذكرى مطلوب" }, { status: 400 });
    }

    await db.delete(memories).where(eq(memories.id, Number(id)));
    const list = await db.select().from(memories).orderBy(asc(memories.orderIndex), asc(memories.id));
    return NextResponse.json({ success: true, message: "تم حذف الذكرى بنجاح", memories: list });
  } catch (error) {
    console.error("DELETE memory error:", error);
    return NextResponse.json({ success: false, error: "تعذر حذف الذكرى" }, { status: 500 });
  }
}
