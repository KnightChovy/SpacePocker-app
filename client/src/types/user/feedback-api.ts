export interface CreateFeedbackPayload {
  roomId: string;
  rating: number;
  comment?: string;
}

export interface FeedbackResponse {
  id: string;
  userId: string;
  roomId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}
