type Props = {
  marginTop: number;
  isVisible: boolean;
  handleNavigationItemClick: (id: string) => void;
};

const NavigationMenuMobile = ({
  marginTop,
  isVisible,
  handleNavigationItemClick,
}: Props) => {
  return (
    <div
      role="menu"
      style={{ top: `${marginTop + 0.2}rem` }}
      className={`absolute ${
        isVisible ? "" : "hidden"
      } left-1/2 transform -translate-x-1/2 w-11/12 overflow-hidden rounded border border-gray-300 bg-white shadow-sm z-20`}
    >
      <button
        onClick={() => handleNavigationItemClick("projects")}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        Проекты
      </button>

      <button
        onClick={() => handleNavigationItemClick("technology")}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        Технология
      </button>

      <button
        onClick={() => handleNavigationItemClick("gallery")}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        Галерея
      </button>

      <button
        onClick={() => handleNavigationItemClick("contacts")}
        className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
        role="menuitem"
      >
        Контакты
      </button>
    </div>
  );
};

export default NavigationMenuMobile;
