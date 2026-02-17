import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useSearchParams,
  useActionData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import feedbackModel from "~/models/Feedback";
import { getSession } from "~/utils/session";
import { Trash, CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";

//Modal
import { BetterModal } from "~/components/admin";
import useBetterModalStore from "~/stores/BetterModalStore";
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
  feedbackMarkedReadSuccess: {
    eng: "Feedback has been successfully marked as read.",
    rus: "Сообщение обратной связи успешно отмечено как прочитанное.",
    est: "Tagasiside on edukalt märgitud loetuks.",
    nor: "Tilbakemeldingen er blitt merket som lest.",
  },
  feedbackDeletedSuccess: {
    eng: "Feedback has been successfully deleted.",
    rus: "Сообщение обратной связи успешно удалено.",
    est: "Tagasiside on edukalt kustutatud.",
    nor: "Tilbakemeldingen er blitt slettet.",
  },
  errorOccurred: {
    eng: "An error occurred.",
    rus: "Произошла ошибка.",
    est: "Ilmnes viga.",
    nor: "Det oppstod en feil.",
  },
  confirmDeleteFeedback: {
    eng: "Are you sure you want to delete this feedback?",
    rus: "Вы уверены, что хотите удалить это сообщение обратной связи?",
    est: "Kas olete kindel, et soovite selle tagasiside kustutada?",
    nor: "Er du sikker på at du vil slette denne tilbakemeldingen?",
  },
  confirmDelete: {
    eng: "Yes, delete",
    rus: "Да, удалить",
    est: "Jah, kustuta",
    nor: "Ja, slett",
  },
  cancel: {
    eng: "Cancel",
    rus: "Отмена",
    est: "Tühista",
    nor: "Avbryt",
  },
  message: {
    eng: "Message",
    rus: "Сообщение",
    est: "Sõnum",
    nor: "Melding",
  },
  confirmMarkFeedbackRead: {
    eng: "Are you sure you want to mark this feedback as read?",
    rus: "Вы уверены, что хотите отметить это сообщение обратной связи как прочитанное?",
    est: "Kas olete kindel, et soovite märkida selle tagasiside loetuks?",
    nor: "Er du sikker på at du vil markere denne tilbakemeldingen som lest?",
  },
  yes: {
    eng: "Yes",
    rus: "Да",
    est: "Jah",
    nor: "Ja",
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
    const feedbacks = await feedbackModel.find({ red: false }).lean();
    if (feedbacks.length > 0) {
      const feedbacksWithStringIds = feedbacks.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));

      return Response.json({
        success: true,
        unredFeedbacks: feedbacksWithStringIds,
        responseId: Date.now(),
      });
    } else {
      return Response.json({
        success: true,
        unredFeedbacks: [],
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
  const feedbackId = formData.get("feedbackId");
  const intent = formData.get("intent");

  //Validate form
  const formValidationErrors: Record<string, boolean> = {};

  if (!feedbackId || typeof feedbackId !== "string") {
    formValidationErrors.invalidfeedbackId = true;
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

  if (intent === "change") {
    try {
      await feedbackModel.updateOne(
        { _id: new mongoose.Types.ObjectId(String(feedbackId)) },
        { red: true },
      );

      return Response.json({
        success: true,
        responseToIntent: "change",
        responseId: Date.now(),
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
  } else if (intent === "delete") {
    try {
      await feedbackModel.deleteOne({
        _id: new mongoose.Types.ObjectId(String(feedbackId)),
      });

      return Response.json({
        success: true,
        responseToIntent: "delete",
        responseId: Date.now(),
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

const AdminFeedbackItem = ({
  _id,
  email,
  message,
  date,
}: {
  _id: string;
  email: string;
  date: string;
  message: string;
}) => {
  const [searchParams] = useSearchParams();

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Manage modal
  const setOpen = useBetterModalStore((state) => state.setOpen);
  const setInnerContent = useBetterModalStore((state) => state.setInnerContent);

  //Handle "complete" button click
  const handleCompleteButtonClick = () => {
    setInnerContent(
      <>
        <div className="w-full flex flex-col items-center justify-start p-4">
          <p className="font-normal text-xl text-center">
            {translations.confirmMarkFeedbackRead[lang!]}
          </p>
          <div className="w-full flex justify-center items-center gap-x-20 mt-10">
            <Form action={`.?${searchParams.toString()}`} method="POST">
              <input type="hidden" name="feedbackId" value={_id} />
              <input type="hidden" name="intent" value="change" />
              <button
                type="submit"
                className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
              >
                {translations.yes[lang!]}
              </button>
            </Form>
            <button
              onClick={() => setOpen(false)}
              className="inline-block rounded-sm border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600"
            >
              {translations.cancel[lang!]}
            </button>
          </div>
        </div>
      </>,
    );
    setOpen(true);
  };

  //Handle "delete" button click
  const handleDeleteButtonClick = () => {
    setInnerContent(
      <>
        <div className="w-full flex flex-col items-center justify-start p-4">
          <p className="font-normal text-xl text-center">
            {translations.confirmDeleteFeedback[lang!]}
          </p>
          <div className="w-full flex justify-center items-center gap-x-20 mt-10">
            <Form action={`.?${searchParams.toString()}`} method="POST">
              <input type="hidden" name="feedbackId" value={_id} />
              <input type="hidden" name="intent" value="delete" />
              <button
                type="submit"
                className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
              >
                {translations.confirmDelete[lang!]}
              </button>
            </Form>
            <button
              onClick={() => setOpen(false)}
              className="inline-block rounded-sm border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600"
            >
              {translations.cancel[lang!]}
            </button>
          </div>
        </div>
      </>,
    );
    setOpen(true);
  };

  return (
    <article className="border-2 border-gray-300 overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg p-4">
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-gray-200 text-sm">
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">
              {translations.email[lang!]}
            </dt>

            <dd className="text-gray-700 sm:col-span-2">{email}</dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">
              {translations.date[lang!]}
            </dt>

            <dd className="text-gray-700 sm:col-span-2">
              {date.split("T")[0]}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">
              {translations.message[lang!]}
            </dt>

            <dd className="text-gray-700 sm:col-span-2 whitespace-pre">
              {message}
            </dd>
          </div>

          <div className="w-full flex justify-between items-center py-5">
            <button
              className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
              onClick={handleCompleteButtonClick}
            >
              <CircleCheck />
            </button>
            <button
              className="inline-block rounded-sm border border-red-600 bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600"
              onClick={handleDeleteButtonClick}
            >
              <Trash />
            </button>
          </div>
        </dl>
      </div>
    </article>
  );
};

const AdminFeedbackUnred = () => {
  const loaderData = useLoaderData<{
    success: boolean;
    errors?: Record<string, boolean>;
    unredFeedbacks: {
      _id: string;
      email: string;
      date: string;
      message: string;
    }[];
    responseId: number;
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

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

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
                    ? translations.feedbackMarkedReadSuccess[lang!]
                    : translations.feedbackDeletedSuccess[lang!]}
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
                  {translations.errorOccurred[lang!]}
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-10 md:gap-x-5 items-start">
          {navigation.state === "idle" ? (
            <>
              {loaderData &&
              loaderData.unredFeedbacks &&
              loaderData.unredFeedbacks.length ? (
                <>
                  {loaderData.unredFeedbacks.map((item) => (
                    <AdminFeedbackItem key={item._id} {...item} />
                  ))}
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
        </div>
      </section>
      <BetterModal />
    </>
  );
};

export default AdminFeedbackUnred;
