'use strict';

export const STATUS_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

export const ResponseStatusCode = {
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  CONFLICT: 'Conflict error',
};

export const ReasonPhrases = {
  FORBIDDEN: 'Forbidden',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not found',
};

export class ErrorResponse extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.CONFLICT,
    statusCode = STATUS_CODE.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message = ResponseStatusCode.BAD_REQUEST,
    statusCode = STATUS_CODE.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = STATUS_CODE.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = STATUS_CODE.NOT_FOUND,
  ) {
    super(message, statusCode);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = STATUS_CODE.FORBIDDEN,
  ) {
    super(message, statusCode);
  }
}
