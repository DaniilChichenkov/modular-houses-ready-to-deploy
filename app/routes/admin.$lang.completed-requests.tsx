import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";

import { getSession } from "~/utils/session";
import houseRequestModel from "~/models/HouseRequest";
import {
  Form,
  NavLink,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";

//Modal
import { BetterModal } from "~/components/admin";
import useBetterModalStore from "~/stores/BetterModalStore";
import { useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import mongoose from "mongoose";

const translations = {
  email: {
    eng: "Email",
    rus: "Email",
    est: "E-post",
    nor: "E-post",
  },
  tel: {
    eng: "Phone",
    rus: "Телефон",
    est: "Telefon",
    nor: "Telefon",
  },
  date: {
    eng: "Date",
    rus: "Дата",
    est: "Kuupäev",
    nor: "Dato",
  },
  house: {
    eng: "House",
    rus: "Дом",
    est: "Maja",
    nor: "Hus",
  },
  houseFullData: {
    eng: "Complete House Details",
    rus: "Полные данные о доме",
    est: "Maja täielikud andmed",
    nor: "Fullstendige husdetaljer",
  },
  confirmCompleteRequest: {
    eng: "Are you sure you want to mark this request as completed?",
    rus: "Вы уверены, что хотите отметить этот запрос как завершённый?",
    est: "Kas olete kindel, et soovite märkida selle päringu lõpetatuks?",
    nor: "Er du sikker på at du vil markere denne forespørselen som fullført?",
  },
  confirm: {
    eng: "Yes, mark as completed",
    rus: "Да, отметить как завершённый",
    est: "Jah, märgi lõpetatuks",
    nor: "Ja, marker som fullført",
  },
  cancel: {
    eng: "Cancel",
    rus: "Отмена",
    est: "Tühista",
    nor: "Avbryt",
  },
  confirmDeleteRequest: {
    eng: "Are you sure you want to delete this request?",
    rus: "Вы уверены, что хотите удалить этот запрос?",
    est: "Kas olete kindel, et soovite selle päringu kustutada?",
    nor: "Er du sikker på at du vil slette denne forespørselen?",
  },
  confirmDelete: {
    eng: "Yes, delete request",
    rus: "Да, удалить запрос",
    est: "Jah, kustuta päring",
    nor: "Ja, slett forespørselen",
  },
  requestMarkedCompletedSuccess: {
    eng: "The request has been successfully marked as completed.",
    rus: "Запрос успешно отмечен как завершённый.",
    est: "Päring on edukalt märgitud lõpetatuks.",
    nor: "Forespørselen er blitt merket som fullført.",
  },
  requestDeletedSuccess: {
    eng: "The request has been successfully deleted.",
    rus: "Запрос успешно удалён.",
    est: "Päring on edukalt kustutatud.",
    nor: "Forespørselen er blitt slettet.",
  },
  errorOccurred: {
    eng: "An error occurred.",
    rus: "Произошла ошибка.",
    est: "Ilmnes viga.",
    nor: "Det oppstod en feil.",
  },
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  try {
    const completedRequests = await houseRequestModel
      .find({ completed: true })
      .populate("projectId", "title")
      .lean();
    if (completedRequests.length > 0) {
      const completedRequestsWithStringIds = completedRequests.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));
      return Response.json({
        success: true,
        completedRequests: completedRequestsWithStringIds,
        responseId: Date.now(),
      });
    } else {
      return Response.json({
        success: true,
        completedRequests: [],
        responseId: Date.now(),
      });
    }
  } catch (error) {
    return Response.json({
      success: false,
      errors: {
        serverSideError: true,
      },
      responseId: Date.now(),
    });
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const requestId = formData.get("requestId");
  const intent = formData.get("intent");

  //Validate form
  const formValidationErrors: Record<string, boolean> = {};

  if (!requestId || typeof requestId !== "string") {
    formValidationErrors.invalidRequestId = true;
  }

  if (!intent || typeof intent !== "string") {
    formValidationErrors.invalidIntent = true;
  }

  if (Object.keys(formValidationErrors).length > 0) {
    return Response.json({
      success: false,
      errors: formValidationErrors,
      responseId: Date.now(),
    });
  }

  //Handle "change" intent (Mark request as completed)
  if (intent === "delete") {
    try {
      await houseRequestModel.deleteOne({
        _id: new mongoose.Types.ObjectId(String(requestId)),
      });

      return Response.json({
        success: true,
        responseId: Date.now(),
        responseToIntent: "delete",
      });
    } catch (error) {
      return Response.json({
        success: false,
        errors: {
          serverSideError: true,
        },
        responseId: Date.now(),
      });
    }
  }
};

const AdminRequestItem = ({
  date,
  email,
  projectId,
  tel,
  _id,
}: {
  date: string;
  email: string;
  projectId: {
    _id: string;
    title: string;
  };
  tel?: string;
  _id: string;
}) => {
  const [searchParams] = useSearchParams();
  const { lang } = useParams();

  //Manage modal
  const setOpen = useBetterModalStore((state) => state.setOpen);
  const setInnerContent = useBetterModalStore((state) => state.setInnerContent);

  //Handle "delete" button click
  const handleDeleteButtonClick = () => {
    setInnerContent(
      <>
        <div className="w-full flex flex-col items-center justify-start p-4">
          <p className="font-normal text-xl text-center">
            {translations.confirmDeleteRequest[lang]}
          </p>
          <div className="w-full flex justify-center items-center gap-x-20 mt-10">
            <Form action={`.?${searchParams.toString()}`} method="POST">
              <input type="hidden" name="requestId" value={_id} />
              <input type="hidden" name="intent" value="delete" />
              <button
                type="submit"
                className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
              >
                {translations.confirmDelete[lang]}
              </button>
            </Form>
            <button
              onClick={() => setOpen(false)}
              className="inline-block rounded-sm border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600"
            >
              {translations.cancel[lang]}
            </button>
          </div>
        </div>
      </>,
    );
    setOpen(true);
  };

  return (
    <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg p-4 border-2 border-gray-300">
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-gray-200 text-sm">
          {/* Email */}
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">
              {translations.email[lang]}
            </dt>

            <dd className="text-gray-700 sm:col-span-2">{email}</dd>
          </div>

          {/* Tel (If provided) */}
          {tel ? (
            <>
              <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">
                  {translations.tel[lang]}
                </dt>

                <dd className="text-gray-700 sm:col-span-2">{tel}</dd>
              </div>
            </>
          ) : null}

          {/* Date */}
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">
              {translations.date[lang]}
            </dt>

            <dd className="text-gray-700 sm:col-span-2">
              {date.split("T")[0]}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">
              {translations.house[lang]}
            </dt>

            <dd className="text-gray-700 sm:col-span-2">
              <div className="flex justify-start items-center gap-x-4">
                {projectId.title}

                <NavLink
                  className="font-normal text-blue-700 underline"
                  to={`/admin/${lang}/projects/${projectId._id}/change`}
                >
                  {translations.houseFullData[lang]}
                </NavLink>
              </div>
            </dd>
          </div>

          <div className="w-full gap-1 py-3">
            <div className="w-full flex justify-end items-center">
              <button
                onClick={handleDeleteButtonClick}
                className="inline-block rounded-sm border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600"
              >
                <Trash />
              </button>
            </div>
          </div>
        </dl>
      </div>
    </article>
  );
};

const AdminCompletedRequestsRoute = () => {
  const { lang } = useParams();

  const { completedRequests, success } = useLoaderData<{
    responseId: number;
    success: boolean;
    completedRequests: {
      date: string;
      email: string;
      projectId: {
        title: string;
        _id: string;
      };
      tel?: string;
      _id: string;
    }[];
  }>();

  const actionData = useActionData<{
    success: boolean;
    responseId: number;
    errors?: Record<string, boolean>;
    responseToIntent?: string;
  }>();

  //Manage modal
  const setOpen = useBetterModalStore((state) => state.setOpen);
  const setInnerContent = useBetterModalStore((state) => state.setInnerContent);

  const responseRef = useRef<number | null>(null);
  const navigation = useNavigation();

  //Handle response
  useEffect(() => {
    if (actionData) {
      //Handle success
      if (actionData.success) {
        //Check if it is not same response
        if (actionData.responseId !== responseRef.current) {
          responseRef.current = actionData.responseId;
          setInnerContent(
            <>
              <div className="w-full flex flex-col items-center justify-start p-4">
                <p className="font-normal text-xl text-center">
                  {actionData.responseToIntent === "change"
                    ? translations.requestMarkedCompletedSuccess[lang]
                    : translations.requestDeletedSuccess[lang]}
                </p>

                <div className="w-full flex justify-center items-center mt-10">
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </>,
          );
        }
      } else {
        //Check if it is not same response
        if (actionData.responseId !== responseRef.current) {
          responseRef.current = actionData.responseId;
          setInnerContent(
            <>
              <div className="w-full flex flex-col items-center justify-start p-4">
                <p className="font-normal text-xl text-center">
                  {translations.errorOccurred[lang]}
                </p>

                <div className="w-full flex justify-center items-center mt-10">
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </>,
          );
        }
      }
    }
  }, [actionData, setInnerContent, setOpen]);

  return (
    <>
      <section className="w-full grid grid-cols-1 px-10 mt-10 relative z-0 pb-20">
        {navigation.state === "idle" ? (
          <>
            {success ? (
              <>
                {completedRequests && completedRequests.length > 0 ? (
                  <>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-10 md:gap-x-5 items-start">
                      {completedRequests.map((item) => (
                        <AdminRequestItem key={item._id} {...item} />
                      ))}
                    </div>
                  </>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <>
            <div className="text-center">
              <svg
                className="mx-auto size-8 animate-spin text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>

              <p className="mt-4 font-medium text-gray-700">Loading...</p>
            </div>
          </>
        )}
      </section>
      <BetterModal />
    </>
  );
};

export default AdminCompletedRequestsRoute;
