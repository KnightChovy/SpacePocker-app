"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildingController = void 0;
const building_controller_1 = __importDefault(require("../controllers/building.controller"));
const prisma_1 = require("../lib/prisma");
const building_repository_1 = require("../repository/building.repository");
const building_service_1 = require("../services/building.service");
const buildingRepository = new building_repository_1.BuildingRepository(prisma_1.prisma);
const buildingService = new building_service_1.BuildingService(buildingRepository);
const buildingController = new building_controller_1.default(buildingService);
exports.buildingController = buildingController;
