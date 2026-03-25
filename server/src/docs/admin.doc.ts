/**
 * @openapi
 * tags:
 *   - name: Admin
 *     description: Admin APIs
 */

/**
 * @openapi
 * /v1/api/admin/users/promote-manager/{userId}:
 *   patch:
 *     summary: Promote a user to manager
 *     description: |
 *       Admin endpoint to promote an existing user to manager.
 *
 *       Rules:
 *       - Only ADMIN can access this endpoint
 *       - User must exist
 *       - User must not already be MANAGER
 *       - Update User.role to MANAGER
 *       - Create Manager record if it does not exist
 *       - Prevent duplicate Manager record creation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-client-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *       - in: header
 *         name: authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to promote
 *     responses:
 *       200:
 *         description: Promotion succeeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User promoted to manager successfully
 *                 reason:
 *                   type: string
 *                   example: Success
 *                 metadata:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Invalid input or user already manager
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only ADMIN can access
 *       404:
 *         description: User not found
 */

export {};
