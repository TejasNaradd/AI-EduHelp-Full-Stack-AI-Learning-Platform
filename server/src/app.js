import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import ApiError from './utils/ApiError.js';

const app = express();

app.set("trust proxy", 1);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// ✅ add this right after cors
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import documentRouter from "./routes/document.routes.js"
import quizRouter from "./routes/quiz.routes.js"
import flashcardRouter from "./routes/flashcard.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

app.use("/api/v1/user", userRouter)
app.use("/api/v1/documents", documentRouter)
app.use("/api/v1/quiz", quizRouter)
app.use("/api/v1/flashcards", flashcardRouter)
app.use("/api/v1/dashboard", dashboardRouter)

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;