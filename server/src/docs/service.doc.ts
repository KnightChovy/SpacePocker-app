/**
 * @openapi
 * tags:
 *   - name: Service
 *     description: Service management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateServiceInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the service
 *           example: "Coffee and Tea"
 *         description:
 *           type: string
 *           description: Description of the service
 *           example: "Coffee, tea, and refreshments"
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the service
 *           example: 50000
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: ID of the service category
 *
 *     UpdateServiceInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         categoryId:
 *           type: string
 *           format: uuid
 *
 *     ServiceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         categoryId:
 *           type: string
 *           format: uuid
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /v1/api/services:
 *   get:
 *     tags:
 *       - Service
 *     summary: Get all services (Public)
 *     description: Public endpoint to retrieve all services with their categories
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                     $ref: '#/components/schemas/ServiceResponse'
 *
 *   post:
 *     tags:
 *       - Service
 *     summary: Create service (Manager/Admin)
 *     description: Create a new service
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceInput'
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Invalid input (missing name, negative price, etc.)
 *       404:
 *         description: Service category not found
 */

/**
 * @openapi
 * /v1/api/services/{id}:
 *   get:
 *     tags:
 *       - Service
 *     summary: Get service by ID (Public)
 *     description: Public endpoint to retrieve a specific service
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 metadata:
 *                   $ref: '#/components/schemas/ServiceResponse'
 *       404:
 *         description: Service not found
 *
 *   put:
 *     tags:
 *       - Service
 *     summary: Update service (Manager/Admin)
 *     description: Update an existing service
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
 *             $ref: '#/components/schemas/UpdateServiceInput'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Service or category not found
 *
 *   delete:
 *     tags:
 *       - Service
 *     summary: Delete service (Manager/Admin)
 *     description: Delete a service
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
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 */

/**
 * @openapi
 * /v1/api/services/category/{categoryId}:
 *   get:
 *     tags:
 *       - Service
 *     summary: Get services by category ID (Public)
 *     description: Public endpoint to retrieve all services in a category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                     $ref: '#/components/schemas/ServiceResponse'
 *       404:
 *         description: Service category not found
 */
