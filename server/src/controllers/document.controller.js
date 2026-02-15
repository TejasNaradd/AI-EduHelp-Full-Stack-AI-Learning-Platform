import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/users.model.js"
import { Document } from "../models/document.model.js"
import { generateSummaryService, processDocument } from "../services/document.services.js"

const uploadDocument=asyncHandler(async(req,res)=>{
     const {title,description}=req.body
     if(!title){
        throw new ApiError(400,"Title is needed")
     }
     const documentPath=req.file?.path
     if(!documentPath){
        throw new ApiError(400,"upload a valid file")
     }
     const uploadedFile=await uploadOnCloudinary(documentPath,"pdf")
     if(!uploadedFile){
        throw new ApiError(400,"error in uploading file")
     }
     const owner=req.user._id 
     const docDetails={}
     if(description){
        docDetails.description=description.trim()
     }
     docDetails.title=title.trim()
     docDetails.owner=owner
     docDetails.file_url=uploadedFile.url
     docDetails.file_public_id=uploadedFile.public_id
     docDetails.file_resource_type=uploadedFile.resource_type
     docDetails.file_size=uploadedFile.bytes
     docDetails.file_type=uploadedFile.format
     docDetails.status="uploaded"

     let document;
     try {
        document=await Document.create(docDetails)
        processDocument(document._id)
     } 
     catch (error) {
        await deleteFromCloudinary(uploadedFile.public_id)
        throw new ApiError(400,"Document not uploaded")
     }

     return res
     .status(200)
     .json(
        new ApiResponse(200,document,"document uploaded successfully")
     )

})

const getAllDocs=asyncHandler(async (req,res)=>{

    const userId = req.user._id;
    const {
        page = 1,
        limit = 10,
        status,
        search,
        sort = "latest"
    } = req.query;

  // Base filter: only logged-in user's documents
  const matchStage = {
    owner: userId
  };

  // Optional status filter
  if (status) {
    matchStage.status = status;
  }

  // Optional search filter
  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  // Sorting logic
  let sortStage = { createdAt: -1 }; // default latest

  if (sort === "oldest") {
    sortStage = { createdAt: 1 };
  }

  const aggregate = Document.aggregate([
    { $match: matchStage },
    { $sort: sortStage }
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit)
  };

  const documents = await Document.aggregatePaginate(aggregate, options);

  return res
  .status(200)
  .json(
    new ApiResponse(200, documents, "Documents fetched successfully")
  );
})

const getDoc=asyncHandler(async(req,res)=>{
    const {docId}=req.params
    const getDocument=await Document.findOne({
        _id:docId,
        owner:req.user._id
        })
    if(!getDocument){
        throw new ApiError(400,"file does not exist")
    }
    getDocument.progress.lastAccessed = new Date();
    await getDocument.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200,getDocument,"document fetched ")
    )
})

const deleteDoc=asyncHandler(async(req,res)=>{
    const {docId}=req.params

    const document=await Document.findOne({
        _id:docId,
        owner:req.user._id
    })

    if(!document){
        throw new ApiError(400,"document do not exist")
    }
    const filePublicId=document.file_public_id
    try {
        await Document.findByIdAndDelete(docId)
        deleteFromCloudinary(filePublicId)
    } catch (error) {
        throw new ApiError(400,"error in deleting document")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,null,"document deleted successfully")
    )
})

const updateDoc = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "No fields provided to update");
  }

  const updateFields = {};

  if (title) {
    updateFields.title = title.trim();
  }

  if (description) {
    updateFields.description = description.trim();
  }

  const updatedDocument = await Document.findOneAndUpdate(
    {
      _id: docId,
      owner: req.user._id  // security check
    },
    {
      $set: updateFields
    },
    {
      new: true,           // return updated document
      runValidators: true  // apply schema validation
    }
  );

  if (!updatedDocument) {
    throw new ApiError(404, "document does not exist");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, updatedDocument, "document updated successfully")
  );
})

const generateSummary=asyncHandler(async(req,res)=>{
    const {docId}=req.params
    const document=await Document.findOne({
        _id:docId,
        owner:req.user._id
    })
    if(!document){
        throw new ApiError(400,"document do not exist")
    }
    if(!document.text){
        throw new ApiError(400,"text not extracted from document yet")
    }
    if(document.summary){
        return res
        .status(200)
        .json(
            new ApiResponse(200,document,"summary already generated")
        )
    }

    const updatedDocument=await generateSummaryService(docId)
    return res
        .status(200)
        .json(
            new ApiResponse(200,updatedDocument,"summary generated successfully")
        )
})

const getProgress=asyncHandler(async(req,res)=>{
    const {docId}=req.params
    const document=await Document.findOne({
        _id:docId,
        owner:req.user._id
    })
    if(!document){
        throw new ApiError(400,"document do not exist")
    }

    const weakTopics=document.topics
      .filter(topic=>topic.masteryLevel<40)
      .map(topic=>({
        name: topic.name,
        masteryLevel: topic.masteryLevel
      }))

    const strongTopics=document.topics
      .filter(topic=>topic.masteryLevel>=60)
      .map(topic=>({
        name: topic.name,
        masteryLevel: topic.masteryLevel
      }))

    const progressData={
        overallScore: document.progress.overallScore,
        quizzesTaken: document.progress.quizzesTaken,
        flashcardsCompleted: document.progress.flashcardsCompleted,
        lastAccessed: document.progress.lastAccessed,
        weakTopics,
        strongTopics,
    }
      
    return res
    .status(200)
    .json(
        new ApiResponse(200,progressData,"progress fetched successfully")
    )
}) 

export {
    uploadDocument,
    getAllDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    generateSummary,
    getProgress,
}