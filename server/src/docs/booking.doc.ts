/**
 * @openapi
 * tags:
 *   - name: Booking
 *     description: Booking management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     BookingEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: booking-uuid-123
 *         userId:
 *           type: string
 *           example: user-uuid-001
 *         roomId:
 *           type: string
 *           example: room-uuid-001
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2026-04-01T08:00:00.000Z
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: 2026-04-01T10:00:00.000Z
 *         purpose:
 *           type: string
 *           nullable: true
 *           example: Team weekly sync
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED]
 *           example: APPROVED
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-03-16T08:10:00.000Z
 *
 *     BookingUpdateRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: user-uuid-002
 *         roomId:
 *           type: string
 *           example: room-uuid-002
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: 2026-04-02T08:00:00.000Z
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: 2026-04-02T10:00:00.000Z
 *         purpose:
 *           type: string
 *           example: Updated purpose
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED]
 *           example: APPROVED
 *
 *     BookingMutationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Booking updated successfully
 *         reason:
 *           type: string
 *           example: Success
 *         metadata:
 *           type: object
 *           properties:
 *             booking:
 *               $ref: "#/components/schemas/BookingEntity"
 *
 *     RefundCancelRequest:
 *       type: object
 *       properties:
 *         reason:
 *           type: string
 *           description: Reason from manager for cancelling a paid booking
 *           example: Projector issue, room cannot be used as planned
 *
 *     RefundCancelResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Booking cancelled and refund email queued successfully
 *         reason:
 *           type: string
 *           example: Success
 *         metadata:
 *           type: object
 *           properties:
 *             booking:
 *               $ref: "#/components/schemas/BookingEntity"
 *             refund:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   example: 30000
 *                 reason:
 *                   type: string
 *                   nullable: true
 *                   example: Room issue
 *                 status:
 *                   type: string
 *                   example: SUCCESS
 *
 *     BookingListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Get all bookings successfully
 *         reason:
 *           type: string
 *           example: Success
 *         metadata:
 *           type: object
 *           properties:
 *             bookings:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/BookingEntity"
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 offset:
 *                   type: integer
 *                   example: 0
 *                 hasMore:
 *                   type: boolean
 *                   example: true
 *             filters:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   nullable: true
 *                 roomId:
 *                   type: string
 *                   nullable: true
 *                 status:
 *                   type: string
 *                   nullable: true
 *
 *     BookingErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Booking not found
 *         status:
 *           type: integer
 *           example: 404
 */

/**
 * @openapi
 * /v1/api/bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Manager/Admin endpoint. Supports pagination using limit and offset
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Get all bookings successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingListResponse"
 *       400:
 *         description: Invalid query params
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingErrorResponse"
 *       403:
 *         description: Forbidden - Only MANAGER/ADMIN can access
 */

/**
 * @openapi
 * /v1/api/myBookings:
 *   get:
 *     summary: Get my bookings
 *     description: Get all bookings of the currently authenticated user
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get my bookings successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingListResponse"
 */

/**
 * @openapi
 * /v1/api/updateBookings/{id}:
 *   patch:
 *     summary: Update booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BookingUpdateRequest"
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingMutationResponse"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingErrorResponse"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingErrorResponse"
 *       409:
 *         description: Time slot conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingErrorResponse"
 */

/**
 * @openapi
 * /v1/api/cancelBookings/{id}:
 *   patch:
 *     summary: Cancel booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingMutationResponse"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingErrorResponse"
 */

/**
 * @openapi
 * /v1/api/manager/bookings/{id}/refund-cancel:
 *   patch:
 *     summary: Manager cancels paid booking and sends refund success email
 *     description: |
 *       For cases where user has already paid but manager needs to cancel due to issue.
 *       This API will:
 *       1. Change Booking status from COMPLETED to CANCELLED
 *       2. Update matched BookingRequest status (if found) from COMPLETED to CANCELLED
 *       3. Queue an email to user confirming refund success
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID (paid booking)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RefundCancelRequest"
 *     responses:
 *       200:
 *         description: Booking cancelled and refund mail queued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RefundCancelResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only MANAGER/ADMIN can call this endpoint
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingErrorResponse"
 *       409:
 *         description: Booking already cancelled or not eligible for refund-cancel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingErrorResponse"
 */

export {};
