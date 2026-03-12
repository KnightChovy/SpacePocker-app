"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const room_container_1 = require("../../container/room.container");
const authUtils_1 = require("../../auth/authUtils");
const roomRouter = express_1.default.Router();
roomRouter.get('/rooms', (0, asyncHandler_1.asyncHandler)(room_container_1.roomController.getAllRooms));
roomRouter.get('/rooms/:id', (0, asyncHandler_1.asyncHandler)(room_container_1.roomController.getRoomById));
roomRouter.use(authUtils_1.authentication);
roomRouter.post('/rooms', (0, asyncHandler_1.asyncHandler)(room_container_1.roomController.createRoom));
roomRouter.patch('/rooms/:id', (0, asyncHandler_1.asyncHandler)(room_container_1.roomController.updateRoom));
roomRouter.delete('/rooms/:id', (0, asyncHandler_1.asyncHandler)(room_container_1.roomController.deleteRoom));
exports.default = roomRouter;
