import { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "لوحة التحكم المحمية بالرمز السري | موقع عيد ميلاد صديقتي",
  description: "لوحة تحكم كاملة لتعديل وتخصيص كل أقسام موقع عيد الميلاد برمز سري.",
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#0b0512]">
      <AdminDashboard isModal={false} />
    </main>
  );
}
