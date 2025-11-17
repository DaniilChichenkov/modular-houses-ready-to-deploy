import mongoose from "mongoose";
const { Schema } = mongoose;

const BusinessInfoSchema = new Schema({
  id: { type: String, required: true, unique: true },
  businessTitle: { type: String },
  physicalAddressArr: {
    type: [
      {
        value: String,
        id: String,
        _id: false,
      },
    ],
  },
  phoneNumbersArr: {
    type: [
      {
        value: String,
        id: String,
        _id: false,
      },
    ],
  },
  emailsArr: {
    type: [
      {
        value: String,
        id: String,
        _id: false,
      },
    ],
  },
  addressToDisplayInFrame: {
    type: {
      country: String,
      city: String,
      street: String,
      houseNumber: String,
      _id: false,
    },
  },
});

const businessInfoModel = mongoose.model("BusinessInfo", BusinessInfoSchema);

export default businessInfoModel;
