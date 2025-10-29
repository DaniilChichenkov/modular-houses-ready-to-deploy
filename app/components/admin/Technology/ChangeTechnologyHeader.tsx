import { useParams } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import useChangeTechnologyItemStore from "~/stores/ChangeTechnologyStore";

const translations = {
  addTitle: {
    eng: "Add Title",
    rus: "Добавить заголовок",
    est: "Lisa pealkiri",
    nor: "Legg til tittel",
  },
  titleInput: {
    eng: "Title Input",
    rus: "Поле для заголовка",
    est: "Pealkirja väli",
    nor: "Tittelfelt",
  },
  inputTitlePlaceholder: {
    eng: "Input title here...",
    rus: "Введите заголовок...",
    est: "Sisesta pealkiri siia...",
    nor: "Skriv inn tittel her...",
  },
};

const NewTechnologyHeader = () => {
  //Store
  const title = useChangeTechnologyItemStore((state) => state.title.content);
  const titleLang = useChangeTechnologyItemStore(
    (state) => state.title.selectedLang
  );
  const setTitle = useChangeTechnologyItemStore((state) => state.setTitle);
  const setTitleLang = useChangeTechnologyItemStore(
    (state) => state.setTitleLang
  );

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const [isSelectorVisible, setIsSelectorVisible] = useState<boolean>(false);

  //Toggle language selector
  const toggleLangSelector = () => {
    setIsSelectorVisible((prev) => !prev);
  };

  //Close lang selector
  const closeLangSelector = () => {
    setIsSelectorVisible(false);
  };

  //Handle language selection
  const handleLangSelection = (lang: string) => {
    setTitleLang(lang);
  };

  //Handle title input
  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="flex flex-col items-start justify-start gap-y-1 w-full col-start-1 col-span-1">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.addTitle[lang!]}
      </h2>

      {/* Options and input */}
      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
        {/* Input name and lang select */}
        <div className="w-full flex justify-between items-center">
          {/* Text */}
          <p className="text-sm font-medium text-gray-700">
            {translations.titleInput[lang!]}:
          </p>

          {/* Lang selector */}
          <div className="relative inline-flex">
            <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button
                onClick={toggleLangSelector}
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
              >
                {titleLang}
              </button>

              <button
                onClick={toggleLangSelector}
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                aria-label="Menu"
              >
                <ChevronDown size={16} />
              </button>
            </span>

            <div
              role="menu"
              className={`${
                !isSelectorVisible && "hidden"
              } absolute end-0 top-12 z-auto overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
            >
              <button
                onClick={() => {
                  handleLangSelection("est");
                  closeLangSelector();
                }}
                className="flex px-5 justify-center py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
              >
                est
              </button>

              <button
                onClick={() => {
                  handleLangSelection("eng");
                  closeLangSelector();
                }}
                className="flex px-5 justify-center py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
              >
                eng
              </button>

              <button
                onClick={() => {
                  handleLangSelection("nor");
                  closeLangSelector();
                }}
                className="flex px-5 justify-center py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
              >
                nor
              </button>

              <button
                onClick={() => {
                  handleLangSelection("rus");
                  closeLangSelector();
                }}
                className="flex px-5 justify-center py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
              >
                rus
              </button>
            </div>
          </div>
        </div>

        <input
          type="text"
          onChange={handleTitleInput}
          value={title[titleLang]}
          placeholder={translations.inputTitlePlaceholder[lang!]}
          className="w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
        />
      </div>
    </div>
  );
};

export default NewTechnologyHeader;
