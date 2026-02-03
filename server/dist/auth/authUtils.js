"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.authentication = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId)
        throw new error_response_1.AuthFailureError("Invalid request");
    const keyStore = yield prisma_1.prisma.key.findUnique({
        where: { userId: String(userId) },
    });
    if (!keyStore) {
        throw new error_response_1.AuthFailureError("Invalid request");
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
        console.log("Decoded user from access token:", decodeUser);
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
}));
const createTokenPair = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
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
        console.log("error createTokenPair: ", error);
        throw error;
    }
});
exports.createTokenPair = createTokenPair;
