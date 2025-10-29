import { json, LoaderFunction } from "@remix-run/node";
import { connectToDB } from "~/utils/db";
import technologyModel from "~/models/Technology";

//I think for now I will only get tech titles and first tech article from this route
export const loader: LoaderFunction = async () => {
  try {
    await connectToDB();

    //Get all titles
    const techArticles = await technologyModel.find({}, { title: 1 }).lean();

    //If no articles exists yet
    if (!techArticles.length) {
      return json({
        msg: "noArticlesFound",
      });
    }

    return json(techArticles);
  } catch (error) {
    return json({
      success: false,
      error,
    });
  }
};
