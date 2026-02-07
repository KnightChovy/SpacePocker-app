"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../core/error.response");
class BookingRequestService {
    constructor(bookingRequestRepo) {
        this.bookingRequestRepo = bookingRequestRepo;
    }
    async createBookingRequest(data) {
        const { userId, roomId, startTime: startTimeStr, endTime: endTimeStr, purpose, } = data;
        if (!userId) {
            throw new error_response_1.BadRequestError('User ID is required');
        }
        if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
            throw new error_response_1.BadRequestError('roomId is required');
        }
        if (!startTimeStr) {
            throw new error_response_1.BadRequestError('startTime is required');
        }
        if (!endTimeStr) {
            throw new error_response_1.BadRequestError('endTime is required');
        }
        const startTime = new Date(startTimeStr);
        const endTime = new Date(endTimeStr);
        if (isNaN(startTime.getTime())) {
            throw new error_response_1.BadRequestError('startTime must be a valid ISO 8601 date string');
        }
        if (isNaN(endTime.getTime())) {
            throw new error_response_1.BadRequestError('endTime must be a valid ISO 8601 date string');
        }
        if (startTime >= endTime) {
            throw new error_response_1.BadRequestError('endTime must be greater than startTime');
        }
        if (startTime < new Date()) {
            throw new error_response_1.BadRequestError('Cannot book a room in the past');
        }
        const room = await this.bookingRequestRepo.findRoomById(roomId);
        if (!room) {
            throw new error_response_1.NotFoundError(`Room with id '${roomId}' not found`);
        }
        if (!room.isAvailable) {
            throw new error_response_1.BadRequestError(`Room '${room.name}' is currently not available for booking`);
        }
        const overlappingBookings = await this.bookingRequestRepo.findOverlappingApprovedBookings({
            roomId,
            startTime,
            endTime,
        });
        if (overlappingBookings.length > 0) {
            const conflict = overlappingBookings[0];
            throw new error_response_1.ConflictRequestError(`Room is already booked from ${conflict.startTime.toISOString()} to ${conflict.endTime.toISOString()}`);
        }
        const overlappingPendingRequests = await this.bookingRequestRepo.findOverlappingPendingRequests({
            roomId,
            userId,
            startTime,
            endTime,
        });
        if (overlappingPendingRequests.length > 0) {
            throw new error_response_1.ConflictRequestError('You already have a pending booking request for this room during the selected time slot');
        }
        const bookingRequest = await this.bookingRequestRepo.create({
            userId,
            roomId,
            startTime,
            endTime,
            purpose,
        });
        return bookingRequest;
    }
    async getBookingRequestById(id) {
        const bookingRequest = await this.bookingRequestRepo.findById(id);
        if (!bookingRequest) {
            throw new error_response_1.NotFoundError(`Booking request with id '${id}' not found`);
        }
        return bookingRequest;
    }
}
exports.default = BookingRequestService;
