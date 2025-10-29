import { useParams } from "@remix-run/react";
import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

import useNewTechnologyItemStore from "~/stores/NewTechnologyStore";

//Components
import {
  NewTechnologyArticleSubHeader,
  NewTechnologyArticleSmallSubHeader,
  NewTechnologyPlainText,
  NewTechnologyLink,
  NewTechnologyList,
  NewTechnologyImagesCollection,
} from "./NewTechnology";

const translations = {
  addContent: {
    eng: "Add Content",
    rus: "Добавить содержимое",
    est: "Lisa sisu",
    nor: "Legg til innhold",
  },
  selectContentType: {
    eng: "Select content type",
    rus: "Выберите тип содержимого",
    est: "Vali sisutüüp",
    nor: "Velg innholdstype",
  },
  subHeader: {
    eng: "Sub-Header",
    rus: "Подзаголовок",
    est: "Alapealkiri",
    nor: "Underoverskrift",
  },
  smallSubHeader: {
    eng: "Small Sub-Header",
    rus: "Маленький подзаголовок",
    est: "Väike alapealkiri",
    nor: "Liten underoverskrift",
  },
  plainText: {
    eng: "Plain Text",
    rus: "Простой текст",
    est: "Lihttekst",
    nor: "Ren tekst",
  },
  imageCollection: {
    eng: "Image Collection",
    rus: "Коллекция изображений",
    est: "Pildikogu",
    nor: "Bildekolleksjon",
  },
  itemsList: {
    eng: "Items List",
    rus: "Список элементов",
    est: "Elementide loetelu",
    nor: "Elementliste",
  },
  linkWithoutAnnotation: {
    eng: "Link without annotation",
    rus: "Ссылка без аннотации",
    est: "Link ilma annotatsioonita",
    nor: "Lenke uten merknad",
  },
  linkWithAnnotation: {
    eng: "Link with annotation",
    rus: "Ссылка с аннотацией",
    est: "Link koos annotatsiooniga",
    nor: "Lenke med merknad",
  },
};

const NewTechnologyContent = () => {
  const [isContentSelectionDropdownOpen, setIsContentSelectionDropdownOpen] =
    useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  //Store
  const content = useNewTechnologyItemStore((state) => state.content);
  const addContentItem = useNewTechnologyItemStore(
    (state) => state.addContentItem
  );

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Toggle dropdown
  const toggleContentSelectionDropdown = () => {
    //Scroll content selection into view
    if (!isContentSelectionDropdownOpen) {
      buttonRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    //Toggle dropdown
    setIsContentSelectionDropdownOpen((prev) => !prev);
  };

  //Close dropdown
  const closeContentSelectionDropdown = () => {
    setIsContentSelectionDropdownOpen(false);
  };

  //Add New Sub-Header
  const handleNewSubheader = () => {
    addContentItem({
      type: "subHeader",
      selectedLang: "est",
      content: {
        est: "",
        eng: "",
        rus: "",
        nor: "",
      },
      children: [],
      uuid: crypto.randomUUID(),
      parentUUID: null,
    });
  };

  //Add new Small Sub-header
  const handleNewSmallSubheader = () => {
    addContentItem({
      type: "smallSubHeader",
      selectedLang: "est",
      content: {
        est: "",
        eng: "",
        rus: "",
        nor: "",
      },
      children: [],
      uuid: crypto.randomUUID(),
      parentUUID: null,
    });
  };

  //Add new Plain Text
  const handleNewPlainText = () => {
    addContentItem({
      type: "plainText",
      selectedLang: "est",
      content: {
        est: "",
        eng: "",
        rus: "",
        nor: "",
      },
      children: [],
      uuid: crypto.randomUUID(),
      parentUUID: null,
    });
  };

  //Add new Link
  const handleNewLink = (withAnnotation: boolean) => {
    //Add link with annotation
    if (withAnnotation) {
      addContentItem({
        type: "linkWithAnnotation",
        selectedLang: "est",
        linkAnnotation: {
          selectedLang: "est",
          content: {
            est: "",
            eng: "",
            rus: "",
            nor: "",
          },
        },
        content: {
          est: "",
          eng: "",
          rus: "",
          nor: "",
        },
        linkRoute: null,
        children: [],
        uuid: crypto.randomUUID(),
        parentUUID: null,
      });
    } else {
      //Add link without annotation
      addContentItem({
        type: "linkWithoutAnnotation",
        linkRoute: null,
        content: {
          est: "",
          eng: "",
          rus: "",
          nor: "",
        },
        selectedLang: "est",
        children: [],
        uuid: crypto.randomUUID(),
        parentUUID: null,
      });
    }
  };

  //Add new list
  const handleNewList = () => {
    addContentItem({
      type: "list",
      children: [],
      uuid: crypto.randomUUID(),
      parentUUID: null,
      listTitle: {
        content: {
          est: "",
          rus: "",
          eng: "",
          nor: "",
        },
      },
      selectedLang: "est",
    });
  };

  //Add new images collection
  const handleNewImagesCollection = () => {
    addContentItem({
      type: "imagesCollection",
      children: [],
      uuid: crypto.randomUUID(),
      parentUUID: null,
    });
  };

  //Handle content selection dropdown click
  const handleContentSelectionDropdownClick = (addItemFunction: () => void) => {
    //Add item
    addItemFunction();

    //Close dropdown
    closeContentSelectionDropdown();
  };

  return (
    <div className="flex flex-col items-start justify-start gap-y-1 w-full md:col-start-2 md:col-span-2">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.addContent[lang!]}
      </h2>

      {/* Technology items */}
      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
        {content.map((item) =>
          item.type === "subHeader" ? (
            <NewTechnologyArticleSubHeader
              content={item.content}
              lang={item.selectedLang}
              uuid={item.uuid}
              key={item.uuid}
            />
          ) : item.type === "smallSubHeader" ? (
            <NewTechnologyArticleSmallSubHeader
              content={item.content}
              lang={item.selectedLang}
              uuid={item.uuid}
              key={item.uuid}
            />
          ) : item.type === "plainText" ? (
            <NewTechnologyPlainText
              content={item.content}
              lang={item.selectedLang}
              uuid={item.uuid}
              key={item.uuid}
            />
          ) : item.type === "linkWithAnnotation" ? (
            <NewTechnologyLink
              type="linkWithAnnotation"
              lang={item.selectedLang}
              content={item.content}
              linkAnnotation={item.linkAnnotation}
              linkRoute={item.linkRoute!}
              uuid={item.uuid}
              key={item.uuid}
            />
          ) : item.type === "linkWithoutAnnotation" ? (
            <NewTechnologyLink
              type="linkWithoutAnnotation"
              linkRoute={item.linkRoute!}
              uuid={item.uuid}
              key={item.uuid}
              lang={item.selectedLang}
              content={item.content}
            />
          ) : item.type === "list" ? (
            <NewTechnologyList
              title={item.listTitle!}
              lang={item.selectedLang!}
              listItems={item.children!}
              key={item.uuid}
              uuid={item.uuid}
            />
          ) : item.type === "imagesCollection" ? (
            <NewTechnologyImagesCollection
              uuid={item.uuid}
              files={item.children}
              key={item.uuid}
            />
          ) : (
            ""
          )
        )}
      </div>

      {/* Select which type of content user wants to add */}
      <div className="w-full flex justify-center relative mt-10">
        {/* Selection button */}
        <button
          ref={buttonRef}
          onClick={toggleContentSelectionDropdown}
          className="flex justify-between items-center gap-x-3 rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.selectContentType[lang!]}
          <span
            className={`transition-transform duration-200 ${
              isContentSelectionDropdownOpen && "rotate-180"
            }`}
          >
            <ChevronDown />
          </span>
        </button>

        {/* Dropdown with options */}
        <div
          role="menu"
          className={`${
            !isContentSelectionDropdownOpen && "hidden"
          }  absolute top-[4rem] z-auto w-full lg:w-6/12 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
        >
          <button
            onClick={() =>
              handleContentSelectionDropdownClick(handleNewSubheader)
            }
            className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.subHeader[lang!]}
          </button>

          <button
            onClick={() =>
              handleContentSelectionDropdownClick(handleNewSmallSubheader)
            }
            className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.smallSubHeader[lang!]}
          </button>

          <button
            onClick={() =>
              handleContentSelectionDropdownClick(handleNewPlainText)
            }
            className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.plainText[lang!]}
          </button>

          <button
            onClick={() =>
              handleContentSelectionDropdownClick(handleNewImagesCollection)
            }
            className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.imageCollection[lang!]}
          </button>

          <button
            onClick={() => handleContentSelectionDropdownClick(handleNewList)}
            className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.itemsList[lang!]}
          </button>

          <button
            onClick={() =>
              handleContentSelectionDropdownClick(() => handleNewLink(false))
            }
            className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.linkWithoutAnnotation[lang!]}
          </button>

          <button
            onClick={() =>
              handleContentSelectionDropdownClick(() => handleNewLink(true))
            }
            className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            role="menuitem"
          >
            {translations.linkWithAnnotation[lang!]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTechnologyContent;
