import { IBookingRequestRepository } from '../interface/bookingRequest.repository.interface';
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} from '../core/error.response';
import { IRoomRepository } from '../interface/room.repository.interface';
import { IBookingRepository } from '../interface/booking.repository.interface';

export default class BookingRequestService {
  constructor(
    private bookingRequestRepo: IBookingRequestRepository,
    private roomRepo: IRoomRepository,
    private bookingRepo: IBookingRepository,
  ) {}

  async createBookingRequest(data: {
    userId: string;
    roomId: string;
    startTime: string;
    endTime: string;
    purpose?: string;
  }) {
    const {
      userId,
      roomId,
      startTime: startTimeStr,
      endTime: endTimeStr,
      purpose,
    } = data;

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
      throw new BadRequestError('roomId is required');
    }
    if (!startTimeStr) {
      throw new BadRequestError('startTime is required');
    }
    if (!endTimeStr) {
      throw new BadRequestError('endTime is required');
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime())) {
      throw new BadRequestError(
        'startTime must be a valid ISO 8601 date string',
      );
    }
    if (isNaN(endTime.getTime())) {
      throw new BadRequestError('endTime must be a valid ISO 8601 date string');
    }
    if (startTime >= endTime) {
      throw new BadRequestError('endTime must be greater than startTime');
    }
    if (startTime < new Date()) {
      throw new BadRequestError('Cannot book a room in the past');
    }

    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new NotFoundError(`Room with id not found`);
    }
    if (!room.isAvailable) {
      throw new BadRequestError(
        `Room '${room.name}' is currently not available for booking`,
      );
    }

    const overlappingBookings =
      await this.bookingRepo.findOverlappingApprovedBookings({
        roomId,
        startTime,
        endTime,
      });

    if (overlappingBookings.length > 0) {
      const conflict = overlappingBookings[0];
      throw new ConflictRequestError(
        `Room is already booked from ${conflict.startTime.toISOString()} to ${conflict.endTime.toISOString()}`,
      );
    }

    const overlappingPendingRequests =
      await this.bookingRequestRepo.findOverlappingPendingRequests({
        roomId,
        userId,
        startTime,
        endTime,
      });

    if (overlappingPendingRequests.length > 0) {
      throw new ConflictRequestError(
        'You already have a pending booking request for this room during the selected time slot',
      );
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

  async getBookingRequestById(id: string) {
    const bookingRequest = await this.bookingRequestRepo.findById(id);
    if (!bookingRequest) {
      throw new NotFoundError(`Booking request with id not found`);
    }
    return bookingRequest;
  }
}
