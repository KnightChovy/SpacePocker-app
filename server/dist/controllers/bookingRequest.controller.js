"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
class BookingRequestController {
    constructor(bookingRequestService) {
        this.bookingRequestService = bookingRequestService;
        this.createBookingRequest = async (req, res, next) => {
            new success_response_1.Created({
                message: 'Booking request created successfully',
                metadata: await this.bookingRequestService.createBookingRequest({
                    userId: req.user?.userId,
                    ...req.body,
                }),
            }).send(res);
        };
        this.getBookingRequestById = async (req, res, next) => {
            new success_response_1.OK({
                message: ' Get booking request successfully',
                metadata: await this.bookingRequestService.getBookingRequestById(String(req.params.id)),
            }).send(res);
        };
    }
}
exports.default = BookingRequestController;
