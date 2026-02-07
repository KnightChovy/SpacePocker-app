"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const access_container_1 = require("../../container/access.container");
const asyncHandler_1 = require("../../helper/asyncHandler");
router.post("/refresh-token", (0, asyncHandler_1.asyncHandler)(access_container_1.accessController.handleRefreshToken));
router.post("/logout", (0, asyncHandler_1.asyncHandler)(access_container_1.accessController.logout));
router.post("/signup", (0, asyncHandler_1.asyncHandler)(access_container_1.accessController.signUp));
exports.default = router;
