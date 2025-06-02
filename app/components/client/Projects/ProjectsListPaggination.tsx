import { ArrowRight, ArrowLeft } from "lucide-react";

const ProjectsListPaggination = () => {
  return (
    <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm mt-5">
      {/* <button
        type="button"
        className="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
      >
        <ArrowLeft />
      </button> */}

      <button className="px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative">
        Показать больше
      </button>

      {/* <button
        type="button"
        className="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
      >
        <ArrowRight />
      </button> */}
    </span>
  );
};

export default ProjectsListPaggination;
