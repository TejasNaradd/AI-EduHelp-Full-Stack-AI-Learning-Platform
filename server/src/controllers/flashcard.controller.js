import { Document } from "../models/document.model.js";
import { FlashCard } from "../models/flashcard.model.js";
import { generateFlashcardsAI } from "../services/ai.services.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const getDifficulty = (masteryLevel) => {
    if (masteryLevel <= 40) return "easy"
    if (masteryLevel <= 70) return "medium"
    return "hard"
}

const generateFlashCards = asyncHandler(async (req, res) => {

    const { docId } = req.params

    const document = await Document.findOne({
        _id: docId,
        owner: req.user._id
    })

    if (!document) {
        throw new ApiError(404, "Document does not exist")
    }

    if (!document.topics || document.topics.length === 0) {
        throw new ApiError(400, "No topics available to generate flashcards")
    }

    const newSetId = new mongoose.Types.ObjectId()

    const aiCards=await generateFlashcardsAI(document.text,document.topics)

    const flashCardData = aiCards.map(card => ({
    owner: req.user._id,
    document: docId,
    setId: newSetId,
    question: card.question,
    answer: card.answer,
    difficulty: getDifficulty(50),
    topic: card.topic
  }))
    await FlashCard.insertMany(flashCardData)

    return res.status(201).json(
        new ApiResponse(201, {
            setId: newSetId,
            totalCards: flashCardData.length
        }, "Flashcard set generated successfully")
    )
})

const getDocumentFlashCards = asyncHandler(async (req, res) => {

    const { docId } = req.params

    const document = await Document.findOne({
        _id: docId,
        owner: req.user._id
    })

    if (!document) {
        throw new ApiError(404, "Document not found")
    }

    const sets = await FlashCard.aggregate([
        {
            $match: {
                document: new mongoose.Types.ObjectId(docId),
                owner: req.user._id
            }
        },
        {
            $group: {
                _id: "$setId",
                totalCards: { $sum: 1 },
                reviewedCards: {
                    $sum: { $cond: ["$reviewed", 1, 0] }
                },
                createdAt: { $first: "$createdAt" }
            }
        },
        {
            $addFields: {
                progress: {
                    $cond: [
                        { $eq: ["$totalCards", 0] },
                        0,
                        {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: ["$reviewedCards", "$totalCards"] },
                                        100
                                    ]
                                },
                                0
                            ]
                        }
                    ]
                }
            }
        },
        { $sort: { createdAt: -1 } }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                documentId: docId,
                totalSets: sets.length,
                sets
            },
            "Flashcard sets fetched successfully"
        )
    )
})

const openFlashCard=asyncHandler(async(req,res)=>{
    const {docId,setId}=req.params

    const document=await Document.findOne({
        _id:docId,
        owner:req.user._id
    })
    if(!document){
        throw new ApiError(404,"Document not found")
    }

    const cards=await FlashCard.find({
        document:docId,
        setId:setId,
        owner:req.user._id
    }).sort({createdAt:-1})

    if(!cards.length){
        throw new ApiError(404,"Flashcard set not found")
    }

    const totalCards=cards.length
    const reviewedCards=cards.filter(card=>card.reviewed).length

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                setId,
                totalCards,
                reviewedCards,
                progress: totalCards?Math.round((reviewedCards/totalCards)*100):0,
                cards
            },
            "FlashCard opened successfully"
        )
    )
})

const deleteFlashCard=asyncHandler(async(req,res)=>{
    const {docId,setId}=req.params
    const document=await Document.findOne({
        _id:docId,
        owner:req.user._id
    })
    if(!document){
        throw new ApiError(404,"Document not found")        
    }
    const result=await FlashCard.deleteMany({
        document:docId,
        setId:setId,
        owner:req.user._id
    })

    if(result.deletedCount===0){
        throw new ApiError(404,"Flashcard set not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                deletedCount:result.deletedCount
            },
            "Flashcard set deleted succeesfully"
        )
    )
})

// const getAllFlashCards=asyncHandler(async(req,res)=>{
//         const sets = await FlashCard.aggregate([
//         {
//             $match: {
//                 owner: req.user._id
//             }
//         },
//         {
//             $group: {
//                 _id: "$setId",
//                 document: { $first: "$document" },
//                 totalCards: { $sum: 1 },
//                 reviewedCards: {
//                     $sum: { $cond: ["$reviewed", 1, 0] }
//                 },
//                 createdAt: { $first: "$createdAt" }
//             }
//         },
//         {
//             $addFields: {
//                 progress: {
//                     $cond: [
//                         { $eq: ["$totalCards", 0] },
//                         0,
//                         {
//                             $round: [
//                                 {
//                                     $multiply: [
//                                         { $divide: ["$reviewedCards", "$totalCards"] },
//                                         100
//                                     ]
//                                 },
//                                 0
//                             ]
//                         }
//                     ]
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: 0,
//                 setId: "$_id",
//                 document: {
//                     _id: "$document._id",
//                     title: "$document.title"
//                 },
//                 totalCards: 1,
//                 reviewedCards: 1,
//                 progress: 1,
//                 createdAt: 1
//             }
//         },
//         { $sort: { createdAt: -1 } }
//     ])

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             {
//                 totalSets: sets.length,
//                 sets
//             },
//             "All flashcard sets fetched successfully"
//         )
//     )
// })

const getAllFlashCards = asyncHandler(async(req,res)=>{

    const sets = await FlashCard.aggregate([

        {
            $match: {
                owner: req.user._id
            }
        },

        {
            $group: {
                _id: "$setId",
                document: { $first: "$document" },
                totalCards: { $sum: 1 },
                reviewedCards: {
                    $sum: { $cond: ["$reviewed", 1, 0] }
                },
                createdAt: { $first: "$createdAt" }
            }
        },

        /* NEW PART - GET DOCUMENT TITLE */

        {
            $lookup: {
                from: "documents",
                localField: "document",
                foreignField: "_id",
                as: "documentData"
            }
        },

        {
            $unwind: "$documentData"
        },

        {
            $addFields: {
                progress: {
                    $cond: [
                        { $eq: ["$totalCards", 0] },
                        0,
                        {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: ["$reviewedCards", "$totalCards"] },
                                        100
                                    ]
                                },
                                0
                            ]
                        }
                    ]
                }
            }
        },

        {
            $project: {
                _id: 0,
                setId: "$_id",
                totalCards: 1,
                reviewedCards: 1,
                progress: 1,
                createdAt: 1,

                document: {
                    _id: "$documentData._id",
                    title: "$documentData.title"
                }
            }
        },

        { $sort: { createdAt: -1 } }

    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalSets: sets.length,
                sets
            },
            "All flashcard sets fetched successfully"
        )
    )
})

const markCardReviewed = asyncHandler(async (req,res)=>{

    const { cardId } = req.params

    const card = await FlashCard.findOneAndUpdate(
        {
            _id: cardId,
            owner: req.user._id
        },
        {
            reviewed: true
        },
        {
            new: true
        }
    )

    if(!card){
        throw new ApiError(404,"Flashcard not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            card,
            "Flashcard marked as reviewed"
        )
    )
})


export {
    generateFlashCards,
    getDocumentFlashCards,
    openFlashCard,
    deleteFlashCard,
    getAllFlashCards,
    markCardReviewed
    
}