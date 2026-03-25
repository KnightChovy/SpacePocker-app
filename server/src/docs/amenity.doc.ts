/**
 * @openapi
 * tags:
 *   - name: Amenity
 *     description: Amenity management APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateAmenityInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the amenity
 *           example: "WiFi"
 *
 *     AmenityResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateRoomAmenityInput:
 *       type: object
 *       required:
 *         - roomId
 *         - amenityId
 *       properties:
 *         roomId:
 *           type: string
 *           format: uuid
 *         amenityId:
 *           type: string
 *           format: uuid
 */

/**
 * @openapi
 * /v1/api/amenities:
 *   get:
 *     tags:
 *       - Amenity
 *     summary: Get all amenities (Public)
 *     description: Public endpoint to retrieve all amenities
 *     responses:
 *       200:
 *         description: Amenities retrieved successfully
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
 *                     $ref: '#/components/schemas/AmenityResponse'
 *
 *   post:
 *     tags:
 *       - Amenity
 *     summary: Create amenity (Manager/Admin)
 *     description: Create a new amenity
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAmenityInput'
 *     responses:
 *       201:
 *         description: Amenity created successfully
 *       409:
 *         description: Amenity with this name already exists
 */

/**
 * @openapi
 * /v1/api/amenities/{id}:
 *   get:
 *     tags:
 *       - Amenity
 *     summary: Get amenity by ID (Public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Amenity retrieved successfully
 *       404:
 *         description: Amenity not found
 *
 *   put:
 *     tags:
 *       - Amenity
 *     summary: Update amenity (Manager/Admin)
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
 *             $ref: '#/components/schemas/CreateAmenityInput'
 *     responses:
 *       200:
 *         description: Amenity updated successfully
 *       404:
 *         description: Amenity not found
 *
 *   delete:
 *     tags:
 *       - Amenity
 *     summary: Delete amenity (Manager/Admin)
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
 *         description: Amenity deleted successfully
 *       404:
 *         description: Amenity not found
 */

/**
 * @openapi
 * /v1/api/room-amenities:
 *   post:
 *     tags:
 *       - Amenity
 *     summary: Add amenity to room (Manager/Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoomAmenityInput'
 *     responses:
 *       201:
 *         description: Room amenity added successfully
 *       404:
 *         description: Room or amenity not found
 *       409:
 *         description: Room amenity already exists
 */

/**
 * @openapi
 * /v1/api/room-amenities/{roomId}/{amenityId}:
 *   delete:
 *     tags:
 *       - Amenity
 *     summary: Remove amenity from room (Manager/Admin)
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
 *         name: amenityId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Room amenity removed successfully
 *       404:
 *         description: Room amenity not found
 */
