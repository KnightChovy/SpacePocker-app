"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
        this.createRoom = async (req, res, next) => {
            new success_response_1.Created({
                message: 'Room created successfully',
                metadata: await this.roomService.createRoom(req.body),
            }).send(res);
        };
        this.getRoomById = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Get room successfully',
                metadata: await this.roomService.getRoomById(String(req.params.id)),
            }).send(res);
        };
        this.getAllRooms = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Get all rooms successfully',
                metadata: await this.roomService.getAllRooms(req.query),
            }).send(res);
        };
        this.updateRoom = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Room updated successfully',
                metadata: await this.roomService.updateRoom(String(req.params.id), req.body),
            }).send(res);
        };
        this.deleteRoom = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Room deleted successfully',
                metadata: await this.roomService.deleteRoom(String(req.params.id)),
            }).send(res);
        };
    }
}
exports.default = RoomController;
