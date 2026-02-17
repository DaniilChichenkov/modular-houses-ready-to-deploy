import mongoose from "mongoose";
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  red: {
    type: Boolean,
    default: false,
  },
});

const feedbackModel = mongoose.model("Feedback", FeedbackSchema);
export default feedbackModel;
