import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  numberOfRooms: { type: Number, required: true },
  floors: { type: Number, required: true },
  quickDesc: { type: String, required: true },
  fullDesc: { type: String, required: true },
  featuresList: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
  isDiscount: { type: Boolean, default: false },
  newPrice: { type: Number, default: null },
  imagesFolder: { type: String },
});

const projectModel = mongoose.model("Project", ProjectSchema);

export default projectModel;
