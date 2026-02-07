"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const access_1 = __importDefault(require("./access"));
const building_1 = __importDefault(require("./building"));
router.use('/v1/api', access_1.default);
router.use('/v1/api', building_1.default);
exports.default = router;
