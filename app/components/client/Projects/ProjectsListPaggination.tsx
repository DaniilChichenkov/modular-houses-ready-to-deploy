import { useLocation } from "@remix-run/react";

import useClientProjectsStore from "~/stores/ClientProjectsStore";

const translations = {
  showMore: {
    rus: "Показать больше",
    est: "Näita rohkem",
    en: "Show more",
    nor: "Vis mer",
  },
};

const ProjectsListPaggination = () => {
  //Get lang
  const location = useLocation();
  type Lang = "rus" | "est" | "en" | "nor";
  const searchLang = new URLSearchParams(location.search).get("lang");
  const currentLang: Lang =
    searchLang === "rus" ||
    searchLang === "est" ||
    searchLang === "en" ||
    searchLang === "nor"
      ? searchLang
      : "en";

  const fetchNextPageProjects = useClientProjectsStore(
    (state) => state.fetchNextPageProjects
  );
  const fetcherState = useClientProjectsStore((state) => state.fetcherState);
  const hasMoreProjects = useClientProjectsStore((state) => state.hasMore);

  return (
    <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm mt-5">
      {hasMoreProjects ? (
        <button
          disabled={fetcherState !== "idle"}
          onClick={fetchNextPageProjects!}
          className="px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
        >
          {translations["showMore"][currentLang]}
        </button>
      ) : null}
    </span>
  );
};

export default ProjectsListPaggination;
