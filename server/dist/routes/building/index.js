"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const building_container_1 = require("../../container/building.container");
const authUtils_1 = require("../../auth/authUtils");
require("../../docs/building.doc");
const buildingRouter = express_1.default.Router();
buildingRouter.get("/buildings", (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.getAllBuildings));
buildingRouter.get("/buildings/:id", (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.getBuildingById));
buildingRouter.post("/buildings", authUtils_1.authentication, (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.createBuilding));
buildingRouter.patch("/buildings/:id", authUtils_1.authentication, (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.updateBuilding));
buildingRouter.delete("/buildings/:id", authUtils_1.authentication, (0, asyncHandler_1.asyncHandler)(building_container_1.buildingController.deleteBuilding));
exports.default = buildingRouter;
