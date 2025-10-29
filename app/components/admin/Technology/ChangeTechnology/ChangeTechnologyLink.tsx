import { useState } from "react";
import { useParams } from "@remix-run/react";
import { ChevronDown } from "lucide-react";

import useChangeTechnologyItemStore from "~/stores/ChangeTechnologyStore";

const translations = {
  linkWithAnnotation: {
    eng: "Link with Annotation",
    rus: "Ссылка с аннотацией",
    est: "Link koos annotatsiooniga",
    nor: "Lenke med merknad",
  },
  options: {
    eng: "Options",
    rus: "Параметры",
    est: "Valikud",
    nor: "Alternativer",
  },
  linkUrlInput: {
    eng: "Link URL Input",
    rus: "Поле ввода URL ссылки",
    est: "Lingi URL sisestusväli",
    nor: "Inndatafelt for lenke-URL",
  },
  language: {
    eng: "Language",
    rus: "Язык",
    est: "Keel",
    nor: "Språk",
  },
  deleteLink: {
    eng: "Delete Link",
    rus: "Удалить ссылку",
    est: "Kustuta link",
    nor: "Slett lenke",
  },
  linkTextInput: {
    eng: "Link Text Input",
    rus: "Поле ввода текста ссылки",
    est: "Lingi teksti sisestusväli",
    nor: "Inndatafelt for lenketekst",
  },
  enterUrlPath: {
    eng: "Enter URL path",
    rus: "Введите путь URL",
    est: "Sisesta URL-tee",
    nor: "Skriv inn URL-bane",
  },
  enterLinkText: {
    eng: "Enter link text",
    rus: "Введите текст ссылки",
    est: "Sisesta lingi tekst",
    nor: "Skriv inn lenketekst",
  },
  linkWithoutAnnotation: {
    eng: "Link without Annotation",
    rus: "Ссылка без аннотации",
    est: "Link ilma annotatsioonita",
    nor: "Lenke uten merknad",
  },
  inputLinkAnnotationHere: {
    eng: "Input Link Annotation here",
    rus: "Введите аннотацию ссылки здесь",
    est: "Sisesta lingi annotatsioon siia",
    nor: "Skriv inn lenkeannotasjon her",
  },
};

const ChangeTechnologyLink = ({
  type,
  uuid,
  linkRoute,
  lang,
  linkAnnotation,
  content,
}: {
  type: string;
  uuid: string;
  linkRoute: string | null;
  lang?: string;
  content?: {
    est: string;
    eng: string;
    rus: string;
    nor: string;
  };
  linkAnnotation?: {
    content: {
      est: string;
      eng: string;
      rus: string;
      nor: string;
    };
  };
}) => {
  //Options dropdown visibility
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang: urlLang } = useParams<{ lang: SupportedLanguages }>();

  const setLinkRoute = useChangeTechnologyItemStore(
    (state) => state.setLinkRoute
  );
  const selectContentItemLang = useChangeTechnologyItemStore(
    (state) => state.selectContentItemLang
  );
  const deleteItem = useChangeTechnologyItemStore(
    (state) => state.deleteContentItem
  );
  const setLinkAnnotationContent = useChangeTechnologyItemStore(
    (state) => state.setLinkAnnotationContent
  );
  const setLinkInnerContent = useChangeTechnologyItemStore(
    (state) => state.setItemContent
  );

  //Handle link route input
  const handleLinkRouteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkRoute(uuid, e.target.value);
  };

  //Handle link content input
  const handleLinkContentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkInnerContent(uuid, e.target.value);
  };

  //Handle link annotation input
  const handleLinkAnnotationInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLinkAnnotationContent(uuid, e.target.value);
  };

  //Toggle dropdown
  const toggleDropdown = () => {
    setOptionsVisible((prev) => !prev);
  };

  //Handle dropdown item click
  const handleDropdownItemClick = (action: () => void) => {
    //Perform action
    action();

    //Close dropdown
    setOptionsVisible(false);
  };

  //Close dropdown
  const closeDropdown = () => {
    if (optionsVisible) {
      setOptionsVisible(false);
    }
  };

  //Check link type
  if (type === "linkWithAnnotation") {
    return (
      <div className="w-full flex-col items-start justify-start">
        {/* Text for clarification */}
        <p className="text-sm font-medium text-gray-700 underline">
          {translations.linkWithAnnotation[urlLang!]}
        </p>
        {/* Annotation Input */}
        <div className="w-full flex items-center justify-between mt-3">
          <input
            type="text"
            placeholder={translations.inputLinkAnnotationHere[urlLang!]}
            onChange={handleLinkAnnotationInput}
            onFocus={closeDropdown}
            value={linkAnnotation!.content![lang] || ""}
            className="text-sm w-6/12 font-medium text-gray-700 p-1 py-1 pl-2 rounded border-gray-300 shadow-sm sm:text-sm mt-1"
          />

          {/* Options dropdown */}
          <div className="relative inline-flex">
            <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button
                onClick={toggleDropdown}
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
              >
                {translations.options[urlLang!]}
              </button>

              <button
                type="button"
                onClick={toggleDropdown}
                className="duration-200 transition-colors px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative"
                aria-label="Menu"
              >
                <ChevronDown
                  className={`${
                    optionsVisible && "rotate-180"
                  } duration-200 transition-transform`}
                  size={16}
                />
              </button>
            </span>

            <div
              role="menu"
              className={`${
                !optionsVisible && "hidden"
              } absolute end-0 top-12 z-50 w-56 divide-y divide-gray-200 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
            >
              <div>
                <p className="block px-3 py-2 text-sm text-gray-500">
                  {translations.language[urlLang!]}:
                </p>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "est")
                    )
                  }
                  className={`${
                    lang === "est" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Est
                </button>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "rus")
                    )
                  }
                  className={`${
                    lang === "rus" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Rus
                </button>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "eng")
                    )
                  }
                  className={`${
                    lang === "eng" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Eng
                </button>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "nor")
                    )
                  }
                  className={`${
                    lang === "nor" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Nor
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    handleDropdownItemClick(() => deleteItem(uuid))
                  }
                  className="block w-full px-3 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                >
                  {translations.deleteLink[urlLang!]}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Route input */}
        <div className="w-full flex flex-col items-start justify-start mt-5">
          <p className="text-sm text-gray-500">
            {" "}
            {translations.linkUrlInput[urlLang!]}
          </p>
          <input
            type="text"
            id={`${uuid}-route-input`}
            onFocus={closeDropdown}
            onChange={handleLinkRouteInput}
            placeholder={translations.enterUrlPath[urlLang!]}
            value={linkRoute || ""}
            className=" py-1 pl-2 w-full rounded border-gray-300 shadow-sm sm:text-sm mt-1"
          />
        </div>

        {/* Link content input */}
        <div className="w-full flex flex-col items-start justify-start mt-5">
          <p className="text-sm text-gray-500">
            {" "}
            {translations.linkTextInput[urlLang!]}
          </p>
          <input
            type="text"
            id={`${uuid}-content-input`}
            onFocus={closeDropdown}
            onChange={handleLinkContentInput}
            placeholder={translations.enterLinkText[urlLang!]}
            value={content![lang] || ""}
            className="py-1 pl-2 w-full rounded border-gray-300 shadow-sm sm:text-sm mt-1"
          />
        </div>
      </div>
    );
  } else if (type === "linkWithoutAnnotation") {
    return (
      <div className="w-full flex flex-col items-start justify-start">
        {/* Text for clarification */}
        <p className="text-sm font-medium text-gray-700 underline">
          {translations.linkWithoutAnnotation[urlLang!]}
        </p>

        {/* Link content input */}
        <div className="w-full flex items-start justify-between mt-5">
          <div className="w-6/12 flex flex-col items-start">
            <p className="text-sm text-gray-500">
              {" "}
              {translations.linkTextInput[urlLang!]}
            </p>
            <input
              type="text"
              id={`${uuid}-content-input`}
              placeholder={translations.enterLinkText[urlLang!]}
              onChange={handleLinkContentInput}
              onFocus={closeDropdown}
              value={content![lang] || ""}
              className="text-sm w-full font-medium text-gray-700 p-1 py-1 pl-2 rounded border-gray-300 shadow-sm sm:text-sm mt-3"
            />
          </div>

          {/* Options dropdown */}
          <div className="relative inline-flex">
            <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button
                onClick={toggleDropdown}
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
              >
                {translations.options[urlLang!]}
              </button>

              <button
                type="button"
                onClick={toggleDropdown}
                className="duration-200 transition-colors px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative"
                aria-label="Menu"
              >
                <ChevronDown
                  className={`${
                    optionsVisible && "rotate-180"
                  } duration-200 transition-transform`}
                  size={16}
                />
              </button>
            </span>

            <div
              role="menu"
              className={`${
                !optionsVisible && "hidden"
              } absolute end-0 top-12 z-50 w-56 divide-y divide-gray-200 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
            >
              <div>
                <p className="block px-3 py-2 text-sm text-gray-500">
                  {translations.language[urlLang!]}:
                </p>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "est")
                    )
                  }
                  className={`${
                    lang === "est" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Est
                </button>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "rus")
                    )
                  }
                  className={`${
                    lang === "rus" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Rus
                </button>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "eng")
                    )
                  }
                  className={`${
                    lang === "eng" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Eng
                </button>

                <button
                  onClick={() =>
                    handleDropdownItemClick(() =>
                      selectContentItemLang(uuid, "nor")
                    )
                  }
                  className={`${
                    lang === "nor" && "bg-gray-50"
                  } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  Nor
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    handleDropdownItemClick(() => deleteItem(uuid))
                  }
                  className="block w-full px-3 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                >
                  {translations.deleteLink[urlLang!]}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Link route input */}
        <div className="w-full flex flex-col items-start justify-start mt-5">
          <p className="text-sm text-gray-500">
            {" "}
            {translations.linkUrlInput[urlLang!]}
          </p>
          <input
            type="text"
            id={`${uuid}-route-input`}
            onFocus={closeDropdown}
            onChange={handleLinkRouteInput}
            placeholder={translations.enterUrlPath[urlLang!]}
            value={linkRoute || ""}
            className=" py-1 pl-2 w-full rounded border-gray-300 shadow-sm sm:text-sm mt-1"
          />
        </div>
      </div>
    );
  }
};

export default ChangeTechnologyLink;
