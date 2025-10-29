import mongoose from "mongoose";
const { Schema } = mongoose;

const MemberSchema = new Schema({
  name: { type: String, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  languages: { type: String, required: true },
});

const memberModel = mongoose.model("Member", MemberSchema);

export default memberModel;
