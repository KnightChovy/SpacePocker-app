"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingRequest_container_1 = require("../../container/bookingRequest.container");
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const router = express_1.default.Router();
router.use(authUtils_1.authentication);
router.post('/booking-requests', (0, asyncHandler_1.asyncHandler)(bookingRequest_container_1.bookingRequestController.createBookingRequest));
router.get('/booking-requests/:id', (0, asyncHandler_1.asyncHandler)(bookingRequest_container_1.bookingRequestController.getBookingRequestById));
exports.default = router;
