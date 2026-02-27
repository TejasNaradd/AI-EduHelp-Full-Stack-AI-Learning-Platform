import { ChatMsg } from "../models/chatMessage.model.js";
import { ChatSession } from "../models/chatSession.model.js";
import { Document } from "../models/document.model.js";
import { generateAiResponse } from "../services/ai.services.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const openChat = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const document = await Document.findOne({
    _id: docId,
    owner: req.user._id,
  });

  if (!document) {
    throw new ApiError(400, "No such document exist or unauthrized access");
  }

  const chatSession = await ChatSession.findOne({
    owner: req.user._id,
    document: docId,
  });

  if (!chatSession) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          chatSession: null,
          messages: [],
        },
        "No previous chat found"
      )
    );
  }
  const messages = await ChatMsg.find({
    chatSession: chatSession._id,
  }).sort({ order: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        chatSession,
        messages,
      },
      "Messages fetched successfully"
    )
  );
})

const sendMessages = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const { message } = req.body;
  if (!message || !message.trim()) {
    throw new ApiError(400, "Message cant be empty");
  }
  const document = await Document.findOne({
    _id: docId,
    owner: req.user._id,
  });
  if (!document) {
    throw new ApiError(400, "doc do not exist or unauthorized access");
  }

  let chatSession = await ChatSession.findOne({
    owner: req.user._id,
    document: docId,
  });
  let isNewSession = false;

  if (!chatSession) {
    chatSession = await ChatSession.create({
      owner: req.user._id,
      document: docId,
      title: document.title,
    });

    isNewSession = true;
  }

  const lastMessage = await ChatMsg.findOne({
    chatSession: chatSession._id,
  }).sort({ order: -1 });

  let nextOrder = lastMessage ? lastMessage.order + 1 : 1;

  if (isNewSession) {
    await ChatMsg.create({
      chatSession: chatSession._id,
      role: "assistant",
      content:
        "👋 Welcome to EduHelp! I’m here to help you understand your document. Ask me anything about it.",
      order: nextOrder,
    });
    nextOrder += 1;
  }
  await ChatMsg.create({
    chatSession: chatSession._id,
    role: "user",
    content: message,
    order: nextOrder,
  });
  nextOrder += 1;
  const recentMessages = await ChatMsg.find({
    chatSession: chatSession._id,
  })
    .sort({ order: -1 })
    .limit(10);
  const formattedMessages = recentMessages.reverse().map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const aiReply = await generateAiResponse(document.text, formattedMessages);
  await ChatMsg.create({
    chatSession: chatSession._id,
    role: "assistant",
    content: aiReply,
    order: nextOrder,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reply: aiReply,
      },
      "message sent successfully"
    )
  );
})

const deleteChat=asyncHandler(async(req,res)=>{
    const {docId}=req.params
    const document=await Document.findOne({
        _id:docId,
        owner:req.user._id
    })
    if(!document){
        throw new ApiError(400,"unauthorized or doc do not exits")
    }
    const chatSession=await ChatSession.findOne({
        document:docId,
        owner:req.user._id
    })
    if(!chatSession){
        return res 
        .status(200)
        .json(
            new ApiResponse(200,null,"no chat to delete")
        )
    }
    await ChatMsg.deleteMany({
        chatSession:chatSession._id
    })
    await ChatSession.deleteOne({
        _id:chatSession._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,null,"chat deleted successfully")
    )
})

export { 
    openChat, 
    sendMessages,
    deleteChat
}
