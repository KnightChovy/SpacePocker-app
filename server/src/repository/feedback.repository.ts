import { prisma } from "../lib/prisma";
import {
  IFeedbackRepository,
  CreateFeedbackInput,
  GetFeedbacksFilter,
  PaginationParams,
} from "../interface/feedback.repository.interface";
import { Feedback } from "@prisma/client";

export class FeedbackRepository implements IFeedbackRepository {
  async create(data: CreateFeedbackInput): Promise<Feedback> {
    return prisma.feedback.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            roomCode: true,
          },
        },
      },
    });
  }

  async findMany(
    filter: GetFeedbacksFilter,
    pagination: PaginationParams,
  ): Promise<Feedback[]> {
    return prisma.feedback.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            roomCode: true,
          },
        },
      },
    });
  }

  async count(filter: GetFeedbacksFilter): Promise<number> {
    return prisma.feedback.count({
      where: filter,
    });
  }

  async findUserFeedbackForRoom(
    userId: string,
    roomId: string,
  ): Promise<Feedback | null> {
    return prisma.feedback.findFirst({
      where: {
        userId,
        roomId,
      },
    });
  }
}
