import { Response } from "express";

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
} as const;

export const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
} as const;

interface SuccessResponsePayload {
  message?: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata?: Record<string, any>;
}

export class SuccessResponse {
  message: string;
  status: number;
  reason: string;
  metadata: Record<string, any>;

  constructor({
    message,
    statusCode = STATUS_CODE.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }: SuccessResponsePayload) {
    this.message = message ?? reasonStatusCode;
    this.status = statusCode;
    this.reason = reasonStatusCode;
    this.metadata = metadata;
  }

  send(res: Response, headers: Record<string, string> = {}) {
    return res.status(this.status).set(headers).json({
      message: this.message,
      reason: this.reason,
      metadata: this.metadata,
    });
  }
}

/* =======================
   OK RESPONSE (200)
======================= */

export class OK extends SuccessResponse {
  constructor(message?: string, metadata?: Record<string, any>) {
    super({ message, metadata });
  }
}

/* =======================
   CREATED RESPONSE (201)
======================= */

export class Created extends SuccessResponse {
  options?: Record<string, any>;

  constructor(
    message?: string,
    metadata?: Record<string, any>,
    options: Record<string, any> = {}
  ) {
    super({
      message,
      statusCode: STATUS_CODE.CREATED,
      reasonStatusCode: ReasonStatusCode.CREATED,
      metadata,
    });
    this.options = options;
  }
}
