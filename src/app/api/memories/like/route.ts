import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memories } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الذكرى مطلوب" }, { status: 400 });
    }

    await db
      .update(memories)
      .set({
        likesCount: sql`${memories.likesCount} + 1`,
      })
      .where(eq(memories.id, Number(id)));

    const updated = await db.select().from(memories).where(eq(memories.id, Number(id))).limit(1);
    return NextResponse.json({ success: true, likesCount: updated[0]?.likesCount ?? 0 });
  } catch (error) {
    console.error("Like memory error:", error);
    return NextResponse.json({ success: false, error: "تعذر تسجيل الإعجاب" }, { status: 500 });
  }
}
