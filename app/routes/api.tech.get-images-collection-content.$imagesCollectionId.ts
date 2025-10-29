import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/node";

import fs from "fs/promises";
import path from "path";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  //Get id from request
  const { imagesCollectionId } = params;

  //If no id was provided
  if (!imagesCollectionId)
    return json({ success: false, msg: "noImagesCollectionIdProvided" });

  //Make a path to a folder containing images
  const pathToImagesCollectionFolder = path.join(
    process.cwd(),
    "public",
    "technology",
    imagesCollectionId
  );

  try {
    //Read folder
    const files = await fs.readdir(pathToImagesCollectionFolder, {
      recursive: true,
    });

    //Filter output to get only .jpg and .png files
    const filteredFiles = files.filter(
      (item) => item.endsWith(".png") || item.endsWith(".jpg")
    );

    //Build path to static assets for frontend to use
    const filesForFrontend = filteredFiles.map((item) => {
      return `/technology/${imagesCollectionId}/${item}`;
    });

    return json({
      success: true,
      files: filesForFrontend,
    });
  } catch (error) {
    return json({ success: false, msg: "errorWhileReadingImagesDir" });
  }
};
