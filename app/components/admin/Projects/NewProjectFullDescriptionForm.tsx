import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useParams } from "@remix-run/react";

import useNewProjectStore from "~/stores/NewProjectStore";

const translations = {
  fullDesc: {
    eng: "Detailed Description",
    rus: "Подробное описание",
    est: "Üksikasjalik kirjeldus",
    nor: "Detaljert beskrivelse",
  },
  projectFullDescription: {
    eng: "Full Project Description",
    rus: "Полное описание проекта",
    est: "Projekti täielik kirjeldus",
    nor: "Fullstendig prosjektbeskrivelse",
  },
};

const NewProjectFullDescriptionForm = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const fullDesc = useNewProjectStore((state) => state.fullDesc);
  const selectFullDescriptionLanguage = useNewProjectStore(
    (state) => state.selectFullDescriptionLanguage
  );
  const setFullDescription = useNewProjectStore(
    (state) => state.setFullDescription
  );

  const handleFullDescriptionLanguageSelectorClick = (lang: string) => {
    //Close dropdown
    setIsDropdownVisible(false);

    //Select language
    selectFullDescriptionLanguage(lang);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleTextareaClick = () => {
    setIsDropdownVisible(false);
  };

  return (
    <div className="flex flex-col items-center justify-start gap-y-1 w-full">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.projectFullDescription[lang!]}
      </h2>

      {/* Form inputs */}
      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
        <div>
          <div className="w-full flex justify-between items-center">
            {/* Name of the input */}
            <p className="text-sm font-medium text-gray-700">
              {translations.fullDesc[lang!]}
            </p>

            {/* Language selector */}
            <div className="relative inline-flex">
              <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                >
                  {fullDesc.selectedLang}
                </button>

                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                  aria-label="Menu"
                >
                  <ChevronDown
                    className={`${
                      isDropdownVisible && "rotate-180"
                    } transition-transform duration-200 rotate-0`}
                    size={18}
                  />
                </button>
              </span>

              <div
                role="menu"
                className={`${
                  !isDropdownVisible && "hidden"
                } absolute end-0 top-12 z-auto w-20 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
              >
                <button
                  onClick={() => {
                    handleFullDescriptionLanguageSelectorClick("est");
                  }}
                  className={`${
                    fullDesc.selectedLang === "est" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  est
                </button>

                <button
                  onClick={() => {
                    handleFullDescriptionLanguageSelectorClick("eng");
                  }}
                  className={`${
                    fullDesc.selectedLang === "eng" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  eng
                </button>

                <button
                  onClick={() => {
                    handleFullDescriptionLanguageSelectorClick("nor");
                  }}
                  className={`${
                    fullDesc.selectedLang === "nor" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  nor
                </button>

                <button
                  onClick={() => {
                    handleFullDescriptionLanguageSelectorClick("rus");
                  }}
                  className={`${
                    fullDesc.selectedLang === "rus" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  rus
                </button>
              </div>
            </div>
          </div>

          {/* Actual description input */}
          <textarea
            onClick={handleTextareaClick}
            value={fullDesc.content[fullDesc.selectedLang] || ""}
            onChange={(e) => setFullDescription(e.target.value)}
            id="fullDescription"
            name="fullDescription"
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2 resize-none"
            rows={4}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default NewProjectFullDescriptionForm;
