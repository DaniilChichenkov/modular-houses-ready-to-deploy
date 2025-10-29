import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/utils/session";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  // Destroy the session
  return redirect("/admin", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
