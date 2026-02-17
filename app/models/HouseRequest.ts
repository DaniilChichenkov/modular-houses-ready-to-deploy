import mongoose from "mongoose";
const { Schema } = mongoose;

const HouseRequestSchema = new Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  tel: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const houseRequestModel = mongoose.model("HouseRequest", HouseRequestSchema);

export default houseRequestModel;
