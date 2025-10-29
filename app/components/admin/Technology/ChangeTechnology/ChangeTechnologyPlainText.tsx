import { useParams } from "@remix-run/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import useChangeTechnologyItemStore from "~/stores/ChangeTechnologyStore";

const translations = {
  options: {
    eng: "Options",
    rus: "Параметры",
    est: "Valikud",
    nor: "Alternativer",
  },
  language: {
    eng: "Language",
    rus: "Язык",
    est: "Keel",
    nor: "Språk",
  },
  plainText: {
    eng: "Plain Text",
    rus: "Простой текст",
    est: "Lihtne tekst",
    nor: "Ren tekst",
  },
  deletePlainText: {
    eng: "Delete Plain Text",
    rus: "Удалить простой текст",
    est: "Kustuta lihttekst",
    nor: "Slett ren tekst",
  },
  inputHere: {
    eng: "Input here",
    rus: "Введите здесь",
    est: "Sisesta siia",
    nor: "Skriv inn her",
  },
  plainTextContent: {
    eng: "Plain text content",
    rus: "Содержимое простого текста",
    est: "Lihtteksti sisu",
    nor: "Innhold i ren tekst",
  },
};

const ChangeTechnologyPlainText = ({
  uuid,
  content,
  lang,
}: {
  uuid: string;
  content: {
    est: string;
    rus: string;
    eng: string;
    nor: string;
  };
  lang: string;
}) => {
  //Options dropdown visibility
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang: urlLang } = useParams<{ lang: SupportedLanguages }>();

  //State manager
  const deleteItem = useChangeTechnologyItemStore(
    (state) => state.deleteContentItem
  );
  const selectContentItemLang = useChangeTechnologyItemStore(
    (state) => state.selectContentItemLang
  );
  const setItemContent = useChangeTechnologyItemStore(
    (state) => state.setItemContent
  );

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

  return (
    <>
      {/* Container */}
      <div className="flex flex-col items-start justify-start gap-y-2">
        {/* Some label for clarification */}
        <p className="text-sm font-medium text-gray-700 underline">
          {translations.plainText[urlLang!]}
        </p>

        {/* Content item title and options */}
        <div className="w-full flex justify-between items-center pr-5">
          <span className="text-sm text-gray-500">{`${
            translations.plainTextContent[urlLang!]
          }:`}</span>

          {/* Lang selection and delete btn */}
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
                  {translations.deletePlainText[urlLang!]}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <label htmlFor={uuid} className="w-full">
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {translations.inputHere[urlLang!]}:{" "}
          </span>

          <textarea
            id={uuid}
            className="mt-0.5 w-full resize-none rounded  shadow-sm sm:text-sm border border-blue-400 px-1 py-2"
            rows={4}
            value={content[lang] || ""}
            onFocus={closeDropdown}
            onChange={(e) => setItemContent(uuid, e.target.value)}
          ></textarea>
        </label>
      </div>
    </>
  );
};

export default ChangeTechnologyPlainText;
