import mongoose,{Schema} from "mongoose";

const quizSchema=new Schema({
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
    },
    totalQuestions:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["processing","completed","failed"],
        default:"processing",
        index:true
    }
},{timestamps:true})

export const Quiz=mongoose.model("Quiz",quizSchema)