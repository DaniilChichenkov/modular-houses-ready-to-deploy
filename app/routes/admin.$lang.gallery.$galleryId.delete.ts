import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import fs from "fs/promises";
import path from "path";

import { getSession } from "~/utils/session";
import galleryModel from "~/models/Gallery";

export const action: ActionFunction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //Get gallery id
  const { galleryId } = params;

  if (!galleryId) {
    return json({ msg: "No project provided", success: false });
  }

  try {
    //Delete gallery from db
    await galleryModel.deleteOne({ _id: galleryId });

    //Delete folder of a project
    const galleryDirPath = path.join(
      process.cwd(),
      "public",
      "gallery",
      `${galleryId}`
    );

    await fs.rm(galleryDirPath, { recursive: true, force: true });

    return json({ msg: "Gallery was removed", success: true });
  } catch (error) {
    return json({ msg: error, success: false });
  }
};
