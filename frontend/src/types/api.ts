export type User = { id: string; name: string; email: string };

export type AuthResponse = {
  token: string;
  user: User;
};

export type FeedbackItem = {
  _id: string;
  userId: string;
  rating: number;
  comment: string;
  emotion: string | null;
  createdAt: string;
};

export type AdminSummary = {
  byEmotion: { emotion: string; count: number }[];
  avgRating: number;
  totalFeedback: number;
};

export type AdminFeedbackQuery = {
  page?: number;
  limit?: number;
  emotion?: string;
  minRating?: number;
};

export type AdminFeedbackResponse = {
  items: (FeedbackItem & { user?: { _id: string; name: string; email: string } | null })[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};
