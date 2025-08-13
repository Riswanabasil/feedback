import { apiUser } from "../lib/api";
import type { FeedbackItem } from "../types/api";

export async function createFeedback(payload: { rating: number; comment: string }) {
  const { data } = await apiUser.post<{ feedback: FeedbackItem }>("/api/feedback", payload);
  return data.feedback;
}

export async function listMyFeedback() {
  const { data } = await apiUser.get<{ feedback: FeedbackItem[] }>("/api/feedback/me");
  return data.feedback;
}
