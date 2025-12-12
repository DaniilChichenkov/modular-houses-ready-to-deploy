import {
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { useLoaderData, Link, useFetcher, useParams } from "@remix-run/react";
import { useEffect } from "react";

import { getSession } from "~/utils/session";
import { connectToDB } from "~/utils/db";
import memberModel from "~/models/Member";

import useAdminDialogueModalStore from "~/stores/AdminDialogueModalStore";

const translations = {
  change: {
    eng: "Change",
    rus: "Изменить",
    est: "Muuda",
    nor: "Endre",
  },
  delete: {
    eng: "Delete",
    rus: "Удалить",
    est: "Kustuta",
    nor: "Slett",
  },
  deleting: {
    eng: "Deleting",
    rus: "Удаление",
    est: "Kustutamine",
    nor: "Sletter",
  },
  confirmDelete: {
    eng: "Are you sure you want to delete?",
    rus: "Вы уверены, что хотите удалить?",
    est: "Oled sa kindel, et soovid kustutada?",
    nor: "Er du sikker på at du vil slette?",
  },
  irreversibleAction: {
    eng: "This action cannot be undone",
    rus: "Это действие нельзя отменить",
    est: "Seda toimingut ei saa tagasi võtta",
    nor: "Denne handlingen kan ikke angres",
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

  //Get members
  try {
    await connectToDB();
    const members = await memberModel
      .find(
        {},
        {
          name: 1,
          position: 1,
          _id: 1,
        }
      )
      .lean();

    //Transform _id into string
    const transformedMembers = members.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return {
      success: true,
      members: transformedMembers,
    };
  } catch (error) {
    return json({ success: false });
  }
};

const AdminContactsRoute = () => {
  const fetcher = useFetcher();
  const loaderData = useLoaderData<{
    success: boolean;
    members?: { name: string; _id: string; position: string }[];
  }>();

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Modal store
  const isModalOpen = useAdminDialogueModalStore((state) => state.isModalOpen);
  const toggleModal = useAdminDialogueModalStore((state) => state.toggleModal);
  const setModalTitleContent = useAdminDialogueModalStore(
    (state) => state.setModalTitleContent
  );
  const setModalDescriptionContent = useAdminDialogueModalStore(
    (state) => state.setModalDescriptionContent
  );
  const setCallback = useAdminDialogueModalStore((state) => state.setCallback);

  const handleMemberDelete = (id: string, name: string) => {
    setModalTitleContent(`${translations.confirmDelete[lang!]} ${name}?`);
    setModalDescriptionContent(translations.irreversibleAction[lang!]);
    setCallback(() =>
      fetcher.submit(null, {
        action: `/admin/${lang}/contacts/${id}/delete`,
        method: "DELETE",
      })
    );
    toggleModal();
  };

  //Handle document scroll
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isModalOpen]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 justify-items-center items-start">
      {loaderData.members &&
        loaderData.members.map((item) => (
          <div
            key={item._id}
            className="group relative block overflow-hidden border border-gray-100 w-full md:w-8/12"
          >
            <div className="relative h-full bg-white p-6 flex flex-col items-center justify-between">
              {/* Name */}
              <h3 className="mt-1.5 text-lg font-medium text-gray-900">
                {item.name}
              </h3>

              {/* Position */}
              <p>{JSON.parse(item.position).content[lang]}</p>

              <div className="mt-4 flex flex-col items-center justify-start w-full gap-4">
                <Link
                  to={`/admin/${lang}/contacts/${item._id}/change`}
                  className="block text-center w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105"
                >
                  {translations.change[lang!]}
                </Link>

                <button
                  onClick={() => handleMemberDelete(item._id, item.name)}
                  type="button"
                  disabled={fetcher.state !== "idle"}
                  className="block w-full rounded-sm bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:scale-105"
                >
                  {fetcher.state === "idle"
                    ? translations.delete[lang!]
                    : translations.deleting[lang!]}
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminContactsRoute;
