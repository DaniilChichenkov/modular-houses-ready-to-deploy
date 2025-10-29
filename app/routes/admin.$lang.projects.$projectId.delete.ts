import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import fs from "fs/promises";
import path from "path";

import { getSession } from "~/utils/session";
import projectModel from "~/models/Project";

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

  //Get project id
  const { projectId } = params;

  if (!projectId) {
    return json({ msg: "No project provided", success: false });
  }

  try {
    //Delete project from db
    await projectModel.deleteOne({ _id: projectId });

    //Delete folder of a project
    const projectDirPath = path.join(
      process.cwd(),
      "public",
      "projects",
      `${projectId}`
    );

    await fs.rm(projectDirPath, { recursive: true, force: true });

    return json({ msg: "Project was removed", success: true });
  } catch (error) {
    return json({ msg: error, success: false });
  }
};
