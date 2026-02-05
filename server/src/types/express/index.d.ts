import { Key } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      keyStore?: Key;
      user?: JwtPayload;
      refreshToken?: string;
    }
  }
}
export {};
