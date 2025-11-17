import { useEffect, useRef } from "react";
import { useFetcher, useLocation } from "@remix-run/react";

import useClientProjectsStore from "~/stores/ClientProjectsStore";

const translations = {
  search: {
    rus: "Поиск по названию",
    est: "Otsi nime järgi",
    en: "Search by name",
    nor: "Søk etter navn",
  },
};

const ProjectsListSearch = () => {
  const fetcher = useFetcher<{
    projects: any[];
    hasMoreProjects: boolean;
  }>();

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

  //This ref will hold debounce
  const searchDebounce = useRef<any | null>(null);

  //Projects Store
  const projects = useClientProjectsStore((state) => state.projects);
  const setFetcherState = useClientProjectsStore(
    (state) => state.setFetcherState
  );
  const setHasMore = useClientProjectsStore((state) => state.setHasMore);
  const setProjects = useClientProjectsStore((state) => state.setProjects);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Clear previous timeout
    clearTimeout(searchDebounce.current);

    //Set new timeout
    searchDebounce.current = setTimeout(async () => {
      //Set search in url
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("projectsSearch", e.target.value.trim());

      //Change projects page back to 1
      newUrl.searchParams.set("projectsPage", "1");

      //Replace URL with new one
      window.history.replaceState({}, "", newUrl.toString());

      //Make a request to API
      const requestUrl = `/api/projects/?${newUrl.searchParams.toString()}`;

      fetcher.load(requestUrl);
    }, 500);
  };

  //Keep track of fetcher.state (Disable / Enable load more button)
  useEffect(() => {
    setFetcherState(fetcher.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state]);

  //Handle response
  useEffect(() => {
    //If request was successful
    if (fetcher.data) {
      //Check if more projects could be fetched
      if (
        fetcher.data.hasMoreProjects !== undefined &&
        fetcher.data.hasMoreProjects !== null
      ) {
        setHasMore(fetcher.data.hasMoreProjects);
      }

      //Replace projects
      setProjects(fetcher.data.projects);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <div className="mb-5 mt:mb-0 w-full">
      <label htmlFor="Search">
        <span className="text-sm md:text-lg font-bold text-gray-900">
          {" "}
          {translations["search"][currentLang]}{" "}
        </span>

        <div className="relative">
          <input
            type="text"
            id="Search"
            onInput={handleSearchInput}
            className="mt-0.5 w-full rounded border-gray-300 pe-10 py-2 md:py-4 shadow-sm sm:text-sm md:text-lg shadow-gray-600 pl-2"
          />

          <span className="absolute inset-y-0 right-2 grid w-8 place-content-center">
            <button
              type="button"
              aria-label="Submit"
              className="rounded-full p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </span>
        </div>
      </label>
    </div>
  );
};

export default ProjectsListSearch;
