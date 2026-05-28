import express from "express";
import { allJobs , applyJob , postJob,myJobs } from "../controllers/jobs.js";
import { authMiddleware } from "../middleware/authValidate.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/allJobs",allJobs)
router.post("/applyJob",authMiddleware,upload.single("resume"),applyJob)
router.post("/postJob",authMiddleware,postJob)
router.get("/my-Jobs",authMiddleware,myJobs)

export default router;