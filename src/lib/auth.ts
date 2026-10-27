import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { ensureInitialData } from "@/db/seed";

export async function verifyPasscode(providedCode: string): Promise<boolean> {
  await ensureInitialData();
  const settingsList = await db.select().from(siteSettings).limit(1);
  if (settingsList.length === 0) {
    return providedCode === "2026";
  }
  const currentPin = settingsList[0].secretPasscode || "2026";
  return providedCode.trim() === currentPin.trim();
}
