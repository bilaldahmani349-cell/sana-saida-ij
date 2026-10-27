/**
 * Application Source Index
 * موقع عيد ميلاد صديقتي مع لوحة تحكم سرية
 */

export * from "./db/index";
export * from "./db/schema";
export * from "./db/seed";

export const PROJECT_INFO = {
  title: "موقع عيد ميلاد صديقتي الاحترافي",
  hasAdminDashboard: true,
  passcodeProtected: true,
  defaultPin: "2026",
};
