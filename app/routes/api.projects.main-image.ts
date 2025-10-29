import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";

//Get main image of a project from its folder
export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const folderName = url.searchParams.get("folder");

  if (!folderName) {
    return new Response("No image folder provided");
  }

  //Create path to image
  const imageFolderPath = path.join(
    process.cwd(),
    "public",
    "projects",
    folderName,
    "main_image"
  );

  //Read dir to find image name
  try {
    const fileName = await fs.readdir(imageFolderPath);

    //Since there always will be only 1 file - get name of the first one
    if (!fileName[0]) {
      throw new Error("No file was found");
    }

    //Redirect to get image
    return redirect(`/projects/${folderName}/main_image/${fileName[0]}`);
  } catch (error) {
    return new Response("Error while reading dir");
  }
};
