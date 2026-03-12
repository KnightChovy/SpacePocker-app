import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { ErrorResponse } from "./core/error.response";
//import compression from "compression";

//init middleware

//handling error

const app = express();
dotenv.config();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan("common"));
app.use("", routes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Nếu là custom error (có status code)
  if (err instanceof ErrorResponse) {
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
