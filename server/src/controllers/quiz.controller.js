import { Document } from "../models/document.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Attempt } from "../models/quizAttempt.model.js";
import { Question } from "../models/quizQuestion.model.js";
import { generateQuizAI } from "../services/ai.services.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateQuiz=asyncHandler(async(req,res)=>{
    const {docId}=req.params

    const document=await Document.findOne({
        _id:docId,
        owner:req.user._id
    })

    if(!document){
        throw new ApiError(404,"Document not found or access denied")
    }

    if(!document.topics || document.topics.length===0){
        throw new ApiError(400,"generate summary first for topic extraction")
    }

    const quizAttempt=await Quiz.countDocuments({
        document:docId,
        owner:req.user._id
    })

    const quiz=await Quiz.create({
        owner:req.user._id,
        document:docId,
        title:`Quiz for ${document.title} - Attempt ${quizAttempt+1}`,
        status:"processing"
    })

    try {
      const questionsFromAi=await generateQuizAI(document.text,document.topics)
      const questionData=questionsFromAi.map((q)=>({
        quiz:quiz._id,
        question:q.question,
        options:q.options,
        correctAnswerIndex:q.answerIndex,
        topic:q.topic
      }))      
      await Question.insertMany(questionData)

      quiz.totalQuestions=questionData.length
      quiz.status="completed"
      await quiz.save()

    } catch (error) {
      quiz.status="failed"
      await quiz.save()
      throw new ApiError(500,"quiz generation failed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,
        {
        quizId: quiz._id,
        title: quiz.title,
        totalQuestions: quiz.totalQuestions,
        status: quiz.status,
        }
      ,"Quiz generated successfully")
    )
})

// const getAllQuiz=asyncHandler(async(req,res)=>{
//     const {docId}=req.params

//     const document=await Document.findOne({
//         _id:docId,
//         owner:req.user._id
//     })
//     if(!document){
//         throw new ApiError(404,"Document not found or access denied")
//     }
    
//     const quizzes=await Quiz.find({
//         document:docId,
//         owner:req.user._id
//     }).sort({createdAt:-1})

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200,quizzes,"Quizzes retrieved successfully")
//     )
// })

const getAllQuiz = asyncHandler(async (req, res) => {
  const { docId } = req.params;

  const document = await Document.findOne({
    _id: docId,
    owner: req.user._id,
  });

  if (!document) {
    throw new ApiError(404, "Document not found or access denied");
  }

  const quizzes = await Quiz.find({
    document: docId,
    owner: req.user._id,
  }).sort({ createdAt: -1 });

  const quizzesWithAttempts = await Promise.all(
    quizzes.map(async (quiz) => {
      const latestAttempt = await Attempt.findOne({
        quiz: quiz._id,
        owner: req.user._id,
      }).sort({ createdAt: -1 });

      return {
        ...quiz.toObject(),
        latestAttempt,
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      quizzesWithAttempts,
      "Quizzes retrieved successfully"
    )
  );
})

const getQuiz=asyncHandler(async(req,res)=>{
    const {quizId}=req.params

    const quiz=await Quiz.findOne({
        _id:quizId,
        owner:req.user._id
    }).populate("document","title")
    if(!quiz){
        throw new ApiError(404,"Quiz not found or access denied")
    }

    const questions=await Question.find({
        quiz:quizId
    }).select("-correctAnswerIndex")   

    return res
    .status(200)
    .json(
        new ApiResponse(200,{
            quiz,
            questions
        },"Quiz retrieved successfully")
    )
})

const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    throw new ApiError(400, "Answers are required");
  }

  const quiz = await Quiz.findOne({
    _id: quizId,
    owner: req.user._id,
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  const questions = await Question.find({ quiz: quizId });

  if (questions.length === 0) {
    throw new ApiError(400, "No questions found for this quiz");
  }

  let correctCount = 0;
  const weakTopicsSet = new Set();

  const document = await Document.findById(quiz.document);

  for (const question of questions) {
    const userAnswer = answers.find(
      (a) => a.questionId === question._id.toString()
    )

    const topic = document.topics.find(
      (t) => t.name === question.topic
    );

    if (!topic) continue;

    if (userAnswer && userAnswer.selectedIndex === question.correctAnswerIndex) {
      correctCount++;
      topic.masteryLevel = Math.min(topic.masteryLevel + 10, 100);
    } else {
      topic.masteryLevel = Math.max(topic.masteryLevel - 5, 0);
      weakTopicsSet.add(topic.name);
    }
  }

  const score = Math.round((correctCount / questions.length) * 100);

  document.progress.quizzesTaken += 1;

  const previousTotal =
    document.progress.overallScore *
    (document.progress.quizzesTaken - 1);

  document.progress.overallScore =
    (previousTotal + score) /
    document.progress.quizzesTaken;

  document.progress.lastAccessed = new Date();

  await document.save();

  const attemptCount = await Attempt.countDocuments({
    quiz: quizId,
    owner: req.user._id,
  })

  await Attempt.create({
    owner: req.user._id,
    quiz: quizId,
    attemptNumber: attemptCount + 1,
    score,
    totalQuestion: questions.length,
    weakTopic: Array.from(weakTopicsSet),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        score,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        weakTopics: Array.from(weakTopicsSet),
      },
      "Quiz submitted successfully"
    )
  );
})

export {
    generateQuiz,
    getAllQuiz,
    getQuiz,
    submitQuiz,
}