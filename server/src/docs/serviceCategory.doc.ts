/**
 * @openapi
 * tags:
 *   - name: ServiceCategory
 *     description: Service category management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateServiceCategoryInput:
 *       type: object
 *       required:
 *         - name
 *         - managerId
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the service category
 *           example: "Catering Services"
 *         description:
 *           type: string
 *           description: Description of the service category
 *           example: "Food and beverage services"
 *         managerId:
 *           type: string
 *           format: uuid
 *           description: ID of the manager who owns this category
 *
 *     UpdateServiceCategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *
 *     ServiceCategoryResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         managerId:
 *           type: string
 *           format: uuid
 *         manager:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         services:
 *           type: array
 *           items:
 *             type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     AddRoomServiceCategoryInput:
 *       type: object
 *       required:
 *         - roomId
 *         - categoryId
 *       properties:
 *         roomId:
 *           type: string
 *           format: uuid
 *         categoryId:
 *           type: string
 *           format: uuid
 */

/**
 * @openapi
 * /v1/api/service-categories:
 *   get:
 *     tags:
 *       - ServiceCategory
 *     summary: Get all service categories (Public)
 *     description: Public endpoint to retrieve all service categories with their services
 *     responses:
 *       200:
 *         description: Service categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 metadata:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceCategoryResponse'
 *
 *   post:
 *     tags:
 *       - ServiceCategory
 *     summary: Create service category (Manager/Admin)
 *     description: Create a new service category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceCategoryInput'
 *     responses:
 *       201:
 *         description: Service category created successfully
 *       400:
 *         description: Invalid input (missing name or managerId)
 *       409:
 *         description: Service category with this name already exists
 */

/**
 * @openapi
 * /v1/api/service-categories/{id}:
 *   get:
 *     tags:
 *       - ServiceCategory
 *     summary: Get service category by ID (Public)
 *     description: Public endpoint to retrieve a specific service category with its services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 metadata:
 *                   $ref: '#/components/schemas/ServiceCategoryResponse'
 *       404:
 *         description: Service category not found
 *
 *   put:
 *     tags:
 *       - ServiceCategory
 *     summary: Update service category (Manager/Admin)
 *     description: Update an existing service category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceCategoryInput'
 *     responses:
 *       200:
 *         description: Service category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Service category not found
 *       409:
 *         description: Service category with this name already exists
 *
 *   delete:
 *     tags:
 *       - ServiceCategory
 *     summary: Delete service category (Manager/Admin)
 *     description: Delete a service category (will also delete all services in this category)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service category deleted successfully
 *       404:
 *         description: Service category not found
 */

/**
 * @openapi
 * /v1/api/room-service-categories:
 *   post:
 *     tags:
 *       - ServiceCategory
 *     summary: Add service category to room (Manager/Admin)
 *     description: Assign a service category to a room
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddRoomServiceCategoryInput'
 *     responses:
 *       201:
 *         description: Service category added to room successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Room or service category not found
 *       409:
 *         description: Service category is already assigned to this room
 */

/**
 * @openapi
 * /v1/api/room-service-categories/{roomId}/{categoryId}:
 *   delete:
 *     tags:
 *       - ServiceCategory
 *     summary: Remove service category from room (Manager/Admin)
 *     description: Remove a service category assignment from a room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service category removed from room successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Service category is not assigned to this room
 */
