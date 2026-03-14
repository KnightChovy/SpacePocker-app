import { Feedback } from "@prisma/client";

export interface CreateFeedbackInput {
  userId: string;
  roomId: string;
  rating: number;
  comment?: string;
}

export interface GetFeedbacksFilter {
  roomId?: string;
  userId?: string;
}

export interface PaginationParams {
  skip: number;
  take: number;
}

export interface IFeedbackRepository {
  create(data: CreateFeedbackInput): Promise<Feedback>;

  findMany(
    filter: GetFeedbacksFilter,
    pagination: PaginationParams,
  ): Promise<Feedback[]>;

  count(filter: GetFeedbacksFilter): Promise<number>;

  findUserFeedbackForRoom(
    userId: string,
    roomId: string,
  ): Promise<Feedback | null>;
}
