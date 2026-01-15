"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.NotFoundError = exports.AuthFailureError = exports.BadRequestError = exports.ConflictRequestError = exports.ErrorResponse = exports.ReasonPhrases = exports.ResponseStatusCode = exports.STATUS_CODE = void 0;
exports.STATUS_CODE = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    NOT_FOUND: 404,
};
exports.ResponseStatusCode = {
    FORBIDDEN: "bad request",
    CONFLICT: "Conflict error",
};
exports.ReasonPhrases = {
    FORBIDDEN: "Forbidden",
    UNAUTHORIZED: "Unauthorized",
    NOT_FOUND: "Not found",
};
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ErrorResponse = ErrorResponse;
class ConflictRequestError extends ErrorResponse {
    constructor(message = exports.ResponseStatusCode.CONFLICT, statusCode = exports.STATUS_CODE.CONFLICT) {
        super(message, statusCode);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message = exports.ResponseStatusCode.FORBIDDEN, statusCode = exports.STATUS_CODE.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.BadRequestError = BadRequestError;
class AuthFailureError extends ErrorResponse {
    constructor(message = exports.ReasonPhrases.UNAUTHORIZED, statusCode = exports.STATUS_CODE.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.AuthFailureError = AuthFailureError;
class NotFoundError extends ErrorResponse {
    constructor(message = exports.ReasonPhrases.NOT_FOUND, statusCode = exports.STATUS_CODE.NOT_FOUND) {
        super(message, statusCode);
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ErrorResponse {
    constructor(message = exports.ReasonPhrases.FORBIDDEN, statusCode = exports.STATUS_CODE.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.ForbiddenError = ForbiddenError;
