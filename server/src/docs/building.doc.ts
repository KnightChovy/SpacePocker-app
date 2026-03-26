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
 *         campus:
 *           type: string
 *           example: "Main Campus"
 *         latitude:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: 10.7756587
 *           description: "Latitude coordinate (between -90 and 90)"
 *         longitude:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: 106.7018649
 *           description: "Longitude coordinate (between -180 and 180)"
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
 *     CreateBuildingInput:
 *       type: object
 *       required:
 *         - buildingName
 *         - address
 *         - campus
 *         - managerId
 *       properties:
 *         buildingName:
 *           type: string
 *           example: "Building A"
 *         address:
 *           type: string
 *           example: "123 Main Street"
 *         campus:
 *           type: string
 *           example: "Main Campus"
 *         managerId:
 *           type: string
 *           example: "mgr-123"
 *         latitude:
 *           type: number
 *           format: double
 *           example: 10.7756587
 *           description: "Latitude coordinate (between -90 and 90)"
 *         longitude:
 *           type: number
 *           format: double
 *           example: 106.7018649
 *           description: "Longitude coordinate (between -180 and 180)"
 *
 *     UpdateBuildingInput:
 *       type: object
 *       properties:
 *         buildingName:
 *           type: string
 *           example: "Building A Updated"
 *         address:
 *           type: string
 *           example: "456 New Street"
 *         campus:
 *           type: string
 *           example: "North Campus"
 *         managerId:
 *           type: string
 *           example: "mgr-456"
 *         latitude:
 *           type: number
 *           format: double
 *           example: 10.7756587
 *           description: "Latitude coordinate (between -90 and 90)"
 *         longitude:
 *           type: number
 *           format: double
 *           example: 106.7018649
 *           description: "Longitude coordinate (between -180 and 180)"
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
 *           example: "Get all buildings successfully"
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
 *           example: "Building created successfully"
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
 *     description: Retrieve a list of all buildings with filtering and pagination options.
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
 * /v1/api/buildings/{id}:
 *   get:
 *     summary: Get building by ID
 *     description: Retrieve detailed information about a specific building.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Building not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/buildings:
 *   post:
 *     summary: Create a new building
 *     description: |
 *       Create a new building. Requires authentication with **MANAGER** or **ADMIN** role.
 *
 *       **Validation rules:**
 *       - Building name, address, campus, and managerId are required
 *       - Latitude must be between -90 and 90
 *       - Longitude must be between -180 and 180
 *     tags: [Building]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBuildingInput"
 *     responses:
 *       201:
 *         description: Building created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BuildingResponse"
 *       400:
 *         description: Bad request - Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       403:
 *         description: Forbidden - Requires MANAGER or ADMIN role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/buildings/{id}:
 *   patch:
 *     summary: Update building information
 *     description: |
 *       Update an existing building's information. Requires authentication with **MANAGER** or **ADMIN** role.
 *
 *       **Validation rules:**
 *       - Building must exist
 *       - If provided, building name cannot be empty
 *       - If provided, address cannot be empty
 *       - If provided, campus cannot be empty
 *       - If provided, latitude must be between -90 and 90
 *       - If provided, longitude must be between -180 and 180
 *     tags: [Building]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *         example: "abc123-def456"
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateBuildingInput"
 *     responses:
 *       200:
 *         description: Building updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BuildingResponse"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       403:
 *         description: Forbidden - Requires MANAGER or ADMIN role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Building not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/buildings/{id}:
 *   delete:
 *     summary: Delete a building
 *     description: |
 *       Delete an existing building. Requires authentication with **MANAGER** or **ADMIN** role.
 *
 *       **Note:** This will cascade delete related records (rooms, amenities, bookings).
 *     tags: [Building]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Building ID
 *         example: "abc123-def456"
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
 *     responses:
 *       200:
 *         description: Building deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BuildingResponse"
 *       400:
 *         description: Building ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized - Invalid or expired token
 *       403:
 *         description: Forbidden - Requires MANAGER or ADMIN role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Building not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */
