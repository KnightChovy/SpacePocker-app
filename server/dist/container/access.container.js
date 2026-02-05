"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessController = void 0;
const user_repository_1 = require("../repository/user.repository");
const token_repository_1 = require("../repository/token.repository");
const keyToken_service_1 = __importDefault(require("../services/keyToken.service"));
const access_service_1 = __importDefault(require("../services/access.service"));
const access_controller_1 = __importDefault(require("../controllers/access.controller"));
const userRepo = new user_repository_1.UserRepository();
const keyRepo = new token_repository_1.KeyTokenRepository();
const keyTokenService = new keyToken_service_1.default(keyRepo);
const accessService = new access_service_1.default(userRepo, keyRepo, keyTokenService);
exports.accessController = new access_controller_1.default(accessService);
