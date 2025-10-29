import { ChevronRight, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useParams } from "@remix-run/react";

import useChangeProjectStore from "~/stores/ChangeProjectStore";

const translations = {
  projectFeaturesList: {
    eng: "Project Features List",
    rus: "Список характеристик проекта",
    est: "Projekti funktsioonide loetelu",
    nor: "Liste over prosjektfunksjoner",
  },
  addNewList: {
    eng: "Add New List",
    rus: "Добавить новый список",
    est: "Lisa uus loend",
    nor: "Legg til ny liste",
  },
  projectSpecificFeaturesList: {
    eng: "List of Project Features",
    rus: "Список особенностей проекта",
    est: "Projekti eripärade loetelu",
    nor: "Liste over prosjektets egenskaper",
  },
  projectListTitle: {
    eng: "Title",
    rus: "Заголовок",
    est: "Pealkiri",
    nor: "Tittel",
  },
  addNewListItem: {
    eng: "Add New List Item",
    rus: "Добавить новый элемент списка",
    est: "Lisa uus loendiüksus",
    nor: "Legg til nytt listeelement",
  },
  deleteList: {
    eng: "Delete List",
    rus: "Удалить список",
    est: "Kustuta loend",
    nor: "Slett liste",
  },
  listItem: {
    eng: "List Item",
    rus: "Элемент списка",
    est: "Loendiüksus",
    nor: "Listeelement",
  },
};

type ChangeProjectDetailsListFormItemInputProps = {
  uuid: string;
  parentUUid: string;
  selectedLang: string;
  content: {
    eng: string | null;
    rus: string | null;
    est: string | null;
    nor: string | null;
  };
};
const ChangeProjectDetailsListFormItemInput = ({
  uuid,
  parentUUid,
  selectedLang,
  content,
}: ChangeProjectDetailsListFormItemInputProps) => {
  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const deleteFeaturesListItem = useChangeProjectStore(
    (state) => state.deleteFeaturesListItem
  );
  const setFeaturesListItemInput = useChangeProjectStore(
    (state) => state.setFeaturesListItemInput
  );

  const handleListItemDelete = () => {
    deleteFeaturesListItem(parentUUid, uuid);
  };

  const handleListItemInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturesListItemInput(e.target.value, uuid, parentUUid);
  };

  return (
    <div className="w-full flex justify-start items-center gap-x-3">
      <ChevronRight />
      <label htmlFor={uuid}>
        <span className="text-sm font-medium text-gray-700">
          {" "}
          {translations.listItem[lang!]}{" "}
        </span>
        <div className="relative">
          <button
            onClick={handleListItemDelete}
            className="absolute end-0 -top-[1rem] inline-block rounded-sm border border-red-600 bg-red-600 p-[1px] text-sm font-medium text-white hover:bg-transparent hover:text-red-600 focus:ring-3 focus:outline-hidden"
          >
            <X size={14} />
          </button>
          <input
            name="listItemInput"
            type="text"
            onChange={handleListItemInput}
            value={content[selectedLang] || ""}
            id={uuid}
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
          />
        </div>
      </label>
    </div>
  );
};

type ChangeProjectDetailsListFormFormProps = {
  listItems: {
    uuid: string;
    content: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
  }[];
  uuid: string;
  selectedLang: string;
  title: {
    est: string | null;
    eng: string | null;
    rus: string | null;
    nor: string | null;
  };
};
const ChangeProjectDetailsListFormForm = ({
  uuid,
  listItems,
  selectedLang,
  title,
}: ChangeProjectDetailsListFormFormProps) => {
  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const addFeaturesListItem = useChangeProjectStore(
    (state) => state.addFeaturesListItem
  );
  const deleteFeaturesList = useChangeProjectStore(
    (state) => state.deleteFeaturesList
  );
  const setFeaturesListTitle = useChangeProjectStore(
    (state) => state.setFeaturesListTitle
  );
  const selectFeaturesListLang = useChangeProjectStore(
    (state) => state.selectFeaturesListLang
  );

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen((prev) => !prev);
  };

  //Handle new features list item
  const handleNewFeaturesListItem = () => {
    addFeaturesListItem(uuid);
  };

  //Handle list remove
  const handleListRemove = () => {
    deleteFeaturesList(uuid);
  };

  //Handle list lang selection
  const handleListLangSelect = (lang: string) => {
    //Select new lang
    selectFeaturesListLang(lang, uuid);

    //Close dropdown
    toggleLangDropdown();
  };

  //Handle title input
  const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturesListTitle(e.target.value, uuid);
  };

  return (
    <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
      {/* Some annotation + Language selection dropdown */}
      <div className="w-full flex justify-between relative z-50">
        <p className="text-sm font-medium text-gray-700">
          {translations.projectFeaturesList[lang!]}
        </p>

        {/* Dropdown */}
        <div className="relative inline-flex">
          <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
            <button
              onClick={toggleLangDropdown}
              type="button"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
            >
              {selectedLang}
            </button>

            <button
              onClick={toggleLangDropdown}
              type="button"
              className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
              aria-label="Menu"
            >
              <ChevronDown
                className={`transition-transform duration-200 rotate-0`}
                size={18}
              />
            </button>
          </span>

          <div
            role="menu"
            className={`${
              !isLangDropdownOpen && "hidden"
            } absolute end-0 top-12 z-auto w-20 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
          >
            <button
              className={`${
                selectedLang === "est" && "bg-gray-50"
              } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
              role="menuitem"
              onClick={() => handleListLangSelect("est")}
            >
              est
            </button>

            <button
              className={` ${
                selectedLang === "eng" && "bg-gray-50"
              } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
              role="menuitem"
              onClick={() => handleListLangSelect("eng")}
            >
              eng
            </button>

            <button
              className={`${
                selectedLang === "nor" && "bg-gray-50"
              } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
              role="menuitem"
              onClick={() => handleListLangSelect("nor")}
            >
              nor
            </button>

            <button
              className={`${
                selectedLang === "rus" && "bg-gray-50"
              } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
              role="menuitem"
              onClick={() => handleListLangSelect("rus")}
            >
              rus
            </button>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="w-full flex flex-col items-start mt-3 gap-y-5">
        {/* Title input */}
        <label htmlFor={`titleInput-${uuid}`}>
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {translations.projectListTitle[lang!]}{" "}
          </span>
          <input
            name={`titleInput-${uuid}`}
            type="text"
            id={`titleInput-${uuid}`}
            value={title[selectedLang] || ""}
            onChange={handleTitleInput}
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
          />
        </label>

        {/* Items inputs */}
        {listItems
          ? listItems.map((item) => (
              <ChangeProjectDetailsListFormItemInput
                parentUUid={uuid}
                uuid={item.uuid}
                key={item.uuid}
                content={item.content}
                selectedLang={selectedLang}
              />
            ))
          : ""}
      </div>

      {/* Add new / Delete list button */}
      <div className="w-full flex flex-col justify-start items-center gap-y-5 px-5">
        <button
          onClick={handleNewFeaturesListItem}
          className="inline-block w-full rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.addNewListItem[lang!]}
        </button>

        <button
          onClick={handleListRemove}
          className="inline-block w-full rounded-sm border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.deleteList[lang!]}
        </button>
      </div>
    </div>
  );
};

const ChangeProjectDetailsListForm = () => {
  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const featuresList = useChangeProjectStore((state) => state.featuresList);
  const addFeaturesList = useChangeProjectStore(
    (state) => state.addFeaturesList
  );

  return (
    <div className="flex flex-col items-center justify-start gap-y-1 w-full">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.projectSpecificFeaturesList[lang!]}
      </h2>

      {/* Form inputs */}
      <div className="grid grid-cols-1 justify-items-center align-items-center w-full gap-y-10">
        {/* List input will be there */}
        {featuresList.length
          ? featuresList.map((item) => (
              <ChangeProjectDetailsListFormForm
                key={item.uuid}
                uuid={item.uuid}
                listItems={item.listItems}
                selectedLang={item.selectedLang}
                title={item.title}
              />
            ))
          : null}
      </div>

      {/* Add new list button */}
      <div className="w-full flex justify-center items-center mt-10">
        <button
          onClick={addFeaturesList}
          className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.addNewList[lang!]}
        </button>
      </div>
    </div>
  );
};

export default ChangeProjectDetailsListForm;
