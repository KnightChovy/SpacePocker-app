/**
 * @openapi
 * tags:
 *   - name: Booking Request
 *     description: Booking Request APIs - Manage room booking requests
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateBookingRequestInput:
 *       type: object
 *       required:
 *         - roomId
 *         - startTime
 *         - endTime
 *       properties:
 *         roomId:
 *           type: string
 *           format: uuid
 *           description: ID of the room to be booked
 *           example: "r-003"
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Booking start time (ISO 8601)
 *           example: "2026-02-10T09:00:00Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Booking end time (ISO 8601)
 *           example: "2026-02-10T11:00:00Z"
 *         purpose:
 *           type: string
 *           description: Purpose of the booking (optional)
 *           example: "Team meeting for Q1 planning"
 *
 *     BookingRequestRoom:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "r-003"
 *         name:
 *           type: string
 *           example: "Gamma Hall"
 *         roomCode:
 *           type: string
 *           example: "ROOM-GAMMA"
 *
 *     BookingRequestUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "7e0ce458-85c7-490d-aadc-42579f1177d6"
 *         name:
 *           type: string
 *           example: "hp"
 *         email:
 *           type: string
 *           example: "dhphuc@gmail.com"
 *
 *     BookingRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "65be0de6-225d-4d37-8c9a-21860e931a87"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "7e0ce458-85c7-490d-aadc-42579f1177d6"
 *         roomId:
 *           type: string
 *           example: "r-003"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2026-02-10T09:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2026-02-10T11:00:00.000Z"
 *         purpose:
 *           type: string
 *           nullable: true
 *           example: "Team meeting for Q1 planning"
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED]
 *           example: "PENDING"
 *         approvedBy:
 *           type: string
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-02-07T11:38:43.746Z"
 *         room:
 *           $ref: "#/components/schemas/BookingRequestRoom"
 *         user:
 *           $ref: "#/components/schemas/BookingRequestUser"
 *
 *     BookingRequestResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Booking request created successfully"
 *         reason:
 *           type: string
 *           example: "Created"
 *         metadata:
 *           $ref: "#/components/schemas/BookingRequest"
 *
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "3ff5927a-abd6-4e4c-b7ec-ed2508409ef7"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "7e0ce458-85c7-490d-aadc-42579f1177d6"
 *         roomId:
 *           type: string
 *           format: uuid
 *           example: "r-003"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2026-02-10T09:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2026-02-10T11:00:00.000Z"
 *         purpose:
 *           type: string
 *           nullable: true
 *           example: "Team meeting for Q1 planning"
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED]
 *           example: "APPROVED"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-02-08T09:00:00.000Z"
 *
 *     BookingRequestApproveResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Booking request approved successfully"
 *         reason:
 *           type: string
 *           example: "Success"
 *         metadata:
 *           type: object
 *           properties:
 *             bookingRequest:
 *               $ref: "#/components/schemas/BookingRequest"
 *             booking:
 *               $ref: "#/components/schemas/Booking"
 *
 *     BookingRequestListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Get booking requests successfully"
 *         reason:
 *           type: string
 *           example: "Success"
 *         metadata:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/BookingRequest"
 */

/**
 * @openapi
 * /v1/api/booking-requests:
 *   post:
 *     summary: Create a new booking request
 *     description: |
 *       Allows a user to create a room booking request.
 *       The request will be created with `PENDING` status
 *       until it is approved or rejected by a manager.
 *
 *       **Validation rules:**
 *       - roomId, startTime, and endTime are required
 *       - startTime must be earlier than endTime
 *       - Booking time must not be in the past
 *       - Room must exist and be available
 *
 *       **Conflict detection:**
 *       - Reject if there is an APPROVED booking with overlapping time
 *       - Reject if the user already has a PENDING booking request with overlapping time
 *     tags: [Booking Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (UUID)
 *         example: "7e0ce458-85c7-490d-aadc-42579f1177d6"
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBookingRequestInput"
 *     responses:
 *       201:
 *         description: Booking request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingRequestResponse"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Conflict - Booking time overlaps with another booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/booking-requests/{id}:
 *   get:
 *     summary: Get booking request details by ID
 *     tags: [Booking Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking request ID
 *         example: "65be0de6-225d-4d37-8c9a-21860e931a87"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingRequestResponse"
 *       404:
 *         description: Booking request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/booking-requests:
 *   get:
 *     summary: Get booking requests for manager by status
 *     description: |
 *       Manager endpoint to review booking requests for rooms they manage.
 *       Defaults to `PENDING` if status is not provided.
 *     tags: [Booking Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Manager ID (UUID)
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED]
 *           default: PENDING
 *         description: Filter requests by status
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingRequestListResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only MANAGER/ADMIN can access
 */

/**
 * @openapi
 * /v1/api/booking-requests/approve/{id}:
 *   patch:
 *     summary: Approve booking request and create booking
 *     description: |
 *       Manager approves a pending booking request.
 *
 *       **System rules:**
 *       - Request must be in PENDING status
 *       - Manager can only approve requests for rooms they manage
 *       - Conflict check uses overlap rule:
 *         (startTime < requestedEndTime) AND (endTime > requestedStartTime)
 *       - Earliest pending request has priority for overlapping slot
 *       - On success, creates Booking with status APPROVED
 *     tags: [Booking Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Manager ID (UUID)
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking request ID
 *     responses:
 *       200:
 *         description: Booking request approved and booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingRequestApproveResponse"
 *       400:
 *         description: Bad request (invalid state, room unavailable)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking request or room not found
 *       409:
 *         description: Conflict (already processed, older request priority, or time overlap)
 */

/**
 * @openapi
 * /v1/api/booking-requests/reject/{id}:
 *   patch:
 *     summary: Reject booking request
 *     description: |
 *       Manager rejects a pending booking request for rooms they manage.
 *     tags: [Booking Request]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Manager ID (UUID)
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Booking request ID
 *     responses:
 *       200:
 *         description: Booking request rejected
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingRequestResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking request or room not found
 *       409:
 *         description: Conflict (already processed)
 */
