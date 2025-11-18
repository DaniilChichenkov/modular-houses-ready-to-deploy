import mongoose from "mongoose";
const { Schema } = mongoose;

import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: String,
  password: String,
});

//Hash password before saving in DB
userSchema.pre("save", async function (next) {
  //Create salt
  const saltRounds = 12;

  //Hash pass
  const hash = await bcrypt.hash(this.password!, saltRounds);

  //Store hashed pass in db
  if (hash) {
    this.password = hash;
  }

  //Continue process
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
