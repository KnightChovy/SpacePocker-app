/**
 * @openapi
 * tags:
 *   - name: Transactions
 *     description: Transaction history and financial reporting APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     TransactionItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "txn-001"
 *         bookingId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "bk-001"
 *         bookingRequestId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "br-001"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "u-001"
 *         amount:
 *           type: number
 *           description: Amount in VND
 *           example: 100000
 *         paymentMethod:
 *           type: string
 *           enum: [VNPAY, CASH, BANK_TRANSFER]
 *           example: "VNPAY"
 *         status:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED, REFUNDED]
 *           example: "SUCCESS"
 *         txnRef:
 *           type: string
 *           nullable: true
 *           description: VNPAY transaction reference (only for VNPAY payments)
 *           example: "br_65be0de6_1710000000000"
 *         note:
 *           type: string
 *           nullable: true
 *           example: "Cash received — receipt #VN2026-00123"
 *         paidAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2026-03-26T08:00:00.000Z"
 *         confirmedBy:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Manager ID who confirmed offline payment
 *           example: "m-001"
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "u-001"
 *             name:
 *               type: string
 *               example: "Nguyen Van A"
 *             email:
 *               type: string
 *               example: "user@example.com"
 *         booking:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               example: "bk-001"
 *             room:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "r-001"
 *                 name:
 *                   type: string
 *                   example: "Meeting Room A"
 *                 building:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "b-001"
 *                     buildingName:
 *                       type: string
 *                       example: "Building A"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-03-26T08:00:00.000Z"
 *
 *     TransactionListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Get transactions successfully"
 *         metadata:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TransactionItem"
 *             total:
 *               type: integer
 *               description: Total records matching the filter
 *               example: 42
 *
 *     RevenueReportResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Revenue report generated successfully"
 *         metadata:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date-time
 *               example: "2026-03-01T00:00:00.000Z"
 *             endDate:
 *               type: string
 *               format: date-time
 *               example: "2026-03-31T23:59:59.000Z"
 *             groupBy:
 *               type: string
 *               enum: [day, month, room, building, paymentMethod]
 *               example: "day"
 *             totalRevenue:
 *               type: number
 *               description: Total revenue (VND) for successful transactions in the date range
 *               example: 5000000
 *             paymentMethodBreakdown:
 *               type: array
 *               description: Revenue split by payment method
 *               items:
 *                 type: object
 *                 properties:
 *                   paymentMethod:
 *                     type: string
 *                     enum: [VNPAY, CASH, BANK_TRANSFER]
 *                     example: "VNPAY"
 *                   totalAmount:
 *                     type: number
 *                     example: 3000000
 *                   count:
 *                     type: integer
 *                     example: 10
 *             data:
 *               type: array
 *               description: Revenue grouped by the selected dimension
 *               items:
 *                 type: object
 *                 description: |
 *                   Shape depends on `groupBy`:
 *                   - **day / month**: `{ period, totalAmount, count }`
 *                   - **room / building**: `{ id, label, totalAmount, count }`
 *                   - **paymentMethod**: `{ paymentMethod, totalAmount, count }`
 *               example:
 *                 - period: "2026-03-01"
 *                   totalAmount: 200000
 *                   count: 2
 *                 - period: "2026-03-02"
 *                   totalAmount: 350000
 *                   count: 3
 *
 *     BookingReportResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Booking report generated successfully"
 *         metadata:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date-time
 *               example: "2026-03-01T00:00:00.000Z"
 *             endDate:
 *               type: string
 *               format: date-time
 *               example: "2026-03-31T23:59:59.000Z"
 *             totalRequests:
 *               type: integer
 *               description: Total booking requests in the date range
 *               example: 50
 *             byStatus:
 *               type: object
 *               description: Count of requests per status
 *               properties:
 *                 PENDING:
 *                   type: integer
 *                   example: 5
 *                 APPROVED:
 *                   type: integer
 *                   example: 8
 *                 REJECTED:
 *                   type: integer
 *                   example: 2
 *                 CANCELLED:
 *                   type: integer
 *                   example: 3
 *                 COMPLETED:
 *                   type: integer
 *                   example: 32
 *             recentCompletedBookings:
 *               type: array
 *               description: Up to 50 most recent completed bookings with transaction info
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "bk-001"
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   room:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   transaction:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       amount:
 *                         type: number
 *                         example: 100000
 *                       paymentMethod:
 *                         type: string
 *                         enum: [VNPAY, CASH, BANK_TRANSFER]
 */

/**
 * @openapi
 * /v1/api/my-transactions:
 *   get:
 *     summary: Get my transaction history
 *     description: |
 *       Returns the authenticated user's payment transaction history, sorted newest first.
 *       Supports filtering by payment method, status, and date range.
 *     tags: [Transactions]
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
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [VNPAY, CASH, BANK_TRANSFER]
 *         description: Filter by payment method
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED, REFUNDED]
 *         description: Filter by transaction status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter transactions created on or after this date
 *         example: "2026-03-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter transactions created on or before this date
 *         example: "2026-03-31T23:59:59Z"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Transaction list returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TransactionListResponse"
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /v1/api/transactions:
 *   get:
 *     summary: Get all transactions (manager / admin)
 *     description: |
 *       Returns all transactions across all users.
 *       Supports filtering by userId, payment method, status, and date range.
 *       Results are sorted newest first with pagination.
 *     tags: [Transactions]
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
 *           format: uuid
 *         description: Filter by user ID
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [VNPAY, CASH, BANK_TRANSFER]
 *         description: Filter by payment method
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, SUCCESS, FAILED, REFUNDED]
 *         description: Filter by transaction status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-03-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-03-31T23:59:59Z"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Transaction list returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TransactionListResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires MANAGER or ADMIN role
 */

/**
 * @openapi
 * /v1/api/transactions/{id}:
 *   get:
 *     summary: Get a single transaction by ID
 *     tags: [Transactions]
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
 *           format: uuid
 *         description: Transaction ID
 *         example: "txn-001"
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get transaction successfully"
 *                 metadata:
 *                   $ref: "#/components/schemas/TransactionItem"
 *       400:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires MANAGER or ADMIN role
 */

/**
 * @openapi
 * /v1/api/reports/revenue:
 *   get:
 *     summary: Revenue report
 *     description: |
 *       Aggregates revenue from **SUCCESS** transactions within a date range.
 *
 *       **groupBy options:**
 *       | Value | Result shape |
 *       |---|---|
 *       | `day` | `{ period: "YYYY-MM-DD", totalAmount, count }` per day |
 *       | `month` | `{ period: "YYYY-MM", totalAmount, count }` per month |
 *       | `room` | `{ id, label: roomName, totalAmount, count }` per room |
 *       | `building` | `{ id, label: buildingName, totalAmount, count }` per building |
 *       | `paymentMethod` | `{ paymentMethod, totalAmount, count }` per method |
 *
 *       **Always included regardless of groupBy:**
 *       - `totalRevenue` — grand total in date range
 *       - `paymentMethodBreakdown` — split by VNPAY / CASH / BANK_TRANSFER
 *
 *       Manager users can optionally pass `managerId` to scope results to their rooms.
 *     tags: [Transactions]
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
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-03-01T00:00:00Z"
 *         description: Start of date range (inclusive)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-03-31T23:59:59Z"
 *         description: End of date range (inclusive)
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, month, room, building, paymentMethod]
 *           default: day
 *         description: Dimension to group revenue by
 *       - in: query
 *         name: managerId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: (Optional) Scope results to rooms managed by this manager
 *         example: "m-001"
 *     responses:
 *       200:
 *         description: Revenue report generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RevenueReportResponse"
 *             examples:
 *               byDay:
 *                 summary: Grouped by day
 *                 value:
 *                   message: "Revenue report generated successfully"
 *                   metadata:
 *                     startDate: "2026-03-01T00:00:00.000Z"
 *                     endDate: "2026-03-31T23:59:59.000Z"
 *                     groupBy: "day"
 *                     totalRevenue: 5000000
 *                     paymentMethodBreakdown:
 *                       - paymentMethod: "VNPAY"
 *                         totalAmount: 3000000
 *                         count: 10
 *                       - paymentMethod: "CASH"
 *                         totalAmount: 1500000
 *                         count: 5
 *                       - paymentMethod: "BANK_TRANSFER"
 *                         totalAmount: 500000
 *                         count: 2
 *                     data:
 *                       - period: "2026-03-10"
 *                         totalAmount: 200000
 *                         count: 2
 *                       - period: "2026-03-15"
 *                         totalAmount: 350000
 *                         count: 3
 *               byRoom:
 *                 summary: Grouped by room
 *                 value:
 *                   message: "Revenue report generated successfully"
 *                   metadata:
 *                     startDate: "2026-03-01T00:00:00.000Z"
 *                     endDate: "2026-03-31T23:59:59.000Z"
 *                     groupBy: "room"
 *                     totalRevenue: 5000000
 *                     paymentMethodBreakdown: []
 *                     data:
 *                       - id: "r-001"
 *                         label: "Meeting Room A"
 *                         totalAmount: 2000000
 *                         count: 8
 *                       - id: "r-002"
 *                         label: "Event Hall B"
 *                         totalAmount: 3000000
 *                         count: 9
 *       400:
 *         description: Invalid date range or groupBy value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires MANAGER or ADMIN role
 */

/**
 * @openapi
 * /v1/api/reports/bookings:
 *   get:
 *     summary: Booking statistics report
 *     description: |
 *       Returns booking request counts grouped by status, plus up to 50 recent completed bookings
 *       with room, user, and transaction details — useful for reconciliation.
 *
 *       Optionally pass `managerId` to scope results to a specific manager's rooms.
 *     tags: [Transactions]
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
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-03-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         example: "2026-03-31T23:59:59Z"
 *       - in: query
 *         name: managerId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: (Optional) Scope to a specific manager's rooms
 *         example: "m-001"
 *     responses:
 *       200:
 *         description: Booking report generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BookingReportResponse"
 *             example:
 *               message: "Booking report generated successfully"
 *               metadata:
 *                 startDate: "2026-03-01T00:00:00.000Z"
 *                 endDate: "2026-03-31T23:59:59.000Z"
 *                 totalRequests: 50
 *                 byStatus:
 *                   PENDING: 5
 *                   APPROVED: 8
 *                   REJECTED: 2
 *                   CANCELLED: 3
 *                   COMPLETED: 32
 *                 recentCompletedBookings:
 *                   - id: "bk-001"
 *                     startTime: "2026-03-10T09:00:00.000Z"
 *                     endTime: "2026-03-10T11:00:00.000Z"
 *                     room:
 *                       id: "r-001"
 *                       name: "Meeting Room A"
 *                     user:
 *                       id: "u-001"
 *                       name: "Nguyen Van A"
 *                       email: "user@example.com"
 *                     transaction:
 *                       amount: 100000
 *                       paymentMethod: "CASH"
 *       400:
 *         description: Invalid date range
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — requires MANAGER or ADMIN role
 */
