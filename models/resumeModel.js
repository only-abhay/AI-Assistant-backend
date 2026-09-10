import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
);

const resumeQuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    questions: {
      type: [questionSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ResumeQuestionModel = mongoose.model(
  "ResumeQuestion",
  resumeQuestionSchema
);

export default ResumeQuestionModel;