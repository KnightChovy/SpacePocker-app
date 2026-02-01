"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const access_controller_1 = __importDefault(require("../../controllers/access.controller"));
const asyncHandler_1 = require("../../helper/asyncHandler");
router.post("/login", (0, asyncHandler_1.asyncHandler)(access_controller_1.default.login));
router.post("/refresh-token", (0, asyncHandler_1.asyncHandler)(access_controller_1.default.handleRefreshToken));
router.post("/logout", (0, asyncHandler_1.asyncHandler)(access_controller_1.default.logout));
router.post("/signup", (0, asyncHandler_1.asyncHandler)(access_controller_1.default.signUp));
exports.default = router;
