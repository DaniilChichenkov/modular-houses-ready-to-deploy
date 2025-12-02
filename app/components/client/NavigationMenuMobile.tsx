import { useLocation, useNavigate } from "@remix-run/react";

type Props = {
  marginTop: number;
  isVisible: boolean;
  handleNavigationItemClick: () => void;
};
import scrollToElementById from "~/utils/scrollToElementById";

const translations = {
  projects: {
    rus: "Проекты",
    est: "Projektid",
    en: "Projects",
    nor: "Prosjekter",
  },
  technology: {
    rus: "Технология",
    est: "Tehnoloogia",
    en: "Technology",
    nor: "Teknologi",
  },
  gallery: {
    rus: "Галерея",
    est: "Galerii",
    en: "Gallery",
    nor: "Galleri",
  },
  contacts: {
    rus: "Контакты",
    est: "Kontaktid",
    en: "Contacts",
    nor: "Kontakter",
  },
};

const NavigationMenuMobile = ({
  marginTop,
  isVisible,
  handleNavigationItemClick,
}: Props) => {
  //Get lang
  const location = useLocation();
  type Lang = "rus" | "est" | "en" | "nor";
  const searchLang = new URLSearchParams(location.search).get("lang");
  const currentLang: Lang =
    searchLang === "rus" ||
    searchLang === "est" ||
    searchLang === "en" ||
    searchLang === "nor"
      ? searchLang
      : "en";

  //Handle navigation button click
  const nav = useNavigate();
  const handleNavigationClick = (elementId: string) => {
    if (location.pathname !== "/") {
      const url = new URL(window.location.href);

      //Add element which page should be scrolled to (If provided)
      if (elementId) url.searchParams.set("scrollToElement", elementId);

      const urlSearch = url.searchParams.toString();
      nav(`/?${urlSearch}`);
    } else {
      scrollToElementById(elementId);
    }
  };

  return (
    <div
      role="menu"
      style={{ top: `${marginTop + 0.2}rem` }}
      className={`absolute ${
        isVisible ? "" : "hidden"
      } left-1/2 transform -translate-x-1/2 w-11/12 overflow-hidden rounded border border-gray-300 bg-white shadow-sm z-20`}
    >
      <button
        onClick={() => {
          handleNavigationClick("projects");
          handleNavigationItemClick();
        }}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        {translations["projects"][currentLang]}
      </button>

      <button
        onClick={() => {
          handleNavigationClick("technology");
          handleNavigationItemClick();
        }}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        {translations["technology"][currentLang]}
      </button>

      <button
        onClick={() => {
          handleNavigationClick("gallery");
          handleNavigationItemClick();
        }}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        {translations["gallery"][currentLang]}
      </button>

      <button
        onClick={() => {
          handleNavigationClick("contacts");
          handleNavigationItemClick();
        }}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        {translations["contacts"][currentLang]}
      </button>
    </div>
  );
};

export default NavigationMenuMobile;
