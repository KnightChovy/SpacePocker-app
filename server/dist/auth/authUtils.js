"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenPair = exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../helper/asyncHandler");
const error_response_1 = require("../core/error.response");
const prisma_1 = require("../lib/prisma");
const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-refresh-token",
};
exports.authentication = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId)
        throw new error_response_1.NotFoundError("User not found");
    const keyStore = await prisma_1.prisma.key.findUnique({
        where: { userId: String(userId) },
    });
    if (!keyStore) {
        throw new error_response_1.NotFoundError("Key store not found");
    }
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    if (refreshToken) {
        try {
            const decodeUser = jsonwebtoken_1.default.verify(refreshToken, keyStore.publicKey);
            console.log("Decoded user from access token:", decodeUser);
            if (String(userId) !== String(decodeUser.userId)) {
                throw new error_response_1.AuthFailureError("Invalid user");
            }
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        }
        catch (error) {
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
        throw new error_response_1.BadRequestError("No token provided");
    }
    try {
        const decodeUser = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (String(userId) !== String(decodeUser.userId)) {
            throw new error_response_1.AuthFailureError("Invalid user");
        }
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    }
    catch (error) {
        throw error;
    }
});
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        //access token
        const accessToken = jsonwebtoken_1.default.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "2 days",
        });
        //refresh token
        const refreshToken = jsonwebtoken_1.default.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7 days",
        });
        jsonwebtoken_1.default.verify(accessToken, publicKey);
        jsonwebtoken_1.default.verify(refreshToken, publicKey);
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw error;
    }
};
exports.createTokenPair = createTokenPair;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!userRole || !roles.includes(userRole)) {
            throw new error_response_1.AuthFailureError("You are not allowed to access this resource");
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
