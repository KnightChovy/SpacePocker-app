/**
 * @openapi
 * tags:
 *   - name: Check-in
 *     description: Room check-in / check-out management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CheckInRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: checkin-uuid-001
 *         bookingId:
 *           type: string
 *           example: booking-uuid-123
 *         checkedInAt:
 *           type: string
 *           format: date-time
 *           example: 2026-04-01T07:55:00.000Z
 *         checkedOutAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-04-01T10:10:00.000Z
 *         checkedInBy:
 *           type: string
 *           description: userId of the person who performed check-in
 *           example: user-uuid-001
 *         method:
 *           type: string
 *           enum: [QR_CODE, MANUAL, PIN_CODE]
 *           example: MANUAL
 *         note:
 *           type: string
 *           nullable: true
 *           example: Guest arrived with 2 colleagues
 *         overstayMinutes:
 *           type: integer
 *           nullable: true
 *           description: Minutes past the booking endTime at checkout
 *           example: 10
 *         overstayFee:
 *           type: number
 *           nullable: true
 *           description: Extra fee charged for overstay (currency unit same as pricePerHour)
 *           example: 25000
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-04-01T07:55:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-04-01T10:10:00.000Z
 *
 *     CheckInRequest:
 *       type: object
 *       properties:
 *         method:
 *           type: string
 *           enum: [QR_CODE, MANUAL, PIN_CODE]
 *           default: MANUAL
 *           example: MANUAL
 *         note:
 *           type: string
 *           example: Guest arrived on time
 *
 *     CheckOutRequest:
 *       type: object
 *       properties:
 *         note:
 *           type: string
 *           example: Room left in good condition
 *
 *     CheckInResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Check-in successful
 *         reason:
 *           type: string
 *           example: Success
 *         metadata:
 *           type: object
 *           properties:
 *             checkInRecord:
 *               $ref: "#/components/schemas/CheckInRecord"
 *             booking:
 *               $ref: "#/components/schemas/BookingEntity"
 *
 *     CheckOutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Check-out successful
 *         reason:
 *           type: string
 *           example: Success
 *         metadata:
 *           type: object
 *           properties:
 *             checkInRecord:
 *               $ref: "#/components/schemas/CheckInRecord"
 *             booking:
 *               $ref: "#/components/schemas/BookingEntity"
 *             overstay:
 *               type: object
 *               nullable: true
 *               description: Present only when checkout time exceeds booking endTime
 *               properties:
 *                 minutes:
 *                   type: integer
 *                   example: 10
 *                 fee:
 *                   type: number
 *                   example: 25000
 *
 *     CheckInStatusResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Check-in status retrieved successfully
 *         reason:
 *           type: string
 *           example: Success
 *         metadata:
 *           type: object
 *           properties:
 *             booking:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: booking-uuid-123
 *                 status:
 *                   type: string
 *                   enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED, CHECKED_IN]
 *                   example: CHECKED_IN
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-04-01T08:00:00.000Z
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-04-01T10:00:00.000Z
 *                 room:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: room-uuid-001
 *                     name:
 *                       type: string
 *                       example: Meeting Room A
 *             checkInRecord:
 *               nullable: true
 *               allOf:
 *                 - $ref: "#/components/schemas/CheckInRecord"
 *
 *     CheckInErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Cannot check in: booking status is CANCELLED"
 *         status:
 *           type: integer
 *           example: 400
 */

/**
 * @openapi
 * /v1/api/bookings/{id}/check-in:
 *   post:
 *     summary: Check in to a booking
 *     description: |
 *       Confirms actual arrival for an APPROVED booking.
 *       - Check-in is allowed from **15 minutes before** `startTime` up to `endTime`.
 *       - Booking status changes from `APPROVED` → `CHECKED_IN`.
 *       - The booking owner, MANAGER, or ADMIN can perform check-in.
 *     tags: [Check-in]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Authenticated user ID
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer access token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CheckInRequest"
 *     responses:
 *       200:
 *         description: Check-in successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInResponse"
 *       400:
 *         description: |
 *           Bad request — possible reasons:
 *           - Booking is not in APPROVED status
 *           - Current time is before the allowed check-in window
 *           - Booking period has already ended
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not the booking owner, MANAGER, or ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 *       409:
 *         description: Already checked in for this booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 */

/**
 * @openapi
 * /v1/api/bookings/{id}/check-out:
 *   post:
 *     summary: Check out from a booking
 *     description: |
 *       Confirms actual departure for a CHECKED_IN booking.
 *       - Booking status changes from `CHECKED_IN` → `COMPLETED`.
 *       - If checkout time exceeds `endTime`, overstay fee is calculated:
 *         `overstayFee = (overstayMinutes / 60) × pricePerHour`.
 *       - The booking owner, MANAGER, or ADMIN can perform check-out.
 *     tags: [Check-in]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Authenticated user ID
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer access token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CheckOutRequest"
 *     responses:
 *       200:
 *         description: Check-out successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckOutResponse"
 *       400:
 *         description: Booking is not in CHECKED_IN status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not the booking owner, MANAGER, or ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 *       404:
 *         description: Booking or check-in record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 *       409:
 *         description: Already checked out for this booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 */

/**
 * @openapi
 * /v1/api/bookings/{id}/check-in-status:
 *   get:
 *     summary: Get check-in status for a booking
 *     description: |
 *       Returns the current check-in record and booking summary.
 *       `checkInRecord` is `null` if the user has not checked in yet.
 *       The booking owner, MANAGER, or ADMIN can view this.
 *     tags: [Check-in]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Authenticated user ID
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer access token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Check-in status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInStatusResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not the booking owner, MANAGER, or ADMIN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CheckInErrorResponse"
 */

export {};
