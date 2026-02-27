import mongoose,{Schema} from "mongoose";

const chatMsgSchema=new Schema({
    chatSession:{
        type:Schema.Types.ObjectId,
        ref:"ChatSession",
        required:true,
        index:true
    },
    content:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        enum:["user","assistant"],
        required:true
    },
    order:{
        type:Number,
        required:true
    },

},{timestamps:true})

export const ChatMsg=mongoose.model("ChatMsg",chatMsgSchema)