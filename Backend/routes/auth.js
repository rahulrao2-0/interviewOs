import express from "express";
import { Signup,logout,Login , verifyOtp } from "../controllers/auth.js";
const router = express.Router();

router.post("/signup", Signup)
router.post("/login",Login)
router.get("/logout",logout);
router.post("/verify-otp",verifyOtp);
export default router;