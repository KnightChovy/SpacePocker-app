import JWT from "jsonwebtoken";
import { asyncHandler } from "../helper/asyncHandler.js";
import { BadRequestError } from "../core/error.response.js";
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-refresh-token",
} as const;

export const authentication = asyncHandler(async (req, res, next) => {
  const token = req.headers[HEADER.AUTHORIZATION] as string;
  if (!token) {
    throw new BadRequestError("No token provided");
  }
});
