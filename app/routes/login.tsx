import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import verifyPassword from "~/utils/verifyPassword";
import { getSession, commitSession } from "~/utils/session";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Get form data
  const formData = await request.formData();
  const username = formData.get("username")?.toString();
  const userpassword = formData.get("pass")?.toString();

  //If not all credentials are provided
  if (!username || !userpassword) {
    return json({
      errorMsg: "Not all credentials provided",
      fields: {
        username: Boolean(username),
        userpassword: Boolean(userpassword),
      },
    });
  }

  //Verify password
  if (!(await verifyPassword(username, userpassword))) {
    return json({ errorMsg: "Wrong password" });
  }

  //Set http cookies and redirect user
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  session.set("isAdmin", true);

  //Grant user access to the admin`s dashboard
  return redirect("/admin/eng", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const LogInRoute = () => {
  const actionData = useActionData<{
    errorMsg?: string;
    fields?: {
      username?: boolean;
      userpassword?: boolean;
    };
  }>();

  return (
    <section id="projects" className="py-10">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        You need to Log In
      </h2>

      {/* Form and inputs */}
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <Form
          action="/login"
          method="post"
          className="flex flex-col items-center gap-y-8"
        >
          {/* Username input */}
          <label htmlFor="username">
            <span className="text-sm font-medium text-gray-700">
              {" "}
              Username{" "}
            </span>

            <input
              type="text"
              id="username"
              name="username"
              className="mt-0.5 w-full rounded border-gray-300 pe-10 py-2 shadow-sm sm:text-sm shadow-gray-600 pl-2"
            />

            {/* Username input error msg */}
            {actionData &&
              !actionData.fields?.username &&
              actionData.fields?.username !== undefined && (
                <p className="text-sm font-normal text-red-600 mt-1">
                  Username is not provided
                </p>
              )}
          </label>

          {/* Password input */}
          <label htmlFor="pass">
            <span className="text-sm font-medium text-gray-700">
              {" "}
              Password{" "}
            </span>

            <input
              type="password"
              id="pass"
              name="pass"
              className="mt-0.5 w-full rounded border-gray-300 pe-10 py-2 shadow-sm sm:text-sm shadow-gray-600 pl-2"
            />

            {/* Password input error msg */}
            {actionData &&
              !actionData.fields?.userpassword &&
              actionData.fields?.userpassword !== undefined && (
                <p className="text-sm font-normal text-red-600 mt-1">
                  Userpassword is not provided
                </p>
              )}
          </label>

          <button className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden">
            Continue
          </button>
        </Form>
      </div>
    </section>
  );
};

export default LogInRoute;
