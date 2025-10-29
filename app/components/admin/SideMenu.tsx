/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  NavLink,
  useLocation,
  useParams,
  useNavigate,
  useFetcher,
} from "@remix-run/react";

type Props = {
  closeSideMenu: () => void;
  sideMenuState: boolean;
};

const translations = {
  projects: {
    general: {
      eng: "Projects",
      rus: "Проекты",
      est: "Projektid",
      nor: "Prosjekter",
    },
    currentProjects: {
      eng: "Current Projects",
      rus: "Текущие проекты",
      est: "Praegused projektid",
      nor: "Nåværende prosjekter",
    },
    addNew: {
      eng: "Add New",
      rus: "Добавить новый",
      est: "Lisa uus",
      nor: "Legg til ny",
    },
  },
  technology: {
    general: {
      eng: "Technology",
      rus: "Технологии",
      est: "Tehnoloogiad",
      nor: "Teknologi",
    },
    currentTechnologies: {
      eng: "Current Technologies",
      rus: "Текущие технологии",
      est: "Praegused tehnoloogiad",
      nor: "Nåværende teknologier",
    },
    addNew: {
      eng: "Add New Technology",
      rus: "Добавить новую технологию",
      est: "Lisa uus tehnoloogia",
      nor: "Legg til ny teknologi",
    },
  },
  gallery: {
    general: {
      eng: "Gallery",
      rus: "Галерея",
      est: "Galerii",
      nor: "Galleri",
    },
    currentGalleries: {
      eng: "Current Galleries",
      rus: "Текущие галереи",
      est: "Praegused galeriid",
      nor: "Nåværende gallerier",
    },
    addNew: {
      eng: "Add New Gallery",
      rus: "Добавить новую галерею",
      est: "Lisa uus galerii",
      nor: "Legg til ny galleri",
    },
  },
  contacts: {
    general: {
      eng: "Contacts",
      rus: "Контакты",
      est: "Kontaktid",
      nor: "Kontakter",
    },
    currentContacts: {
      eng: "Current Contacts",
      rus: "Текущие контакты",
      est: "Praegused kontaktid",
      nor: "Nåværende kontakter",
    },
    addNew: {
      eng: "Add New Contact",
      rus: "Добавить новый контакт",
      est: "Lisa uus kontakt",
      nor: "Legg til ny kontakt",
    },
  },
  feedback: {
    eng: "Feedback",
    rus: "Обратная связь",
    est: "Tagasiside",
    nor: "Tilbakemelding",
  },
  language: {
    eng: "Language",
    rus: "Язык",
    est: "Keel",
    nor: "Språk",
  },
  logout: {
    eng: "Log Out",
    rus: "Выйти",
    est: "Logi välja",
    nor: "Logg ut",
  },
};

const SideMenu = ({ closeSideMenu, sideMenuState }: Props) => {
  const { pathname } = useLocation();
  const fetcher = useFetcher();

  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const nav = useNavigate();

  //Handle language change
  const handleGeneralLanguageChange = (newLang: string) => {
    //Update url
    const currentPath = pathname;
    const updatedPath = currentPath.replace(`/${lang}`, `/${newLang}`);

    //Update localStorage pref
    window.localStorage.setItem("langPref", newLang);

    nav(updatedPath);
  };

  //Handle log-out
  const handleLogout = () => {
    fetcher.submit(null, {
      action: "/admin/logout",
      method: "POST",
    });
  };

  return (
    <>
      {/* Background */}
      <div
        onClick={closeSideMenu}
        className={`fixed cursor-pointer inset-0 w-screen h-screen bg-slate-500 lg:hidden transition-all duration-50 z-50 ${
          sideMenuState
            ? "-translate-x-0 opacity-50"
            : "-translate-x-full opacity-0"
        }`}
      ></div>

      {/* Content */}
      <div
        className={`z-50 w-6/12 md:w-4/12 lg:w-2/12 flex h-dvh flex-col justify-between border-e border-gray-100 bg-white fixed lg:sticky inset-0 transition-transform duration-200 ${
          sideMenuState ? "translate-x-0" : "-translate-x-full"
        } lg:-translate-x-0 lg:relative`}
      >
        <div className="px-4 py-6">
          <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
            Logo
          </span>

          <ul className="mt-6 space-y-1">
            {/* Projects */}
            <li>
              <details
                open={pathname.includes("projects")}
                className="group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  className={`${
                    pathname.includes("projects") && "bg-gray-100 text-gray-700"
                  } flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
                >
                  <span className="text-sm font-medium">
                    {" "}
                    {translations.projects.general[lang!]}{" "}
                  </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/projects`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.projects.currentProjects[lang!]}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/projects/new`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.projects.addNew[lang!]}
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>

            {/* Technology */}
            <li>
              <details
                open={pathname.includes("technology")}
                className="group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  className={`${
                    pathname.includes("technology") &&
                    "bg-gray-100 text-gray-700"
                  } flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
                >
                  <span className="text-sm font-medium">
                    {" "}
                    {translations.technology.general[lang!]}{" "}
                  </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/technology`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.technology.currentTechnologies[lang!]}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/technology/new`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.technology.addNew[lang!]}
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>

            {/* Gallery */}
            <li>
              <details
                open={pathname.includes("gallery")}
                className="group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  className={`${
                    pathname.includes("gallery") && "bg-gray-100 text-gray-700"
                  } flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
                >
                  <span className="text-sm font-medium">
                    {" "}
                    {translations.gallery.general[lang!]}{" "}
                  </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/gallery`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.gallery.currentGalleries[lang!]}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/gallery/new`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.gallery.addNew[lang!]}
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>

            {/* Contacts */}
            <li>
              <details
                open={pathname.includes("contacts")}
                className="group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary
                  className={`${
                    pathname.includes("contacts") && "bg-gray-100 text-gray-700"
                  } flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
                >
                  <span className="text-sm font-medium">
                    {" "}
                    {translations.contacts.general[lang!]}{" "}
                  </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/contacts`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.contacts.currentContacts[lang!]}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      onClick={closeSideMenu}
                      to={`/admin/${lang}/contacts/new`}
                      end
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${
                          isActive && "bg-gray-100"
                        }`
                      }
                    >
                      {translations.contacts.addNew[lang!]}
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>

            {/* Feedback */}
            <li>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                {translations.feedback[lang!]}
              </a>
            </li>

            {/* Language selection */}
            <li className="pt-10">
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary
                  className={` flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
                >
                  <span className="text-sm font-medium">
                    {" "}
                    {translations.language[lang!]}{" "}
                  </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <button
                    className="w-full text-left cursor-pointer block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => handleGeneralLanguageChange("est")}
                  >
                    est
                  </button>

                  <button
                    className="w-full text-left cursor-pointer block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => handleGeneralLanguageChange("rus")}
                  >
                    rus
                  </button>

                  <button
                    className="w-full text-left cursor-pointer block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => handleGeneralLanguageChange("eng")}
                  >
                    eng
                  </button>

                  <button
                    className="w-full text-left cursor-pointer block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    onClick={() => handleGeneralLanguageChange("nor")}
                  >
                    nor
                  </button>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        {/* Log out btn */}
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 mb-10 pt-10 flex justify-center">
          <button
            onClick={handleLogout}
            className="block bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-800 w-10/12"
          >
            {translations.logout[lang!]}
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
