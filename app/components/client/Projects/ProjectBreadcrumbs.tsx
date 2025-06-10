import { ChevronRight } from "lucide-react";
import { Link } from "@remix-run/react";

type Props = {
  projectTitle: string;
};

const ProjectBreadcrumbs = ({ projectTitle }: Props) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-gray-700">
        <li>
          <Link to="/" className="block transition-colors hover:text-gray-900">
            Главная
          </Link>
        </li>

        <li className="rtl:rotate-180">
          <ChevronRight size={16} />
        </li>

        <li>
          <Link to="/" className="block transition-colors hover:text-gray-900">
            Проекты
          </Link>
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
