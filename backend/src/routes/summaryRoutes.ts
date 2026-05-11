import { Router } from "express";
import { getSummary } from "../controllers/summaryController.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/", strictLimiter, getSummary);

export default router;