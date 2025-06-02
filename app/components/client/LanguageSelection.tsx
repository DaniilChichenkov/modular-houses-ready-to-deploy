import { useState } from "react";
import { ChevronDown } from "lucide-react";

const LanguageSelection = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-flex">
      {/* Open button */}
      <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
        <button
          onClick={toggleDropdown}
          type="button"
          className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
        >
          EST
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
          onClick={closeDropdown}
          className="w-full block px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          EST
        </button>

        <button
          onClick={closeDropdown}
          className="w-full block px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          ENG
        </button>

        <button
          onClick={closeDropdown}
          className="w-full block px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          RUS
        </button>

        <button
          onClick={closeDropdown}
          className="w-full block px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
          role="menuitem"
        >
          NOR
        </button>
      </div>
    </div>
  );
};

export default LanguageSelection;
