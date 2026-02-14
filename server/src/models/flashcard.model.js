import mongoose ,{Schema} from "mongoose"

const flashCardSchema=new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true,
    },
    document:{
        type:Schema.Types.ObjectId,
        ref:"Document",
        required:true,
        index:true
    },
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        default:"medium"
    },
    topic:{
        type:String,
        required:true
    }

},{timestamps:true})

export const FlashCard=mongoose.model("FlashCard",flashCardSchema)