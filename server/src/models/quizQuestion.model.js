import mongoose ,{Schema} from "mongoose"

const quizQuestionSchema=new Schema({
    quiz:{
        type:Schema.Types.ObjectId,
        ref:"Quiz",
        required:true,
        index:true
    },
    question:{
        type:String,
        required:true,
    },
    options:[
        {
        type:String,
        required:true,
        }
    ],
    correctAnswerIndex:{
        type:Number,
        required:true,
        default:0
    },
    topic:{
        type:String,
        index:true
    }
},{timestamps:true})

export const Question=mongoose.model("Question",quizQuestionSchema)