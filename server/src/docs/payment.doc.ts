/**
 * @openapi
 * tags:
 *   - name: Payment
 *     description: VNPAY payment and booking confirmation email APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreatePaymentUrlInput:
 *       type: object
 *       properties:
 *         locale:
 *           type: string
 *           enum: [vn, en]
 *           default: vn
 *           description: VNPAY payment page locale
 *
 *     CreatePaymentUrlResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Create VNPAY payment URL successfully"
 *         reason:
 *           type: string
 *           example: "Success"
 *         metadata:
 *           type: object
 *           properties:
 *             paymentUrl:
 *               type: string
 *               description: Full VNPAY payment URL to redirect user
 *               example: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=..."
 *             txnRef:
 *               type: string
 *               description: Transaction reference (format br_{bookingRequestId}_{timestamp})
 *               example: "br_65be0de6-225d-4d37-8c9a-21860e931a87_1710000000000"
 *             amount:
 *               type: number
 *               description: Amount in VND (room price × hours)
 *               example: 30000
 *             bookingRequestId:
 *               type: string
 *               format: uuid
 *               example: "65be0de6-225d-4d37-8c9a-21860e931a87"
 *             roomName:
 *               type: string
 *               example: "Meeting Room 101"
 *
 *     VnpayIpnSuccessResponse:
 *       type: object
 *       properties:
 *         RspCode:
 *           type: string
 *           example: "00"
 *         Message:
 *           type: string
 *           example: "Confirm Success"
 *
 *     VnpayIpnErrorResponse:
 *       type: object
 *       properties:
 *         RspCode:
 *           type: string
 *           example: "97"
 *           description: "Code 97 means invalid checksum, code 24 means user cancel, and code 99 means unknown error"
 *         Message:
 *           type: string
 *           example: "Invalid checksum"
 */

/**
 * @openapi
 * /v1/api/booking-requests/{id}/payment-url:
 *   post:
 *     summary: Create VNPAY payment URL for approved booking request
 *     description: |
 *       Generates a VNPAY payment URL for an **APPROVED** booking request.
 *       User must redirect to this URL to complete payment.
 *
 *       **Flow:**
 *       1. Manager approves booking request (status = APPROVED)
 *       2. User calls this API to get payment URL
 *       3. User redirects to paymentUrl
 *       4. After payment, VNPAY redirects to `/payment/vnpay-return` and calls `/payment/vnpay-ipn`
 *       5. On success, a Booking is created and a confirmation email is queued (RabbitMQ)
 *
 *       **Validation:**
 *       - Booking request must exist and belong to the authenticated user
 *       - Status must be APPROVED
 *       - No existing Booking for this request (idempotent)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (UUID)
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreatePaymentUrlInput"
 *     responses:
 *       200:
 *         description: Payment URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreatePaymentUrlResponse"
 *       400:
 *         description: Bad request - Booking request must be approved before payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not allowed to pay this booking request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Booking request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       409:
 *         description: Conflict - Booking request has already been paid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/payment/vnpay-return:
 *   get:
 *     summary: VNPAY return URL (browser redirect)
 *     description: |
 *       VNPAY redirects the user's browser to this URL after payment.
 *       Server verifies checksum, processes payment, and redirects to client.
 *
 *       **Query params (from VNPAY):**
 *       - vnp_TxnRef, vnp_ResponseCode, vnp_TransactionStatus, vnp_SecureHash, etc.
 *
 *       **Redirect:**
 *       - Success: `{CLIENT_URL}/user/bookings?paymentStatus=success&bookingRequestId=...`
 *       - Failed: `{CLIENT_URL}/user/bookings?paymentStatus=failed&bookingRequestId=...`
 *
 *       **Internal flow:**
 *       - Verify vnp_SecureHash (HMAC SHA512)
 *       - If success: create Booking, publish mail job to RabbitMQ
 *       - Mail worker consumes queue and sends confirmation email
 *     tags: [Payment]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Transaction reference (br_{bookingRequestId}_{timestamp})
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: "Code 00 means success"
 *       - in: query
 *         name: vnp_TransactionStatus
 *         schema:
 *           type: string
 *         description: "Code 00 means success"
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *         description: HMAC SHA512 checksum
 *     responses:
 *       302:
 *         description: Redirect to client with paymentStatus=success or failed
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/payment/vnpay-ipn:
 *   get:
 *     summary: VNPAY IPN (server-to-server callback)
 *     description: |
 *       VNPAY calls this URL server-to-server to confirm payment.
 *       Same processing as vnpay-return but returns JSON instead of redirect.
 *
 *       **Response format (VNPAY spec):**
 *       - Success: `{ RspCode: "00", Message: "Confirm Success" }`
 *       - Failed: `{ RspCode: "97"|"24"|"99", Message: "..." }`
 *
 *       **Mail flow:**
 *       - On success, job is published to RabbitMQ queue `booking.confirmed.mail.queue`
 *       - Mail worker (`npm run worker:mail`) consumes and sends email via nodemailer
 *       - Email contains bookingId, roomName, startTime, endTime
 *     tags: [Payment]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_TransactionStatus
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: IPN processed
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: "#/components/schemas/VnpayIpnSuccessResponse"
 *                 - $ref: "#/components/schemas/VnpayIpnErrorResponse"
 *             examples:
 *               success:
 *                 value:
 *                   RspCode: "00"
 *                   Message: "Confirm Success"
 *               invalidChecksum:
 *                 value:
 *                   RspCode: "97"
 *                   Message: "Invalid checksum"
 *               paymentFailed:
 *                 value:
 *                   RspCode: "24"
 *                   Message: "Payment failed"
 */
