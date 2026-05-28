import express from "express";
import { getDashboard } from "../controllers/interviewerDashboard.js";
import { authMiddleware } from "../middleware/authValidate.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);

export default router;