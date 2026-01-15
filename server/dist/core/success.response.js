"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Created = exports.OK = exports.SuccessResponse = exports.ReasonStatusCode = exports.STATUS_CODE = void 0;
exports.STATUS_CODE = {
    OK: 200,
    CREATED: 201,
};
exports.ReasonStatusCode = {
    OK: "Success",
    CREATED: "Created",
};
class SuccessResponse {
    constructor({ message, statusCode = exports.STATUS_CODE.OK, reasonStatusCode = exports.ReasonStatusCode.OK, metadata = {}, }) {
        this.message = message !== null && message !== void 0 ? message : reasonStatusCode;
        this.status = statusCode;
        this.reason = reasonStatusCode;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).set(headers).json({
            message: this.message,
            reason: this.reason,
            metadata: this.metadata,
        });
    }
}
exports.SuccessResponse = SuccessResponse;
/* =======================
   OK RESPONSE (200)
======================= */
class OK extends SuccessResponse {
    constructor(message, metadata) {
        super({ message, metadata });
    }
}
exports.OK = OK;
/* =======================
   CREATED RESPONSE (201)
======================= */
class Created extends SuccessResponse {
    constructor(message, metadata, options = {}) {
        super({
            message,
            statusCode: exports.STATUS_CODE.CREATED,
            reasonStatusCode: exports.ReasonStatusCode.CREATED,
            metadata,
        });
        this.options = options;
    }
}
exports.Created = Created;
