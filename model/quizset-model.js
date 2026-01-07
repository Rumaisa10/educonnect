import mongoose, { Schema } from "mongoose";

const quizsetSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  mark: {
    type: Number,
  },
  slug: {
    type: String,
  },
  active: {
    required: true,
    default: false,
    type: Boolean,
  },
  quizIds: [{ type: Schema.ObjectId, ref: "Quiz" }],
});

export const Quizset =
  mongoose.models.Quizset || mongoose.model("Quizset", quizsetSchema);
