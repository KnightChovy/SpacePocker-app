/**
 * @openapi
 * tags:
 *   - name: Building
 *     description: Building management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Building:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123-def456"
 *         buildingName:
 *           type: string
 *           example: "Building A"
 *         address:
 *           type: string
 *           example: "123 Main Street"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Modern office building"
 *         campus:
 *           type: string
 *           example: "Main Campus"
 *         managerId:
 *           type: string
 *           example: "mgr-123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     BuildingPagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 50
 *         limit:
 *           type: integer
 *           example: 10
 *         offset:
 *           type: integer
 *           example: 0
 *         hasMore:
 *           type: boolean
 *           example: true
 *
 *     BuildingFilters:
 *       type: object
 *       properties:
 *         search:
 *           type: string
 *           nullable: true
 *           example: "Building A"
 *         campus:
 *           type: string
 *           nullable: true
 *           example: "Main Campus"
 *         sortBy:
 *           type: string
 *           nullable: true
 *           example: "buildingName"
 *         sortOrder:
 *           type: string
 *           nullable: true
 *           example: "asc"
 *
 *     BuildingListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Get all buildings successfully!"
 *         metadata:
 *           type: object
 *           properties:
 *             buildings:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Building"
 *             pagination:
 *               $ref: "#/components/schemas/BuildingPagination"
 *             filters:
 *               $ref: "#/components/schemas/BuildingFilters"
 *
 *     BuildingResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Building retrieved successfully!"
 *         metadata:
 *           type: object
 *           properties:
 *             building:
 *               $ref: "#/components/schemas/Building"
 */

/**
 * @openapi
 * /v1/api/buildings:
 *   get:
 *     summary: Get all buildings with pagination, search, and filters
 *     tags: [Building]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by building name (case-insensitive)
 *         example: "Building A"
 *       - in: query
 *         name: campus
 *         schema:
 *           type: string
 *         description: Filter by campus
 *         example: "Main Campus"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [buildingName, campus, createdAt]
 *         description: Field to sort by
 *         example: "buildingName"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *         example: "asc"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of items to skip
 *         example: 0
 *     responses:
 *       200:
 *         description: Buildings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BuildingListResponse"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/building:
 *   post:
 *     summary: Create a new building
 *     tags: [Building]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buildingName
 *               - address
 *               - campus
 *               - managerId
 *             properties:
 *               buildingName:
 *                 type: string
 *                 example: "Building A"
 *               address:
 *                 type: string
 *                 example: "123 Main Street"
 *               description:
 *                 type: string
 *                 example: "Modern office building"
 *               campus:
 *                 type: string
 *                 example: "Main Campus"
 *               managerId:
 *                 type: string
 *                 example: "mgr-123"
 *     responses:
 *       201:
 *         description: Building created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Building created successfully!"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     createBuilding:
 *                       $ref: "#/components/schemas/Building"
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name and address are required"
 */

/**
 * @openapi
 * /v1/api/building/{id}:
 *   get:
 *     summary: Get building by ID
 *     tags: [Building]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *         example: "abc123-def456"
 *     responses:
 *       200:
 *         description: Building retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BuildingResponse"
 *       400:
 *         description: Building ID is required
 *       404:
 *         description: Building not found
 */

/**
 * @openapi
 * /v1/api/building/{id}:
 *   put:
 *     summary: Update building
 *     tags: [Building]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *         example: "abc123-def456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Building A Updated"
 *               address:
 *                 type: string
 *                 example: "456 New Street"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               campus:
 *                 type: string
 *                 example: "North Campus"
 *               managerId:
 *                 type: string
 *                 example: "mgr-456"
 *     responses:
 *       200:
 *         description: Building updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update building successfully!"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     updateBuilding:
 *                       $ref: "#/components/schemas/Building"
 *       400:
 *         description: Building ID is required
 *       404:
 *         description: Building not found
 */

/**
 * @openapi
 * /v1/api/building/{id}:
 *   delete:
 *     summary: Delete building
 *     tags: [Building]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *         example: "abc123-def456"
 *     responses:
 *       200:
 *         description: Building deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Building deleted successfully"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Building delete successfully!"
 *       400:
 *         description: Building ID is required
 *       404:
 *         description: Building not found
 */
