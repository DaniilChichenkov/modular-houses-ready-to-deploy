import ProjectsList from "./ProjectsList";
import ProjectsListFilter from "./ProjectsListFilter";
import ProjectsListPaggination from "./ProjectsListPaggination";
import ProjectsListSearch from "./ProjectsListSearch";

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
              <ProjectsListFilter />

              {/* Search */}
              <ProjectsListSearch />
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
