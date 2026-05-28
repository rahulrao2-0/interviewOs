import db from "../config/db.js";

import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getInterviewQuestions = async (req, res,next) => {
  try {
    const { topic, level , previousQuestions} = req.body;

    // const topic = "React";
    // const level = "Easy";

    const response = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens:  500,
      messages: [
        {
          role:    "user",
          content: `
            Generate a ${level} level interview question on the topic of ${topic}.
            Provide only the question without any additional explanation or formatting.
            and previous question asked: ${previousQuestions ? previousQuestions.join(", ") : "None"}
          `
        },
      ],
    });

    console.log("Groq response:", response.choices[0].message.content);

    res.json({ 
        success: true,
        question: response.choices[0].message.content });
  }catch(err){
    console.log("Get questions error:", err);
    next(err);
  }
}

export const evaluateAnswer = async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required",
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `
You are an interview evaluator as well as teacher.

Evaluate the student's answer based on the given interview question and give feedback like you are a teacher and after evaluting like you are teaching.

Return only valid JSON in this format:
{
  "feedback": "short feedback here",
  "score": 7
}

Score should be from 0 to 10.
Do not include markdown.
Do not include extra text.
          `,
        },
        {
          role: "user",
          content: `
Question: ${question}

Student Answer: ${answer}
          `,
        },
      ],
    });

    const aiText = response.choices[0].message.content;
    console.log("AI Evaluate Response:", aiText);

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (error) {
      parsed = {
        feedback: aiText,
        score: null,
      };
    }

    res.status(200).json({
      success: true,
      feedback: parsed.feedback,
      score: parsed.score,
    });
  } catch (err) {
    console.log("Evaluate Answer Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to evaluate answer",
      error: err.message,
    });
  }
};
