import express from "express";
import { getDashboard,scheduleInterview ,getScheduledInterviews,getResumeUrl} from "../controllers/interviewerDashboard.js";
import { authMiddleware } from "../middleware/authValidate.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);
router.get("/getScheduledInterviews", authMiddleware, getScheduledInterviews);
router.post("/schedule-interview", authMiddleware, scheduleInterview);
router.get("/resume/:applicationId",authMiddleware,getResumeUrl);

export default router;