import { useParams } from "@remix-run/react";
import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";

import useNewTechnologyItemStore from "~/stores/NewTechnologyStore";

const translations = {
  list: {
    eng: "List",
    rus: "Список",
    est: "Loend",
    nor: "Liste",
  },
  listTitle: {
    eng: "List Title",
    rus: "Заголовок списка",
    est: "Loendi pealkiri",
    nor: "Listetittel",
  },
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
  deleteList: {
    eng: "Delete List",
    rus: "Удалить список",
    est: "Kustuta loend",
    nor: "Slett liste",
  },
  inputListTitleHere: {
    eng: "Input List Title here",
    rus: "Введите заголовок списка здесь",
    est: "Sisesta loendi pealkiri siia",
    nor: "Skriv inn listetittel her",
  },
  addNewListItem: {
    eng: "Add New List Item",
    rus: "Добавить новый элемент списка",
    est: "Lisa uus loendiüksus",
    nor: "Legg til nytt listeelement",
  },
  textItem: {
    eng: "Text Item",
    rus: "Текстовый элемент",
    est: "Tekstielement",
    nor: "Tekstelement",
  },
  linkItem: {
    eng: "Link Item",
    rus: "Элемент-ссылка",
    est: "Lingielement",
    nor: "Lenkeelement",
  },
  linkListItem: {
    eng: "Link List Item",
    rus: "Элемент списка со ссылкой",
    est: "Loendi linkelement",
    nor: "Listeelement med lenke",
  },
  textListItem: {
    eng: "Text List Item",
    rus: "Текстовый элемент списка",
    est: "Tekstiloendiüksus",
    nor: "Tekstlisteelement",
  },
  enterTextHere: {
    eng: "Enter text here",
    rus: "Введите текст здесь",
    est: "Sisesta tekst siia",
    nor: "Skriv inn tekst her",
  },
  linkRoute: {
    eng: "Link Route",
    rus: "Маршрут URL",
    est: "URL-i marsruut",
    nor: "URL-rute",
  },
  inputLinkRouteHere: {
    eng: "Input Link Route here",
    rus: "Введите маршрут URL здесь",
    est: "Sisesta URL-i marsruut siia",
    nor: "Skriv inn URL-rute her",
  },
  linkText: {
    eng: "Link Text",
    rus: "Текст ссылки",
    est: "Lingi tekst",
    nor: "Lenketekst",
  },
  inputLinkTextHere: {
    eng: "Input Link Text here",
    rus: "Введите текст ссылки здесь",
    est: "Sisesta lingi tekst siia",
    nor: "Skriv inn lenketekst her",
  },
};

const NewTechnologyListItem = ({
  type,
  parentUUid,
  lang,
  content,
  linkRoute,
  uuid,
  closeDropdown,
}: {
  parentUUid: string;
  lang: string;
  type: string;
  content: {
    est: string;
    rus: string;
    eng: string;
    nor: string;
  };
  uuid: string;
  linkRoute?: string;
  closeDropdown: () => void;
}) => {
  const deleteListItem = useNewTechnologyItemStore(
    (state) => state.deleteListItem
  );
  const setListItemContent = useNewTechnologyItemStore(
    (state) => state.setListItemContent
  );
  const setListItemLinkRoute = useNewTechnologyItemStore(
    (state) => state.setListItemLinkRoute
  );

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang: urlLang } = useParams<{ lang: SupportedLanguages }>();

  //Handle item deletion
  const handleItemDelete = () => {
    deleteListItem(parentUUid, uuid);
  };

  //Handle item input
  const handleContentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListItemContent(parentUUid, uuid, e.target.value);
  };

  //Handle route input
  const handleRouteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListItemLinkRoute(parentUUid, uuid, e.target.value);
  };

  if (type === "listItemText") {
    return (
      <div className="w-full flex flex-col items-start">
        {/* Text for clarification and options button */}
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {translations.textListItem[urlLang!]}:
          </p>
          <button onClick={handleItemDelete}>
            <Trash2 />
          </button>
        </div>

        {/* Input */}
        <div className="w-full flex justify-between items-center">
          {/* Input */}
          <div className="flex justify-start items-center mt-3 w-full">
            <ChevronRight />

            <input
              type="text"
              onChange={handleContentInput}
              onFocus={closeDropdown}
              value={content[lang] || ""}
              className="border border-blue-400 p-1 rounded-md w-full mt-1"
              placeholder={`${translations.enterTextHere[urlLang!]}...`}
            />
          </div>
        </div>
      </div>
    );
  } else if (type === "listItemLink") {
    return (
      <div className="w-full flex flex-col items-start">
        {/* Text for clarification and options button */}
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {translations.linkListItem[urlLang!]}:
          </p>
          <button onClick={handleItemDelete}>
            <Trash2 />
          </button>
        </div>

        {/* Inputs */}
        <div className="w-full flex justify-between items-center mt-3">
          {/* Icon */}
          <div className="w-1/12">
            <ChevronRight />
          </div>

          {/* Actual inputs */}
          <div className="w-11/12 flex flex-col items-start justify-start">
            {/* Link route input */}
            <div className="w-full flex flex-col items-start">
              {/* Label for clarification */}
              <p className="text-sm text-gray-500">
                {translations.linkRoute[urlLang!]}:
              </p>

              {/* Route input */}
              <input
                type="text"
                onChange={handleRouteInput}
                onFocus={closeDropdown}
                value={linkRoute || ""}
                className="border border-blue-400 p-1 rounded-md w-full mt-1"
                placeholder={`${translations.inputLinkRouteHere[urlLang!]}:`}
              />
            </div>

            {/* Link inner content input */}
            <div className="w-full flex flex-col items-start mt-5">
              {/* Label for clarification */}
              <p className="text-sm text-gray-500">
                {translations.linkText[urlLang!]}:
              </p>

              {/* Content input */}
              <input
                type="text"
                onChange={handleContentInput}
                onFocus={closeDropdown}
                value={content[lang] || ""}
                className="border border-blue-400 p-1 rounded-md w-full mt-1"
                placeholder={`${translations.inputLinkTextHere[urlLang!]}...`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const NewTechnologyList = ({
  title,
  listItems,
  uuid,
  lang,
}: {
  uuid: string;
  lang: string;
  title: {
    content: {
      est: string;
      rus: string;
      eng: string;
      nor: string;
    };
  };
  listItems?: {
    uuid?: string;
    linkRoute?: string;
    type?: string;
    content?: {
      est: string;
      rus: string;
      eng: string;
      nor: string;
    };
  }[];
}) => {
  //Options dropdown visibility
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang: urlLang } = useParams<{ lang: SupportedLanguages }>();

  //New list item type dropdown visibility
  const [newListItemTypeOptionsVisible, setNewListItemTypeOptionsVisible] =
    useState<boolean>(false);

  //Change list language
  const setListLanguage = useNewTechnologyItemStore(
    (state) => state.setListLanguage
  );

  //Delete list
  const deleteItem = useNewTechnologyItemStore(
    (state) => state.deleteContentItem
  );

  //Set list title content
  const setListTitleContent = useNewTechnologyItemStore(
    (state) => state.setListTitleContent
  );

  //Add new item
  const addListItem = useNewTechnologyItemStore((state) => state.addListItem);

  //Modal window manage

  //Toggle dropdown
  const toggleDropdown = (dropdown: string) => {
    if (dropdown === "options") {
      setOptionsVisible((prev) => !prev);
    } else if (dropdown === "itemType") {
      setNewListItemTypeOptionsVisible((prev) => !prev);
    }
  };

  //Handle dropdown item click
  const handleDropdownItemClick = (action: () => void) => {
    //Perform action
    action();

    //Close dropdown
    setOptionsVisible(false);
  };

  //Close dropdown
  const closeDropdown = (dropdown: string) => {
    if (dropdown === "options") {
      if (optionsVisible) {
        setOptionsVisible(false);
      }
    } else if (dropdown === "itemType") {
      if (newListItemTypeOptionsVisible) {
        setNewListItemTypeOptionsVisible(false);
      }
    }
  };

  //Handle list title input
  const handleListTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListTitleContent(uuid, e.target.value);
  };

  //Handle list item type selection dropdown click
  const handleListItemTypeSelection = (type: string) => {
    //Close dropdown
    closeDropdown("itemType");

    //Add new link
    if (type === "link") {
      addListItem(uuid, {
        uuid: crypto.randomUUID(),
        linkRoute: "",
        type: "listItemLink",
        content: {
          est: "",
          rus: "",
          eng: "",
          nor: "",
        },
      });

      //Add new text
    } else if (type === "text") {
      addListItem(uuid, {
        uuid: crypto.randomUUID(),
        type: "listItemText",
        content: {
          est: "",
          rus: "",
          eng: "",
          nor: "",
        },
      });
    }
  };

  return (
    <div>
      {/* Some label for clarification */}
      <p className="text-sm font-medium text-gray-700 underline">
        {translations.list[urlLang!]}
      </p>

      {/* Title input */}
      <div className="w-full flex flex-col justify-start items-start mt-5">
        {/* Label and options */}
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-gray-500">{`${
            translations.listTitle[urlLang!]
          }:`}</p>

          {/* Options dropdown */}
          <div className="relative inline-flex">
            <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button
                onClick={() => toggleDropdown("options")}
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
              >
                {translations.options[urlLang!]}
              </button>

              <button
                type="button"
                onClick={() => toggleDropdown("options")}
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
                    handleDropdownItemClick(() => setListLanguage(uuid, "est"))
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
                    handleDropdownItemClick(() => setListLanguage(uuid, "rus"))
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
                    handleDropdownItemClick(() => setListLanguage(uuid, "eng"))
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
                    handleDropdownItemClick(() => setListLanguage(uuid, "nor"))
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
                  {translations.deleteList[urlLang!]}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actual input */}
        <input
          type="text"
          onChange={handleListTitleInput}
          onFocus={() => closeDropdown("options")}
          value={title.content[lang] || ""}
          placeholder={`${translations.inputListTitleHere[urlLang!]}...`}
          className="font-bold w-full text-lg text-gray-700 mt-3 border border-blue-400 p-1 rounded-md"
        />
      </div>

      {/* List items */}
      <ul className="space-y-10 mt-8">
        {listItems &&
          listItems.map((item) => (
            <NewTechnologyListItem
              type={item.type!}
              key={item.uuid}
              parentUUid={uuid}
              uuid={item.uuid!}
              content={item.content!}
              lang={lang}
              linkRoute={item.linkRoute}
              closeDropdown={() => closeDropdown("options")}
            />
          ))}
      </ul>

      {/* Add new list item */}
      <div className="w-full flex justify-center items-center mt-10 relative">
        {/* Dropdown open button */}
        <button
          onClick={() => toggleDropdown("itemType")}
          className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.addNewListItem[urlLang!]}
        </button>

        {/* Type selection */}
        <div
          role="menu"
          className={`${
            !newListItemTypeOptionsVisible && "hidden"
          } absolute top-[4rem] z-50 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
        >
          {/* Text */}
          <button
            onClick={() => handleListItemTypeSelection("text")}
            className="w-full text-center block px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.textItem[urlLang!]}
          </button>

          {/* Link */}
          <button
            onClick={() => handleListItemTypeSelection("link")}
            className="w-full text-center block px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.linkItem[urlLang!]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTechnologyList;
