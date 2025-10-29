import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";

import { getSession } from "~/utils/session";
import memberModel from "~/models/Member";

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

  //Get member id
  const { contactId } = params;

  if (!contactId) {
    return json({ msg: "No member id provided", success: false });
  }

  try {
    //Delete member from db
    await memberModel.deleteOne({ _id: contactId });

    return json({ msg: "member was removed", success: true });
  } catch (error) {
    return json({ msg: error, success: false });
  }
};
