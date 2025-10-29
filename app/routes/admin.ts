import {
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { getSession } from "~/utils/session";

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //Check url
  const url = new URL(request.url);
  const pathName = url.pathname;

  if (pathName === "/admin") {
    return redirect(`/admin/${params.lang ?? "eng"}`);
  }

  return json(null);
};
