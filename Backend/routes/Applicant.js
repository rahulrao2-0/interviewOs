import express from "express";
import { applicants } from "../controllers/applicants.js";
import { authMiddleware , interviewervalidation } from "../middleware/authValidate.js";
import { MyApplications,getInterviewerInboxUsers,getStudentInboxUsers , applicantFullDetail,profileExist,StudentProfileSetup,
     InterviewerProfileSetup,getProfile
     
} from "../controllers/applicants.js";
import ExpressError from "../ExpressError.js";
import  redis from "../redis.js";
const router = express.Router();

router.get("/applicants",interviewervalidation,applicants)

router.get("/my-applications",authMiddleware, MyApplications);
router.get("/profileExist", authMiddleware, profileExist);
router.get("/interviewer-inbox-users", interviewervalidation, getInterviewerInboxUsers);
router.get("/student-inbox-users", authMiddleware, getStudentInboxUsers);
router.get("/applicantFullDetail/:applicantId",  applicantFullDetail);
router.post("/student-profile-setup", authMiddleware, StudentProfileSetup);
router.post("/interviewer-profile-setup",authMiddleware, InterviewerProfileSetup)
router.get("/profile",authMiddleware,getProfile)

export default router;