import express from 'express';
import cookieParser from 'cookie-parser'; //server se user breowser me cookie bhejne k liye can ascess and set cookies read by only server
import cors from 'cors';
import ApiError from './utils/ApiError.js';

const app=express();

//use is used for middlewares and configurations
app.use(cors({
    origin:process.env.CORS_ORIGIN, //star for allowing all origins
    credentials:true,
})) 

app.use(express.json({limit:"16kb"}));  //acceptinf json data in req body
app.use(express.urlencoded({extended:true,limit:"16kb"})); //to accept url data extened means object k andar object jaa skta hai

app.use(express.static("public")); //agar files store karni hai toh static folder bana k usme rakh skte hai

app.use(cookieParser()); //options not majorly used

import userRouter from "./routes/user.routes.js"
import documentRouter from "./routes/document.routes.js"
import quizRouter from "./routes/quiz.routes.js"
import flashcardRouter from "./routes/flashcard.routes.js"


app.use("/api/v1/user",userRouter)
app.use("/api/v1/documents",documentRouter)
app.use("/api/v1/quiz",quizRouter)
app.use("/api/v1/flashcards",flashcardRouter)


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