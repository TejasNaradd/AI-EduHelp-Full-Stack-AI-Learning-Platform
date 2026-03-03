import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Document } from "../models/document.model.js";
import { Quiz } from "../models/quiz.model.js";
import { FlashCard } from "../models/flashcard.model.js";
import { Attempt } from "../models/quizAttempt.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalDocuments = await Document.countDocuments({ owner: userId });

  const totalQuizzes = await Quiz.countDocuments({ owner: userId });

  const flashcardSetsResult = await FlashCard.aggregate([
    { $match: { owner: userId } },
    { $group: { _id: "$setId" } },
    { $count: "totalSets" }
  ]);

  const totalFlashcardSets =
    flashcardSetsResult?.[0]?.totalSets || 0;

  const totalFlashcards = await FlashCard.countDocuments({
    owner: userId
  });

  const completedFlashcards = await FlashCard.countDocuments({
    owner: userId,
    reviewed: true
  });

  const avgScoreResult = await Attempt.aggregate([
    { $match: { owner: userId } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$score" }
      }
    }
  ]);

  const avgScore = Math.round(avgScoreResult?.[0]?.avgScore || 0);

const weeklyUploads = await Document.aggregate([
  { $match: { owner: userId } },
  {
    $group: {
      _id: {
        year: { $isoWeekYear: "$createdAt" },
        week: { $isoWeek: "$createdAt" }
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { "_id.year": -1, "_id.week": -1 } },
  { $limit: 8 },
]);

const formattedWeeklyUploads = weeklyUploads
  .reverse()
  .map((item) => ({
    week: `${item._id.year}-W${item._id.week}`,
    count: item.count,
  }));

  const scoreTrend = await Attempt.aggregate([
  { $match: { owner: userId } }, 
  {
    $group: {
      _id: {
        year: { $isoWeekYear: "$createdAt" },
        week: { $isoWeek: "$createdAt" }
      },
      score: { $avg: "$score" }
    }
  },
  { $sort: { "_id.year": -1, "_id.week": -1 } },
  { $limit: 8 }
]);

  const formattedScoreTrend = scoreTrend
  .reverse()
  .map((item) => ({
    week: `${item._id.year}-W${item._id.week}`,
    score: Math.round(item.score),
  }));

  const recentUploadedDocs = await Document.find({ owner: userId })
    .sort({ createdAt: -1 })
    .limit(2)
    .select("title createdAt");

  const recentAccessedDocs = await Document.find({ owner: userId })
    .sort({ lastAccessed: -1 })
    .limit(2)
    .select("title lastAccessed");

  const recentAttempts = await Attempt.find({ owner: userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("score createdAt")
    .populate("quiz", "title");

  const recentFlashcardSets = await FlashCard.aggregate([
    { $match: { owner: userId } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$setId",
        createdAt: { $first: "$createdAt" }
      }
    },
    { $limit: 3 }
  ]);

  let recentActivity = [];

  recentUploadedDocs.forEach(doc => {
    recentActivity.push({
      type: "document",
      message: `Uploaded document "${doc.title}"`,
      createdAt: doc.createdAt
    });
  });

  recentAccessedDocs.forEach(doc => {
    if (doc.lastAccessed) {
      recentActivity.push({
        type: "document",
        message: `Accessed document "${doc.title}"`,
        createdAt: doc.lastAccessed
      });
    }
  });

  recentAttempts.forEach(attempt => {
    recentActivity.push({
      type: "quiz",
      message: `Completed quiz "${attempt.quiz?.title}" with score ${attempt.score}%`,
      createdAt: attempt.createdAt
    });
  });

  recentFlashcardSets.forEach(set => {
    recentActivity.push({
      type: "flashcard",
      message: `Generated new flashcard set`,
      createdAt: set.createdAt
    });
  });

  recentActivity.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  recentActivity = recentActivity.slice(0, 6);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        documents: totalDocuments,
        quizzes: totalQuizzes,
        flashcardSets: totalFlashcardSets,
        totalFlashcards,
        completedFlashcards,
        avgScore,
        weeklyUploads: formattedWeeklyUploads,
        scoreTrend: formattedScoreTrend,
        recentActivity
      },
      "Dashboard stats fetched successfully"
    )
  );
});

export {
    getDashboardStats
}