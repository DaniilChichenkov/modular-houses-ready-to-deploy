import { useState } from "react";

const ProjectsListFilter = () => {
  const [openedFilterDropdownId, setOpenedFilterDropdownId] = useState<
    number | null
  >(null);

  const handleFilterSelectorClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();

    //If user clicked twice on the same filter - close it
    if (id === openedFilterDropdownId) {
      setOpenedFilterDropdownId(null);
    } else {
      setOpenedFilterDropdownId(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 items-start gap-4 sm:gap-6 mb-10 mt-10 md:mt-0 relative z-30">
      {/* Qty of rooms selection */}
      <details open={openedFilterDropdownId === 0} className="group relative">
        <summary
          onClick={(e) => handleFilterSelectorClick(e, 0)}
          className="cursor-pointer flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
        >
          <span className="text-sm font-medium"> Колличество комнат </span>

          <span className="transition-transform group-open:-rotate-180">
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </summary>

        <div className="z-40 w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 group-open:top-8">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-700">
              {" "}
              Выбранно <strong>2</strong>{" "}
            </span>

            <button
              type="button"
              className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
            >
              Сбросить
            </button>
          </div>

          <fieldset className="p-3">
            <legend className="sr-only">Checkboxes</legend>

            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="Option1"
                className="inline-flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  className="size-5 rounded border-gray-300 shadow-sm"
                  id="Option1"
                />

                <span className="text-sm font-medium text-gray-700"> 1 </span>
              </label>

              <label
                htmlFor="Option2"
                className="inline-flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  className="size-5 rounded border-gray-300 shadow-sm"
                  id="Option2"
                />

                <span className="text-sm font-medium text-gray-700"> 2 </span>
              </label>

              <label
                htmlFor="Option3"
                className="inline-flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  className="size-5 rounded border-gray-300 shadow-sm"
                  id="Option3"
                />

                <span className="text-sm font-medium text-gray-700"> 3 </span>
              </label>
            </div>
          </fieldset>
        </div>
      </details>

      {/* Price selection */}
      <details open={openedFilterDropdownId === 1} className="group relative">
        <summary
          onClick={(e) => handleFilterSelectorClick(e, 1)}
          className="cursor-pointer flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
        >
          <span className="text-sm font-medium"> Цена </span>

          <span className="transition-transform group-open:-rotate-180">
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </summary>

        <div className="z-40 w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 md:group-open:start-0 group-open:top-8">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-700">
              {" "}
              Максимальная цена $60000{" "}
            </span>

            <button
              type="button"
              className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
            >
              Сбросить
            </button>
          </div>

          <div className="flex items-center gap-3 p-3">
            <label htmlFor="MinPrice">
              <span className="text-sm text-gray-700"> Min </span>

              <input
                type="number"
                id="MinPrice"
                value="0"
                className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
              />
            </label>

            <label htmlFor="MaxPrice">
              <span className="text-sm text-gray-700"> Max </span>

              <input
                type="number"
                id="MaxPrice"
                value="60000"
                className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
              />
            </label>
          </div>
        </div>
      </details>

      {/* Order by */}
      <details open={openedFilterDropdownId === 2} className="group relative">
        <summary
          onClick={(e) => handleFilterSelectorClick(e, 2)}
          className="cursor-pointer flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
        >
          <span className="text-sm font-medium"> Упорядочить по: </span>

          <span className="transition-transform group-open:-rotate-180">
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
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </summary>

        <div className="z-40 w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 group-open:top-8">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-700">
              {" "}
              Выбранно: <strong>Цена по возрастанию</strong>{" "}
            </span>

            <button
              type="button"
              className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
            >
              Сбросить
            </button>
          </div>

          <fieldset className="p-3">
            <legend className="sr-only">Radio buttons</legend>

            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="RadioOption1"
                className="inline-flex items-center gap-3"
              >
                <input
                  type="radio"
                  name="orderBy"
                  className="size-5 rounded border-gray-300 shadow-sm"
                  id="RadioOption1"
                />

                <span className="text-sm font-medium text-gray-700">
                  {" "}
                  Цена по возрастанию{" "}
                </span>
              </label>

              <label
                htmlFor="RadioOption2"
                className="inline-flex items-center gap-3"
              >
                <input
                  type="radio"
                  name="orderBy"
                  className="size-5 rounded border-gray-300 shadow-sm"
                  id="RadioOption2"
                />

                <span className="text-sm font-medium text-gray-700">
                  {" "}
                  Цена по убыванию{" "}
                </span>
              </label>
            </div>
          </fieldset>
        </div>
      </details>

      {/* Clear all filters btn */}
      <button className="cursor-pointer flex items-center gap-2 border-b border-red-300 pb-1 text-red-700 transition-colors hover:border-red-400 hover:text-red-900 ">
        Сбросить все фильтры
      </button>
    </div>
  );
};

export default ProjectsListFilter;
