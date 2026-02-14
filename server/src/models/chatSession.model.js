import mongoose,{Schema} from "mongoose";

const chatSessionSchema=new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    document:{
        type:Schema.Types.ObjectId,
        ref:"Document",
        required:true,
        index:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})

export const ChatSession=mongoose.model("ChatSession",chatSessionSchema)