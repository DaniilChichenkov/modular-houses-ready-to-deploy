import mongoose from "mongoose";
const { Schema } = mongoose;

const TechnologyScema = new Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  imagesFolder: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const technologyModel = mongoose.model("Technology", TechnologyScema);

export default technologyModel;
