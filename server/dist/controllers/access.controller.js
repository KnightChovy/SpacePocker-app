"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const access_service_1 = __importDefault(require("../services/access.service"));
const success_response_1 = require("../core/success.response");
class AccessController {
}
_a = AccessController;
AccessController.handleRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.OK({
        message: "Token refreshed successfully",
        metadata: yield access_service_1.default.handleRefreshToken(req.body),
    }).send(res);
});
AccessController.logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.OK({
        message: "User logged out successfully",
        metadata: yield access_service_1.default.logout(req.body),
    }).send(res);
});
AccessController.signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.Created({
        message: "User created successfully",
        metadata: yield access_service_1.default.signUp(req.body),
    }).send(res);
});
AccessController.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.OK({
        message: "User logged in successfully",
        metadata: yield access_service_1.default.login(req.body),
    }).send(res);
});
exports.default = AccessController;
