import { LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  useOutlet,
  useLoaderData,
  Link,
  useFetcher,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";

import { getSession } from "~/utils/session";

import galleryModel from "~/models/Gallery";

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

  //Get all galleries
  const galleries = await galleryModel.find({}).lean();

  //Transform galleries _id field
  const galleriesForClient = galleries.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return galleriesForClient;
};

const AdminGalleryRoute = () => {
  const outlet = useOutlet();
  const loaderData = useLoaderData<{ title: string; _id: string }[]>();
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
        action: `/admin/${lang}/gallery/${id}/delete`,
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
                className="group relative block border border-gray-100 sm:w-8/12"
              >
                <div className="relative h-full bg-white p-6 flex flex-col items-center justify-between">
                  <h3 className="mt-1.5 text-lg font-medium text-gray-900">
                    {JSON.parse(item.title).content["est"]}
                  </h3>

                  <div className="mt-4 flex gap-4 flex-col items-center justify-start w-full">
                    <Link
                      to={`/admin/${lang}/gallery/${item._id}/change`}
                      className="block text-center w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105"
                    >
                      {translations.change[lang!]}
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
                        ? translations.delete[lang!]
                        : `${translations.deleting[lang!]}...`}
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

export default AdminGalleryRoute;
