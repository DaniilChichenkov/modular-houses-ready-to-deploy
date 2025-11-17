import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "@remix-run/react";

import "flag-icons/css/flag-icons.min.css";

const LanguageSelection = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const nav = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentLang = searchParams.get("lang");

  const [currentlyActiveFlagIcon, setCurrentlyUsedFlagIcon] = useState<string>(
    `fi fi-${
      currentLang === "est"
        ? "ee"
        : currentLang === "en"
        ? "gb-eng"
        : currentLang === "rus"
        ? "ru"
        : currentLang === "nor"
        ? "no"
        : ""
    }`
  );

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLanguageSelectionButtonClick = (lang: string) => {
    switch (lang) {
      case "est":
        setCurrentlyUsedFlagIcon("fi fi-ee");
        break;

      case "rus":
        setCurrentlyUsedFlagIcon("fi fi-ru");
        break;

      case "nor":
        setCurrentlyUsedFlagIcon("fi fi-no");
        break;

      case "en":
        setCurrentlyUsedFlagIcon("fi fi-gb-eng");
        break;
    }

    //Change language
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    searchParams.set("lang", lang);
    nav(`${window.location.pathname}?${searchParams}`);

    closeDropdown();
  };

  return (
    <div className="relative inline-flex">
      {/* Open button */}
      <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
        <button
          onClick={toggleDropdown}
          type="button"
          className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative flex justify-between items-center gap-x-2"
        >
          {currentLang?.toUpperCase()}
          <span className={currentlyActiveFlagIcon}></span>
        </button>

        <button
          onClick={toggleDropdown}
          type="button"
          className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
          aria-label="Menu"
        >
          <p
            className={`p-0 m-0 translate-transform  duration-200 ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown />
          </p>
        </button>
      </span>

      <div
        role="menu"
        className={`absolute ${
          dropdownOpen ? "block" : "hidden"
        } end-0 top-12 z-auto w-56 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
      >
        <button
          onClick={() => handleLanguageSelectionButtonClick("est")}
          className="w-full flex justify-start gap-x-5 items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          EST
          <span className="fi fi-ee"></span>
        </button>

        <button
          onClick={() => handleLanguageSelectionButtonClick("en")}
          className="w-full flex justify-start gap-x-5 items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          ENG
          <span className="fi fi-gb-eng"></span>
        </button>

        <button
          onClick={() => handleLanguageSelectionButtonClick("rus")}
          className="w-full flex justify-start gap-x-5 items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          RUS
          <span className="fi fi-ru"></span>
        </button>

        <button
          onClick={() => handleLanguageSelectionButtonClick("nor")}
          className="w-full flex justify-start gap-x-5 items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          NOR
          <span className="fi fi-no"></span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelection;
