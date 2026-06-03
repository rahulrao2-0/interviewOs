import express from "express";
import { allJobs , applyJob , postJob,myJobs,deleteJob,editJob } from "../controllers/jobs.js";
import { authMiddleware } from "../middleware/authValidate.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/allJobs",allJobs)
router.post("/applyJob",authMiddleware,upload.single("resume"),applyJob)
router.post("/postJob",authMiddleware,postJob)
router.get("/my-Jobs",authMiddleware,myJobs)
router.delete("/delete-job/:job_id",authMiddleware,deleteJob)
router.put("/edit-job/:job_id", authMiddleware, editJob);

export default router;