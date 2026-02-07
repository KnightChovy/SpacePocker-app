"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRequestController = void 0;
const bookingRequest_repository_1 = require("../repository/bookingRequest.repository");
const bookingRequest_service_1 = __importDefault(require("../services/bookingRequest.service"));
const bookingRequest_controller_1 = __importDefault(require("../controllers/bookingRequest.controller"));
const bookingRequestRepo = new bookingRequest_repository_1.BookingRequestRepository();
const bookingRequestService = new bookingRequest_service_1.default(bookingRequestRepo);
exports.bookingRequestController = new bookingRequest_controller_1.default(bookingRequestService);
