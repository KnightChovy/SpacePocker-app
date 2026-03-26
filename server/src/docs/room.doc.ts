/**
 * @openapi
 * tags:
 *   - name: Room
 *     description: Room management APIs - Manage rooms in buildings
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     RoomBuilding:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123-def456"
 *         buildingName:
 *           type: string
 *           example: "Building A"
 *         campus:
 *           type: string
 *           example: "Main Campus"
 *
 *     RoomManager:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "mgr-123"
 *         name:
 *           type: string
 *           example: "John Manager"
 *         email:
 *           type: string
 *           example: "manager@example.com"
 *
 *     RoomAmenity:
 *       type: object
 *       properties:
 *         amenity:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "amenity-123"
 *             name:
 *               type: string
 *               example: "Projector"
 *
 *     RoomServiceCategory:
 *       type: object
 *       properties:
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "category-123"
 *             name:
 *               type: string
 *               example: "Food & Beverage"
 *
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "r-001"
 *         buildingId:
 *           type: string
 *           example: "abc123-def456"
 *         managerId:
 *           type: string
 *           example: "mgr-123"
 *         name:
 *           type: string
 *           example: "Conference Room A"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Large conference room with projector"
 *         pricePerHour:
 *           type: number
 *           example: 50.00
 *         securityDeposit:
 *           type: number
 *           nullable: true
 *           example: 100.00
 *         capacity:
 *           type: integer
 *           example: 20
 *         roomType:
 *           type: string
 *           enum: [MEETING, CLASSROOM, EVENT, OTHER]
 *           example: "MEETING"
 *         area:
 *           type: number
 *           nullable: true
 *           example: 50.5
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         roomCode:
 *           type: string
 *           example: "ROOM-A-001"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["url1.jpg", "url2.jpg"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-02-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-02-01T10:00:00.000Z"
 *         building:
 *           $ref: "#/components/schemas/RoomBuilding"
 *         manager:
 *           $ref: "#/components/schemas/RoomManager"
 *         amenities:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/RoomAmenity"
 *         serviceCategories:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/RoomServiceCategory"
 *
 *     CreateRoomInput:
 *       type: object
 *       required:
 *         - buildingId
 *         - managerId
 *         - name
 *         - pricePerHour
 *         - capacity
 *         - roomType
 *         - roomCode
 *       properties:
 *         buildingId:
 *           type: string
 *           format: uuid
 *           description: ID of the building
 *           example: "abc123-def456"
 *         managerId:
 *           type: string
 *           format: uuid
 *           description: ID of the manager
 *           example: "mgr-123"
 *         name:
 *           type: string
 *           description: Room name
 *           example: "Conference Room A"
 *         description:
 *           type: string
 *           description: Room description (optional)
 *           example: "Large conference room with projector"
 *         pricePerHour:
 *           type: number
 *           description: Price per hour
 *           example: 50.00
 *         securityDeposit:
 *           type: number
 *           description: Security deposit (optional)
 *           example: 100.00
 *         capacity:
 *           type: integer
 *           description: Room capacity
 *           example: 20
 *         roomType:
 *           type: string
 *           enum: [MEETING, CLASSROOM, EVENT, OTHER]
 *           description: Type of room
 *           example: "MEETING"
 *         area:
 *           type: number
 *           description: Room area in square meters (optional)
 *           example: 50.5
 *         roomCode:
 *           type: string
 *           description: Unique room code
 *           example: "ROOM-A-001"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *           example: ["url1.jpg", "url2.jpg"]
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of amenity IDs
 *           example: ["amenity-123", "amenity-456"]
 *         serviceCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of service category IDs
 *           example: ["category-123", "category-456"]
 *
 *     UpdateRoomInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Room name
 *           example: "Conference Room A"
 *         description:
 *           type: string
 *           description: Room description
 *           example: "Large conference room with projector"
 *         pricePerHour:
 *           type: number
 *           description: Price per hour
 *           example: 50.00
 *         securityDeposit:
 *           type: number
 *           description: Security deposit
 *           example: 100.00
 *         capacity:
 *           type: integer
 *           description: Room capacity
 *           example: 20
 *         roomType:
 *           type: string
 *           enum: [MEETING, CLASSROOM, EVENT, OTHER]
 *           description: Type of room
 *           example: "MEETING"
 *         area:
 *           type: number
 *           description: Room area in square meters
 *           example: 50.5
 *         isAvailable:
 *           type: boolean
 *           description: Room availability status
 *           example: true
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *           example: ["url1.jpg", "url2.jpg"]
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of amenity IDs
 *           example: ["amenity-123"]
 *         serviceCategories:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of service category IDs
 *           example: ["category-123"]
 *
 *     RoomPagination:
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
 *     RoomFilters:
 *       type: object
 *       properties:
 *         search:
 *           type: string
 *           nullable: true
 *           example: "Conference"
 *         buildingId:
 *           type: string
 *           nullable: true
 *           example: "abc123-def456"
 *         roomType:
 *           type: string
 *           nullable: true
 *           example: "MEETING"
 *         isAvailable:
 *           type: boolean
 *           nullable: true
 *           example: true
 *         minPrice:
 *           type: number
 *           nullable: true
 *           example: 0
 *         maxPrice:
 *           type: number
 *           nullable: true
 *           example: 100
 *         minCapacity:
 *           type: integer
 *           nullable: true
 *           example: 10
 *         sortBy:
 *           type: string
 *           nullable: true
 *           example: "name"
 *         sortOrder:
 *           type: string
 *           nullable: true
 *           example: "asc"
 *
 *     RoomListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Get all rooms successfully"
 *         metadata:
 *           type: object
 *           properties:
 *             rooms:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Room"
 *             pagination:
 *               $ref: "#/components/schemas/RoomPagination"
 *             filters:
 *               $ref: "#/components/schemas/RoomFilters"
 *
 *     RoomResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Room created successfully"
 *         metadata:
 *           type: object
 *           properties:
 *             room:
 *               $ref: "#/components/schemas/Room"
 */

/**
 * @openapi
 * /v1/api/rooms:
 *   get:
 *     summary: Get all rooms with pagination, search, and filters
 *     description: |
 *       Retrieve a list of all rooms with advanced filtering and pagination options.
 *
 *       **Available filters:**
 *       - Search by room name or room code
 *       - Filter by building, room type, and availability
 *       - Filter by price range and minimum capacity
 *       - Sort by various fields
 *
 *     tags: [Room]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by room name or room code (case-insensitive)
 *         example: "Conference"
 *       - in: query
 *         name: buildingId
 *         schema:
 *           type: string
 *         description: Filter by building ID
 *         example: "abc123-def456"
 *       - in: query
 *         name: roomType
 *         schema:
 *           type: string
 *           enum: [MEETING, CLASSROOM, EVENT, OTHER]
 *         description: Filter by room type
 *         example: "MEETING"
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability status
 *         example: true
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per hour
 *         example: 0
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per hour
 *         example: 100
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *         description: Minimum room capacity
 *         example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, pricePerHour, capacity, roomType, createdAt]
 *         description: Field to sort by
 *         example: "name"
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
 *         description: Rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomListResponse"
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/rooms/search:
 *   get:
 *     summary: Search for available rooms
 *     description: Search for rooms that are available during a specific time range.
 *     tags: [Room]
 *     parameters:
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time of the booking (ISO 8601)
 *         example: "2026-03-27T09:00:00.000Z"
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time of the booking (ISO 8601)
 *         example: "2026-03-27T11:00:00.000Z"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by room name or code
 *       - in: query
 *         name: buildingId
 *         schema:
 *           type: string
 *         description: Filter by building ID
 *       - in: query
 *         name: roomType
 *         schema:
 *           type: string
 *           enum: [MEETING, CLASSROOM, EVENT, OTHER]
 *         description: Filter by room type
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per hour
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per hour
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *         description: Minimum capacity
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of available rooms
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomListResponse"
 *       400:
 *         description: Missing start/end time or invalid format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/rooms/{id}:
 *   get:
 *     summary: Get room details by ID
 *     description: |
 *       Retrieve detailed information about a specific room including building, manager, and amenities.
 *
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *         example: "r-001"
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomResponse"
 *       400:
 *         description: Room ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/rooms:
 *   post:
 *     summary: Create a new room
 *     description: |
 *       Create a new room in a building. Requires authentication with **MANAGER** or **ADMIN** role.
 *
 *       **Validation rules:**
 *       - Building must exist
 *       - Room code must be unique
 *       - Price per hour must be greater than 0
 *       - Capacity must be greater than 0
 *     tags: [Room]
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
 *             $ref: "#/components/schemas/CreateRoomInput"
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomResponse"
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
 *       409:
 *         description: Conflict - Room code already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/rooms/{id}:
 *   patch:
 *     summary: Update room information
 *     description: |
 *       Update an existing room's information. Requires authentication with **MANAGER** or **ADMIN** role.
 *
 *       **Validation rules:**
 *       - Room must exist
 *       - If provided, price per hour must be greater than 0
 *       - If provided, capacity must be greater than 0
 *       - Room name cannot be empty
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *         example: "r-001"
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
 *             $ref: "#/components/schemas/UpdateRoomInput"
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomResponse"
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
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /v1/api/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     description: |
 *       Delete an existing room. Requires authentication with **MANAGER** or **ADMIN** role.
 *
 *       **Note:** This will cascade delete related records (amenities, booking requests, bookings).
 *     tags: [Room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *         example: "r-001"
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
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomResponse"
 *       400:
 *         description: Room ID is required
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
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */
