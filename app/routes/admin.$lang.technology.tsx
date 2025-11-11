import {
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import {
  useOutlet,
  useLoaderData,
  Link,
  useFetcher,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";

import { getSession } from "~/utils/session";

//Db
import { connectToDB } from "~/utils/db";
import technologyModel from "~/models/Technology";

import useAdminDialogueModalStore from "~/stores/AdminDialogueModalStore";

const translations = {
  changeButton: {
    eng: "Change",
    rus: "Изменить",
    est: "Muuda",
    nor: "Endre",
  },
  deleteButton: {
    eng: "Delete",
    rus: "Удалить",
    est: "Kustuta",
    nor: "Slett",
  },
  deletingProcess: {
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

  //Get technology articles from db
  connectToDB();
  const technologyArticles = await technologyModel
    .find(
      {},
      {
        _id: 1,
        title: 1,
      }
    )
    .lean();

  //Transform "_id" field to plain string
  const technologyArticlesClient = technologyArticles.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return json(technologyArticlesClient);
};

const AdminTechnology = () => {
  const loaderData = useLoaderData<
    {
      title: string;
      _id: string;
    }[]
  >();
  const outlet = useOutlet();
  const fetcher = useFetcher();

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Store
  const isModalOpen = useAdminDialogueModalStore((state) => state.isModalOpen);
  const toggleModal = useAdminDialogueModalStore((state) => state.toggleModal);
  const setModalTitleContent = useAdminDialogueModalStore(
    (state) => state.setModalTitleContent
  );
  const setModalDescriptionContent = useAdminDialogueModalStore(
    (state) => state.setModalDescriptionContent
  );
  const setCallback = useAdminDialogueModalStore((state) => state.setCallback);

  const handleArticleDelete = (id: string, name: string) => {
    setModalTitleContent(`${translations.confirmDelete[lang!]} ${name}?`);
    setModalDescriptionContent(translations.irreversibleAction[lang!]);
    setCallback(() =>
      fetcher.submit(null, {
        action: `/admin/${lang}/technology/${id}/delete`,
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
    <section className="w-full grid grid-cols-1 px-10 mt-10 relative z-0 pb-20">
      {outlet ? (
        outlet
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 justify-items-center items-start">
          {loaderData &&
            loaderData.map((item) => (
              <div
                key={item._id}
                className="group relative block border border-gray-100 sm:w-8/12 w-full"
              >
                <div className="relative h-full bg-white p-6 flex flex-col items-center justify-between">
                  <h3 className="mt-1.5 text-lg font-medium text-gray-900">
                    {JSON.parse(item.title).content["est"]}
                  </h3>

                  <div className="w-full mt-4 flex flex-col items-center justify-start gap-4">
                    <Link
                      to={`/admin/${lang}/technology/${item._id}/change`}
                      className="block text-center w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105"
                    >
                      {translations.changeButton[lang!]}
                    </Link>

                    <button
                      onClick={() =>
                        handleArticleDelete(
                          item._id,
                          JSON.parse(item.title).content["est"]
                        )
                      }
                      type="button"
                      disabled={fetcher.state !== "idle"}
                      className="block w-full rounded-sm bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:scale-105"
                    >
                      {fetcher.state === "idle"
                        ? translations.deleteButton[lang!]
                        : translations.deletingProcess[lang!]}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default AdminTechnology;
