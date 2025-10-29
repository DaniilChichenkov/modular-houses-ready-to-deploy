import ProjectsListItem from "./ProjectsListItem";

import useClientProjectsStore from "~/stores/ClientProjectsStore";

const ProjectsList = ({
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
  //This is made to always render non-empty arr of products (SSR friendly)
  const projectsFromStore = useClientProjectsStore((state) => state.projects);

  const projectsToRender =
    projectsFromStore !== undefined ? projectsFromStore : projects;

  return (
    <div className="w-full grid grid-cols-1 gap-y-8 relative z-0 md:grid-cols-2 md:grid-rows-2 md:gap-x-5 lg:grid-cols-3">
      {projectsToRender.map((item) => (
        <ProjectsListItem
          key={item.title}
          _id={item._id}
          title={item.title}
          isDiscount={item.isDiscount}
          isPopular={item.isPopular}
          price={item.price}
          newPrice={item.newPrice}
          quickDesc={JSON.parse(item.quickDesc)}
          imagesFolder={item.imagesFolder}
        />
      ))}
    </div>
  );
};

export default ProjectsList;
