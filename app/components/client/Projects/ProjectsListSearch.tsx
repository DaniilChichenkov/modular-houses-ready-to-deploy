const ProjectsListSearch = () => {
  return (
    <div className="mb-10 md:w-5/12">
      <label htmlFor="Search">
        <span className="text-sm font-medium text-gray-700">
          {" "}
          Поиск по названию{" "}
        </span>

        <div className="relative">
          <input
            type="text"
            id="Search"
            className="mt-0.5 w-full rounded border-gray-300 pe-10 py-2 shadow-sm sm:text-sm shadow-gray-600 pl-2"
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
