import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { milestones } from "@/db/schema";
import { ensureInitialData } from "@/db/seed";
import { verifyPasscode } from "@/lib/auth";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureInitialData();
    const list = await db.select().from(milestones).orderBy(asc(milestones.orderIndex), asc(milestones.id));
    return NextResponse.json({ success: true, milestones: list });
  } catch (error) {
    console.error("GET milestones error:", error);
    return NextResponse.json({ success: false, error: "تعذر جلب المحطات" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, milestone } = body;

    const isValid = await verifyPasscode(passcode);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "رمز المرور السري غير صحيح" }, { status: 401 });
    }

    if (!milestone || !milestone.title || !milestone.date) {
      return NextResponse.json({ success: false, error: "التاريخ والعنوان مطلوبان" }, { status: 400 });
    }

    if (milestone.id) {
      await db
        .update(milestones)
        .set({
          date: milestone.date,
          title: milestone.title,
          description: milestone.description || "",
          icon: milestone.icon || "heart",
          orderIndex: Number(milestone.orderIndex) || 0,
        })
        .where(eq(milestones.id, Number(milestone.id)));
    } else {
      await db.insert(milestones).values({
        date: milestone.date,
        title: milestone.title,
        description: milestone.description || "",
        icon: milestone.icon || "heart",
        orderIndex: Number(milestone.orderIndex) || 0,
      });
    }

    const list = await db.select().from(milestones).orderBy(asc(milestones.orderIndex), asc(milestones.id));
    return NextResponse.json({ success: true, message: "تم حفظ المحطة بنجاح", milestones: list });
  } catch (error) {
    console.error("POST milestone error:", error);
    return NextResponse.json({ success: false, error: "تعذر حفظ المحطة" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "معرف المحطة مطلوب" }, { status: 400 });
    }

    await db.delete(milestones).where(eq(milestones.id, Number(id)));
    const list = await db.select().from(milestones).orderBy(asc(milestones.orderIndex), asc(milestones.id));
    return NextResponse.json({ success: true, message: "تم الحذف بنجاح", milestones: list });
  } catch (error) {
    console.error("DELETE milestone error:", error);
    return NextResponse.json({ success: false, error: "تعذر الحذف" }, { status: 500 });
  }
}
