"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const building_container_1 = require("../../container/building.container");
require("../../docs/building.doc");
const buildingRouter = express_1.default.Router();
buildingRouter.get('/buildings', (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.getAllBuildings));
buildingRouter.post('/building', (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.createBuilding));
buildingRouter.get('/building/:id', (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.getBuildingById));
buildingRouter.put('/building/:id', (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.updateBuilding));
buildingRouter.delete('/building/:id', (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.deleteBuilding));
exports.default = buildingRouter;
