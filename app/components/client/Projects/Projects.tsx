import { SlidersHorizontal } from "lucide-react";

import ProjectsList from "./ProjectsList";
import ProjectsListFilter from "./ProjectsListFilter";
import ProjectsListPaggination from "./ProjectsListPaggination";
import ProjectsListSearch from "./ProjectsListSearch";
import ProjectDetailedSearchModal from "./ProjectDetailedSearchModal";

import useProjectDetailedSearchModalStore from "~/stores/ProjectDetailedSearchModalStore";

const Projects = ({
  projects,
}: {
  projects: {
    _id: string;
    title: string;
    quickDesc: string;
    fullDesc: string;
    isDiscount: boolean;
    price: number;
    newPrice: number;
    isPopular: boolean;
    imagesFolder: string;
    featuresList: string;
  }[];
}) => {
  const openProjectDetailedSearchModal = useProjectDetailedSearchModalStore(
    (state) => state.openModal
  );

  const handleOpenProjectDetailedSearchModalButtonClick = () => {
    openProjectDetailedSearchModal();
  };

  return (
    <section id="projects" className="py-10">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-start lg:gap-8">
          <div className="lg:col-span-1">
            <div className="max-w-lg lg:max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                Проекты
              </h2>

              <p className="mt-4 text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                doloremque saepe architecto maiores repudiandae amet perferendis
                repellendus, reprehenderit voluptas sequi.
              </p>
            </div>
          </div>

          {/* List of projects */}
          <div className="lg:col-span-3">
            {/* Search and filter */}
            <div className="mb-5 md:mt-5 lg:mt-0 flex flex-col lg:flex items-center sm:items-start">
              {/* Filter for the list */}
              {/* <ProjectsListFilter /> */}

              {/* Search */}
              <ProjectsListSearch />

              {/* Button to open modal with detailed search */}
              <button
                onClick={handleOpenProjectDetailedSearchModalButtonClick}
                className="inline-flex items-center gap-5 rounded-sm border border-indigo-600 bg-indigo-600 px-8 py-3 text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
              >
                <span className="text-sm font-medium">
                  {" "}
                  Открыть детальный поиск{" "}
                </span>

                <SlidersHorizontal />
              </button>
            </div>

            {/* List */}
            <ProjectsList projects={projects} />

            {/* Paggination (Load more button) */}
            <div className="w-full flex justify-center items-center mt-5">
              <ProjectsListPaggination />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
