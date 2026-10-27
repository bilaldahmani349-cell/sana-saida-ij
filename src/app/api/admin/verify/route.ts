import { NextRequest, NextResponse } from "next/server";
import { verifyPasscode } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;
    if (!passcode) {
      return NextResponse.json({ success: false, error: "الرجاء إدخال الرمز السري" }, { status: 400 });
    }

    const isValid = await verifyPasscode(passcode);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "رمز المرور السري غير صحيح. حاول مجدداً!" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "تم التحقق من الرمز بنجاح. أهلاً بك في لوحة التحكم!",
    });
  } catch (error) {
    console.error("verify passcode error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ أثناء التحقق" }, { status: 500 });
  }
}
