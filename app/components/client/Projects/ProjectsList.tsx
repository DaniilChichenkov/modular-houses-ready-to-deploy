import ProjectsListItem from "./ProjectsListItem";

const ProjectsList = () => {
  return (
    <div className="w-full grid grid-cols-1 gap-y-8 relative z-0 md:grid-cols-2 md:grid-rows-2 md:gap-x-5 lg:grid-cols-3">
      <ProjectsListItem />
      <ProjectsListItem />
      <ProjectsListItem />
      <ProjectsListItem />
      <ProjectsListItem />
      <ProjectsListItem />
      <ProjectsListItem />
      <ProjectsListItem />
      <ProjectsListItem />
    </div>
  );
};

export default ProjectsList;
