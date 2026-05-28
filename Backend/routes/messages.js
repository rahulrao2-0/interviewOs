import express from "express";

import { saveMessage,getChatMessages } from "../controllers/messages.js";
import { authMiddleware } from "../middleware/authValidate.js";

const router = express.Router()

router.post("/save-message", authMiddleware, saveMessage);
router.get("/chat/:userId", authMiddleware, getChatMessages);

export default router;