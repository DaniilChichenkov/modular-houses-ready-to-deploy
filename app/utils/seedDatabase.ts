import businessInfoModel from "../models/BusinessInfo";
import { connectToDB } from "./db";

// //This will be an independent script which will run after build
// //And will place some default data into database
async function seedInitialData() {
  try {
    await connectToDB();

    const existingModel = await businessInfoModel.findOne({
      id: "businessInfoData",
    });

    if (!existingModel) {
      await businessInfoModel.create({
        id: "businessInfoData",
        addressToDisplayInFrame: {
          country: "",
          city: "",
          street: "",
          houseNumber: "",
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export default seedInitialData;
