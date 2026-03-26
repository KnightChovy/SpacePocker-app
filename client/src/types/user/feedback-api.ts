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

export interface FeedbackUserSummary {
  id: string;
  name: string;
  email: string;
}

export interface FeedbackRoomSummary {
  id: string;
  name: string;
  roomCode: string;
}

export interface RoomFeedback extends FeedbackResponse {
  user?: FeedbackUserSummary;
  room?: FeedbackRoomSummary;
}

export interface GetFeedbacksPayload {
  roomId: string;
  page?: number;
  limit?: number;
}

export interface FeedbackPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetFeedbacksResponse {
  feedbacks: RoomFeedback[];
  pagination: FeedbackPagination;
}
