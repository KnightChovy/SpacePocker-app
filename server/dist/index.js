"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const error_response_1 = require("./core/error.response");
//import compression from "compression";
//init middleware
//handling error
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use((0, morgan_1.default)("common"));
app.use("", routes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    // Nếu là custom error (có status code)
    if (err instanceof error_response_1.ErrorResponse) {
        return res.status(err.status).json({
            message: err.message,
            status: err.status,
        });
    }
    // Default error (500 Internal Server Error)
    console.error("Unhandled Error:", err);
    return res.status(500).json({
        message: err.message || "Internal Server Error",
        status: 500,
    });
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
