import { ChevronRight } from "lucide-react";
import { useNavigate } from "@remix-run/react";

type Props = {
  projectTitle: string;
};

const ProjectBreadcrumbs = ({ projectTitle }: Props) => {
  const nav = useNavigate();

  //Handle navigation (With preserving URL state)
  const handleNavigation = (elementToScrollTo?: string) => {
    const url = new URL(window.location.href);

    //Add element which page should be scrolled to (If provided)
    if (elementToScrollTo)
      url.searchParams.set("scrollToElement", elementToScrollTo);

    const urlSearch = url.searchParams.toString();

    nav(`/?${urlSearch}`);
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-gray-700">
        <li>
          <button
            onClick={() => handleNavigation()}
            className="block transition-colors hover:text-gray-900"
          >
            Главная
          </button>
        </li>

        <li className="rtl:rotate-180">
          <ChevronRight size={16} />
        </li>

        <li>
          <button
            onClick={() => handleNavigation("projects")}
            className="block transition-colors hover:text-gray-900"
          >
            Проекты
          </button>
        </li>

        <li className="rtl:rotate-180">
          <ChevronRight size={16} />
        </li>

        <li>
          <p className="block font-semibold text-gray-900">{projectTitle}</p>
        </li>
      </ol>
    </nav>
  );
};

export default ProjectBreadcrumbs;
