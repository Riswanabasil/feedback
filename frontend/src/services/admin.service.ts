import { apiAdmin } from "../lib/api";
import type { AdminFeedbackQuery, AdminFeedbackResponse, AdminSummary } from "../types/api";

export async function getAdminSummary() {
  const { data } = await apiAdmin.get<AdminSummary>("/api/admin/summary");
  return data;
}

export async function getAdminFeedback(params: AdminFeedbackQuery) {
  const { data } = await apiAdmin.get<AdminFeedbackResponse>("/api/admin/feedback", { params });
  return data;
}
