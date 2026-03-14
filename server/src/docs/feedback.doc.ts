/**
 * @openapi
 * tags:
 *   - name: Feedback
 *     description: Feedback APIs - Users can leave feedback for rooms
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateFeedbackInput:
 *       type: object
 *       required:
 *         - roomId
 *         - rating
 *       properties:
 *         roomId:
 *           type: string
 *           format: uuid
 *           description: ID of the room
 *           example: "r-003"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *           example: 5
 *         comment:
 *           type: string
 *           description: Optional feedback comment
 *           example: "Great room with excellent facilities!"
 *
 *     FeedbackResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         roomId:
 *           type: string
 *           format: uuid
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         room:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             roomCode:
 *               type: string
 */

/**
 * @openapi
 * /v1/api/feedback:
 *   post:
 *     tags:
 *       - Feedback
 *     summary: Create feedback for a room
 *     description: Allows users to create feedback for a room they have booked
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFeedbackInput'
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Feedback created successfully"
 *                 metadata:
 *                   $ref: '#/components/schemas/FeedbackResponse'
 *       400:
 *         description: Bad request - Invalid rating or user already left feedback
 *       403:
 *         description: Forbidden - User hasn't booked this room
 *       404:
 *         description: Room not found
 */

/**
 * @openapi
 * /v1/api/feedback:
 *   get:
 *     tags:
 *       - Feedback
 *     summary: Get feedbacks (Public)
 *     description: Public endpoint to view all feedbacks with optional filtering
 *     parameters:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by room ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Feedbacks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get feedbacks successfully"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     feedbacks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FeedbackResponse'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 */
