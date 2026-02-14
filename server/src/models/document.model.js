import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const documentSchema=new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
                trim:true
    },
    file_url:{
        type:String,
        required:true
    },
    file_public_id:{
        type:String,
                required:true
    },
    file_resource_type:{
        type:String,
        default:"raw"
    },
    file_size: Number,
    file_type: String,
    pages: Number,

    summary:{
        type:String,
    },

    topics: [
      {
        name: {
          type: String,
          required: true,
        },
        masteryLevel: {
          type: Number,
          default: 0, 
        },
      },
    ],    
    status: {
      type: String,
      index:true,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },    
    progress: {
      overallScore: {
        type: Number,
        default: 0,
      },

      quizzesTaken: {
        type: Number,
        default: 0,
      },

      flashcardsCompleted: {
        type: Number,
        default: 0,
      },

      lastAccessed: Date,
    },
},{timestamps:true})


documentSchema.plugin(mongooseAggregatePaginate)

export const Document=mongoose.model("Document",documentSchema)