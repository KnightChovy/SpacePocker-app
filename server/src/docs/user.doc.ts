/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *           enum: [USER, MANAGER, ADMIN]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /v1/api/users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile
 *     description: Get the profile of the logged-in user
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
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get user profile successfully"
 *                 metadata:
 *                   $ref: '#/components/schemas/UserProfileResponse'
 *       404:
 *         description: User not found
 */

/**
 * @openapi
 * /v1/api/users:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (Admin/Manager)
 *     description: Admin and Manager can retrieve list of users with pagination and search
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, MANAGER, ADMIN]
 *         description: Filter by role
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
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get users successfully"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserProfileResponse'
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
