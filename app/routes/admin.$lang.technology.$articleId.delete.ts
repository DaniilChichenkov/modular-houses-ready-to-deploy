import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";

import { getSession } from "~/utils/session";

import path from "path";
import fs from "fs/promises";

import technologyModel from "~/models/Technology";

export const action: ActionFunction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //Get article id
  const { articleId } = params;

  if (!articleId) {
    return json({ msg: "No project provided", success: false });
  }

  try {
    //Delete article from db
    await technologyModel.deleteOne({ _id: articleId });

    //Delete folder of an article
    const articleDirPath = path.join(
      process.cwd(),
      "public",
      "technology",
      `${articleId}`
    );

    await fs.rm(articleDirPath, { recursive: true, force: true });

    return json({ msg: "Article was removed", success: true });
  } catch (error) {
    return json({ msg: error, success: false });
  }
};
