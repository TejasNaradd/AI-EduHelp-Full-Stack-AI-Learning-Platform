import mongoose, { Schema } from "mongoose";

const attemptSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestion: {
      type: Number,
      required: true,
    },
    weakTopic: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const Attempt = mongoose.model("Attempt", attemptSchema);
