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
        businessTitle: "Kuber",
        physicalAddressArr: [
          { value: "Tallinn 8-133", id: crypto.randomUUID() },
        ],
        phoneNumbersArr: [{ value: "123123123", id: crypto.randomUUID() }],
        emailsArr: [{ value: "ahuet6@email.example", id: crypto.randomUUID() }],
        addressToDisplayInFrame: {
          country: "Estonia",
          city: "Narva",
          street: "Madise",
          houseNumber: "6",
        },
      });
    }

    console.log("Already created");
  } catch (error) {
    console.log(error);
  }
}

export default seedInitialData;
