import { IFeedbackRepository } from "../interface/feedback.repository.interface";
import { IBookingRepository } from "../interface/booking.repository.interface";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../core/error.response";
import { prisma } from "../lib/prisma";

export default class FeedbackService {
  constructor(
    private feedbackRepo: IFeedbackRepository,
    private bookingRepo: IBookingRepository,
  ) {}

  async createFeedback(data: {
    userId: string;
    roomId: string;
    rating: number;
    comment?: string;
  }) {
    const { userId, roomId, rating, comment } = data;

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new BadRequestError("Rating must be between 1 and 5");
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    // Check if user has a completed booking for this room
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId,
        roomId,
        status: "COMPLETED",
      },
    });

    if (!hasBooking) {
      throw new ForbiddenError(
        "You can only leave feedback for rooms you have booked and completed",
      );
    }

    // Check if user already left feedback for this room
    const existingFeedback = await this.feedbackRepo.findUserFeedbackForRoom(
      userId,
      roomId,
    );

    if (existingFeedback) {
      throw new BadRequestError("You have already left feedback for this room");
    }

    return this.feedbackRepo.create({
      userId,
      roomId,
      rating,
      comment,
    });
  }

  async getFeedbacks(params: {
    roomId?: string;
    page?: number;
    limit?: number;
  }) {
    const { roomId, page = 1, limit = 10 } = params;

    const skip = (page - 1) * limit;
    const take = limit;

    const filter: any = {};
    if (roomId) {
      filter.roomId = roomId;
    }

    const [feedbacks, total] = await Promise.all([
      this.feedbackRepo.findMany(filter, { skip, take }),
      this.feedbackRepo.count(filter),
    ]);

    return {
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
