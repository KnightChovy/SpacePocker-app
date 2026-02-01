import express from "express";
const router = express.Router();
import accessRoutes from "./access";

router.use("/v1/api", accessRoutes);

export default router;
