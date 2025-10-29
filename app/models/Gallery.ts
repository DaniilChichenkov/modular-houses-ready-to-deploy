import mongoose from "mongoose";
const { Schema } = mongoose;

const GallerySchema = new Schema({
  title: { type: String, required: true, unique: true },
  imagesFolder: { type: String },
});

const galleryModel = mongoose.model("Gallery", GallerySchema);

export default galleryModel;
