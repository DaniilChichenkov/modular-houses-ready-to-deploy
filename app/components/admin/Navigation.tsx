import { AlignJustify } from "lucide-react";

type Props = {
  toggleSideMenu: () => void;
};

const Navigation = ({ toggleSideMenu }: Props) => {
  return (
    <header className="bg-white lg:hidden">
      <div className="mx-auto flex h-16 max-w-screen-xl justify-end items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSideMenu}
            className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 lg:hidden"
          >
            <AlignJustify />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
