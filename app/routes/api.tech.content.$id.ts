import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { connectToDB } from "~/utils/db";
import technologyModel from "~/models/Technology";
import mongoose from "mongoose";

//I think for now I will only get tech titles and first tech article from this route
export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const { id } = params;

  try {
    connectToDB();

    const articleContent = await technologyModel.findOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { content: 1 }
    );

    if (!articleContent) {
      return json({ success: false, msg: "noArticleFound" });
    }

    return json(articleContent);
  } catch (error) {
    return json({ success: false, error });
  }
};
