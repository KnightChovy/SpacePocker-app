"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRequestRepository = void 0;
const prisma_1 = require("../lib/prisma");
class BookingRequestRepository {
    async create(data) {
        return prisma_1.prisma.bookingRequest.create({
            data: {
                userId: data.userId,
                roomId: data.roomId,
                startTime: data.startTime,
                endTime: data.endTime,
                purpose: data.purpose,
            },
            include: {
                room: {
                    select: {
                        id: true,
                        name: true,
                        roomCode: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return prisma_1.prisma.bookingRequest.findUnique({
            where: { id },
            include: {
                room: true,
                user: true,
            },
        });
    }
    async findRoomById(roomId) {
        return prisma_1.prisma.room.findUnique({
            where: { id: roomId },
        });
    }
    async findOverlappingApprovedBookings(input) {
        return prisma_1.prisma.booking.findMany({
            where: {
                roomId: input.roomId,
                status: 'APPROVED',
                AND: [
                    { startTime: { lt: input.endTime } },
                    { endTime: { gt: input.startTime } },
                ],
            },
        });
    }
    async findOverlappingPendingRequests(input) {
        return prisma_1.prisma.bookingRequest.findMany({
            where: {
                roomId: input.roomId,
                userId: input.userId,
                status: 'PENDING',
                AND: [
                    { startTime: { lt: input.endTime } },
                    { endTime: { gt: input.startTime } },
                ],
            },
        });
    }
}
exports.BookingRequestRepository = BookingRequestRepository;
