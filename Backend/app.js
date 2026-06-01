import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import db from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import ExpressError from "./ExpressError.js";
import cors from "cors"
import { authMiddleware } from "./middleware/authValidate.js";
import { createToken } from "./utils/jwt.js";
import authRoutes from "./routes/auth.js";
import applicantRoutes from "./routes/Applicant.js";
import jobRoutes  from  "./routes/jobs.js"
import cookieParser from "cookie-parser";
import { chatSocket } from "./scokets/chatSocket.js";
import messageRoutes from "./routes/messages.js";
import aiInterviewRoutes from "./routes/aiInterview.js";
import interviewerDashboardRoutes from "./routes/interviewerDashboard.js";
const app = express();
app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  "http://localhost:5173",
  "https://interview-os-ten.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials:true
  }
});

app.get("/api/me", authMiddleware, async (req, res,next) => {
  console.log("/me api hit")
  try {
    console.log("user:---",req.user)
    
    const userId = req.user.id;
    console.log("userId in /me",userId)

    
    const [rows] = await db.execute(
      "SELECT user_id, username , role FROM users WHERE user_id = ?",
      [userId]
    );

    console.log(rows)

    const user = rows[0];

    res.status(200).json({
      user
    });

  } catch (err) {
    console.log(err);
    next(new ExpressError("Failed to fetch user", 500));
  }
});

app.use("/api",authRoutes)
app.use("/api",applicantRoutes)
app.use("/api",jobRoutes)
app.use("/api",messageRoutes)
app.use("/api",aiInterviewRoutes)
app.use("/api",interviewerDashboardRoutes)
// ✅ SOCKET
chatSocket(io);
export { io };

app.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;

  res.status(statusCode).json({
    success: statusCode,
    message: message
  });
});

// ✅ SERVER
server.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});