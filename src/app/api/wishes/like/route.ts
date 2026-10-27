import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { wishes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الرسالة مطلوب" }, { status: 400 });
    }

    await db
      .update(wishes)
      .set({
        likes: sql`${wishes.likes} + 1`,
      })
      .where(eq(wishes.id, Number(id)));

    const updated = await db.select().from(wishes).where(eq(wishes.id, Number(id))).limit(1);
    return NextResponse.json({ success: true, likes: updated[0]?.likes ?? 0 });
  } catch (error) {
    console.error("Like wish error:", error);
    return NextResponse.json({ success: false, error: "تعذر تسجيل الإعجاب" }, { status: 500 });
  }
}
