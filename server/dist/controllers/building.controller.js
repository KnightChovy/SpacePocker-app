"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
class BuildingController {
    constructor(buildingService) {
        this.buildingService = buildingService;
        this.createBuilding = async (req, res, next) => {
            new success_response_1.Created({
                message: 'Building created successfully',
                metadata: await this.buildingService.createBuilding(req.body),
            }).send(res);
        };
        this.getBuildingById = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Get building successfully',
                metadata: await this.buildingService.getBuildingById(req.params.id),
            }).send(res);
        };
        this.getAllBuildings = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Get all buildings successfully',
                metadata: await this.buildingService.getAllBuildings(req.query),
            }).send(res);
        };
        this.updateBuilding = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Building updated successfully',
                metadata: await this.buildingService.updateBuilding(req.params.id, req.body),
            }).send(res);
        };
        this.deleteBuilding = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Building deleted successfully',
                metadata: await this.buildingService.deleteBuilding(req.params.id),
            }).send(res);
        };
    }
}
exports.default = BuildingController;
