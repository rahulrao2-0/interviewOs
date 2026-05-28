import express from 'express';
// import { authMiddleware } from '../middleware/authMiddleware.js';
import { getInterviewQuestions ,evaluateAnswer } from '../controllers/aiInterview.js';
import { authMiddleware } from '../middleware/authValidate.js';

const router = express.Router();

router.post('/ai/interview-questions',authMiddleware, getInterviewQuestions);
router.post('/ai/evaluate-answer', authMiddleware, evaluateAnswer);

export default router;