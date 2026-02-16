"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const success_response_1 = require("../core/success.response");
class AccessController {
    constructor(accessService) {
        this.accessService = accessService;
        this.handleRefreshToken = async (req, res, next) => {
            new success_response_1.OK({
                message: 'Token refreshed successfully',
                metadata: await this.accessService.handleRefreshToken(req.body),
            }).send(res);
        };
        this.logout = async (req, res, next) => {
            new success_response_1.OK({
                message: 'User logged out successfully',
                metadata: await this.accessService.logout(req.body),
            }).send(res);
        };
        this.signUp = async (req, res, next) => {
            new success_response_1.Created({
                message: 'User created successfully',
                metadata: await this.accessService.signUp(req.body),
            }).send(res);
        };
        this.login = async (req, res, next) => {
            new success_response_1.OK({
                message: 'User logged in successfully',
                metadata: await this.accessService.login(req.body),
            }).send(res);
        };
    }
}
exports.default = AccessController;
