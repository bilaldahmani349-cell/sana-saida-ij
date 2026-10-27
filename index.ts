/**
 * Birthday Celebration Web Application - Root Index Entrypoint
 * موقع احتفالي لعيد ميلاد صديقتي مع لوحة تحكم كاملة برمز سري
 */

export * from "./src/db/index";
export * from "./src/db/schema";
export * from "./src/db/seed";

export const APP_METADATA = {
  name: "Birthday Celebration Web App",
  arabicTitle: "موقع عيد ميلاد صديقتي الغالية",
  version: "1.0.0",
  author: "Expert Fullstack Developer",
  features: [
    "عداد تنازلي لعيد الميلاد ومفاجأة تفاعلية",
    "كعكة عيد ميلاد افتراضية مع إطفاء الشموع التفاعلي والمؤثرات الصوتية",
    "معرض صور وذكريات مع إمكانية التعديل والإضافة والحذف",
    "رسالة حب ووفاء شخصية بختم شمعي",
    "أسباب التقدير وبطاقات المحبة",
    "صندوق الهدايا والمفاجأة الرقمية مع فك الشريط",
    "سجل التهاني مع تفاعلات القلوب والتعليقات الحية",
    "لوحة تحكم كاملة محمية برمز سري لتعديل كل أقسام الموقع بدقة",
  ],
};

export default APP_METADATA;
