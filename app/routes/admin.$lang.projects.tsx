import {
  LoaderFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  useLoaderData,
  useOutlet,
  useFetcher,
  Link,
  useParams,
} from "@remix-run/react";
import fs from "fs/promises";
import path from "path";

import { getSession } from "~/utils/session";
import projectModel from "~/models/Project";

import useAdminDialogueModalStore from "~/stores/AdminDialogueModalStore";
import { useEffect } from "react";

//Content translations
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

  //Get list of projects
  const projects = await projectModel.find({}).lean();

  const projectsBaseDir = path.join(process.cwd(), "public", "projects");

  const projectsWithImages = await Promise.all(
    projects.map(async (proj) => {
      //Project dir path
      const projDirPath = path.join(
        projectsBaseDir,
        proj.imagesFolder!,
        "main_image"
      );

      //Turn _id into String
      const projectToChangeIdString = proj._id.toString();

      //Read dir with main images
      let mainImagesFiles: string[] = [];
      mainImagesFiles = await fs.readdir(projDirPath);

      const mainImageUrl = mainImagesFiles.map(
        (item) => `/projects/${proj.imagesFolder}/main_image/${item}`
      );

      return {
        ...proj,
        _id: projectToChangeIdString,
        mainImageUrl,
      };
    })
  );

  return json(projectsWithImages);
};

const AdminProjectsRoute = () => {
  const loaderData = useLoaderData<
    {
      _id: string;
      quickDesc: string;
      title: string;
      price: string;
      mainImageUrl: string;
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

  const handleProjectDelete = (id: string, name: string) => {
    setModalTitleContent(`${translations.confirmDelete[lang!]} ${name}?`);
    setModalDescriptionContent(translations.irreversibleAction[lang!]);
    setCallback(() =>
      fetcher.submit(null, {
        action: `/admin/${lang}/projects/${id}/delete`,
        method: "DELETE",
      })
    );
    toggleModal();
  };

  console.log(loaderData[1].mainImageUrl);

  //Handle document scroll
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isModalOpen]);

  return loaderData ? (
    <section className="w-full grid grid-cols-1 px-10 mt-10 relative z-0 pb-20">
      {outlet ? (
        outlet
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-x-10 items-start gap-y-10 mt-10 md:mt-5">
          {loaderData.map((item) => (
            <div
              key={item._id}
              className="group relative block overflow-hidden border border-gray-100"
            >
              <img
                src={item.mainImageUrl}
                alt=""
                className="h-64 w-full transition duration-500 group-hover:scale-105 sm:h-72 object-cover"
              />

              <div className="relative bg-white p-6">
                <p className="text-gray-700">
                  {item.price}$
                  {/* <span className="text-gray-400 line-through">$80</span> */}
                </p>

                <h3 className="mt-1.5 text-lg font-medium text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-1.5 line-clamp-3 text-gray-700">
                  {JSON.parse(item.quickDesc)[lang!]}
                </p>

                <div className="mt-4 flex flex-col items-center justify-start gap-4">
                  <Link
                    to={`/admin/${lang}/projects/${item._id}/change`}
                    className="block text-center w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105"
                  >
                    {translations.changeButton[lang!]}
                  </Link>

                  <button
                    onClick={() => handleProjectDelete(item._id, item.title)}
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
  ) : (
    "loading"
  );
};

export default AdminProjectsRoute;
