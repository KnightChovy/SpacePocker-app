/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clx123abc456"
 *         name:
 *           type: string
 *           example: "Phuc"
 *         email:
 *           type: string
 *           example: "phuc@gmail.com"
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "0901234567"
 *
 *     TokenPair:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "OK"
 *         metadata:
 *           type: object
 *           properties:
 *             user:
 *               $ref: "#/components/schemas/AuthUser"
 *             tokens:
 *               $ref: "#/components/schemas/TokenPair"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Bad request"
 *
 *     ForgotPasswordRequest:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "phuc@gmail.com"
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required: [token, newPassword, confirmNewPassword]
 *       properties:
 *         token:
 *           type: string
 *           description: Password reset token from verify OTP endpoint
 *         newPassword:
 *           type: string
 *           example: "NewPassword@123"
 *         confirmNewPassword:
 *           type: string
 *           example: "NewPassword@123"
 *
 *     VerifyForgotPasswordOtpRequest:
 *       type: object
 *       required: [otpToken, otp]
 *       properties:
 *         otpToken:
 *           type: string
 *           description: Token returned by forgot-password endpoint
 *         otp:
 *           type: string
 *           example: "123456"
 */

/**
 * @openapi
 * /v1/api/auth/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "phuc@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               name:
 *                 type: string
 *                 example: "Phuc"
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Email already exists / Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "phuc@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: User not registered / Password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "clx123abc456"
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *                 metadata:
 *                   type: object
 *                   example: { "deleted": true }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken, userId, email]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               userId:
 *                 type: string
 *                 example: "clx123abc456"
 *               email:
 *                 type: string
 *                 example: "phuc@gmail.com"
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Invalid refresh token / Please login again
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/auth/forgot-password:
 *   post:
 *     summary: Request OTP for forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ForgotPasswordRequest"
 *     responses:
 *       200:
 *         description: Forgot password request handled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forgot password request handled successfully"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     sent:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "If this email exists, an OTP has been sent"
 *                     otpToken:
 *                       type: string
 *                       description: OTP session token (present when email exists)
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/auth/verify-forgot-password-otp:
 *   post:
 *     summary: Verify OTP for forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VerifyForgotPasswordOtpRequest"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verify OTP successfully"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     verified:
 *                       type: boolean
 *                       example: true
 *                     resetToken:
 *                       type: string
 *                       description: Use this token in reset-password endpoint
 *       400:
 *         description: Invalid OTP or token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /v1/api/auth/reset-password:
 *   post:
 *     summary: Reset password after OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ResetPasswordRequest"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reset password successfully"
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     reset:
 *                       type: boolean
 *                       example: true
 *                     userId:
 *                       type: string
 *                       example: "clx123abc456"
 *       400:
 *         description: Invalid/expired token or invalid password data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

export {};
