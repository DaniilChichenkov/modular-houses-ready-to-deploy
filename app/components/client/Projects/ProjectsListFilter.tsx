import { useState, useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { ChevronDown } from "lucide-react";

import useClientProjectsStore from "~/stores/ClientProjectsStore";

const ProjectsListFilter = () => {
  const fetcher = useFetcher<{
    hasMoreProjects: boolean;
    projects: any[];
  }>();

  const [openedFilterDropdownId, setOpenedFilterDropdownId] = useState<
    number | null
  >(null);

  //State manager
  const setFetcherState = useClientProjectsStore(
    (state) => state.setFetcherState
  );
  const setProjects = useClientProjectsStore((state) => state.setProjects);
  const setHasMore = useClientProjectsStore((state) => state.setHasMore);

  //Inputs refs (Will be used to remove values when user clicks "Drop filters")
  const roomsQtyFormRef = useRef<HTMLFormElement | null>(null);
  const priceFormRef = useRef<HTMLFormElement | null>(null);
  const areaFormRef = useRef<HTMLFormElement | null>(null);
  const floorsQtyFormRef = useRef<HTMLFormElement | null>(null);

  //Track filters and order by dropdowns state (Open / closed)
  const [orderByOpened, setOrderByOpened] = useState<boolean>(false);
  const [filtersOpened, setFiltersOpened] = useState<boolean>(false);

  const handleFilterSelectorClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();

    //If user clicked twice on the same filter - close it
    if (id === openedFilterDropdownId) {
      setOpenedFilterDropdownId(null);
    } else {
      setOpenedFilterDropdownId(id);
    }
  };

  //Handle URL search params change
  const changeUrlSearchParams = (params: string, value: string) => {
    //Create new url
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(params, value.trim());

    //Replace URL with new one
    window.history.replaceState({}, "", newUrl.toString());
  };

  //Handle one URL search param delete
  const handleOneUrlSearchParamsDelete = (params: string) => {
    //Create new url
    const newUrl = new URL(window.location.href);
    const searchParams = newUrl.searchParams;
    const searchParamsString = searchParams.toString();

    if (searchParamsString.includes(`${params}Min`)) {
      searchParams.delete(`${params}Min`);
    }
    if (searchParamsString.includes(`${params}Max`)) {
      searchParams.delete(`${params}Max`);
    }

    //Replace URL
    window.history.replaceState({}, "", newUrl.toString());
  };

  //Handle all filters-related search params delete (Related to Projects section)
  const handleAllUrlSearchParamsDelete = () => {
    //Clear params from URL
    handleOneUrlSearchParamsDelete("projectsArea");
    handleOneUrlSearchParamsDelete("projectsFloorsQty");
    handleOneUrlSearchParamsDelete("projectsRoomsQty");
    handleOneUrlSearchParamsDelete("projectsPrice");

    //Reset forms
    roomsQtyFormRef.current?.reset();
    priceFormRef.current?.reset();
    areaFormRef.current?.reset();
    floorsQtyFormRef.current?.reset();
  };

  //Handle rooms qty filter
  const handleRoomsQtyFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    //Handle min rooms qty
    if (target.id === "minRoomsQty") {
      //Change URL search params
      changeUrlSearchParams("projectsRoomsQtyMin", target.value);
    } else if (target.id === "maxRoomsQty") {
      changeUrlSearchParams("projectsRoomsQtyMax", target.value);
    }
  };

  //Handle price filter
  const handlePriceFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    //Handle min price
    if (target.id === "priceMin") {
      changeUrlSearchParams("projectsPriceMin", target.value);

      //Handle max price
    } else if (target.id === "priceMax") {
      changeUrlSearchParams("projectsPriceMax", target.value);
    }
  };

  //Handle area
  const handleAreaFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.id === "areaMin") {
      changeUrlSearchParams("projectsAreaMin", target.value);
    } else if (target.id === "areaMax") {
      changeUrlSearchParams("projectsAreaMax", target.value);
    }
  };

  //Handle floors qty
  const handleFloorsFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (target.id === "floorsQtyMin") {
      changeUrlSearchParams("projectsFloorsQtyMin", target.value);
    } else if (target.id === "floorsQtyMax") {
      changeUrlSearchParams("projectsFloorsQtyMax", target.value);
    }
  };

  //Handle order by (Price for now)
  const handleOrderBy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    changeUrlSearchParams("sortByPrice", target.value);
  };

  //Handle order by applying
  const handleOrderByApplying = () => {
    //Set reshuffle flag
    const url = new URL(window.location.href);
    url.searchParams.set("reshuffle", String(true));
    window.history.replaceState({}, "", url);

    //Send request
    const searchParams = url.searchParams.toString();
    fetcher.load(`/api/projects?${searchParams}`);
  };

  //Handle order by clear (All)
  const handleOrderByClear = () => {
    //Set reshuffle flag
    const url = new URL(window.location.href);
    url.searchParams.set("reshuffle", String(true));

    //Remove order by from url
    url.searchParams.delete("sortByPrice");

    //Append new URL
    window.history.replaceState({}, "", url);

    //Send request
    const searchParams = url.searchParams.toString();
    fetcher.load(`/api/projects?${searchParams}`);
  };

  //Handle order by clear (Single)
  const handleSingleOrderByClear = (orderPreference: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(orderPreference);
    window.history.replaceState({}, "", url);
  };

  //Handle filters apply
  const handleFiltersApplying = () => {
    //Close dropdowns (UI)
    setOpenedFilterDropdownId(null);

    const url = new URL(window.location.href);
    url.searchParams.set("projectsPage", String(1));

    //Replace URL
    window.history.replaceState({}, "", url.toString());

    const searchParams = url.searchParams.toString();
    fetcher.load(`/api/projects?${searchParams}`);
  };

  //Handle filters drop
  const handleFiltersDrop = () => {
    //Close dropdowns (UI)
    setOpenedFilterDropdownId(null);

    //Clear URL
    handleAllUrlSearchParamsDelete();

    //Make a request
    const url = new URL(window.location.href);
    url.searchParams.set("projectsPage", String(1));

    //Replace URL
    window.history.replaceState({}, "", url.toString());

    const searchParams = url.searchParams.toString();
    fetcher.load(`/api/projects?${searchParams}`);
  };

  const toggleOrderByOrFiltersDropdown = (dropdown: string) => {
    if (dropdown === "filters") {
      setFiltersOpened((prev) => !prev);
    } else if (dropdown === "orderBy") {
      setOrderByOpened((prev) => !prev);
    }
  };

  //Track fetcher state
  useEffect(() => {
    setFetcherState(fetcher.state);

    if (fetcher.data) {
      //Remove reshuffle flag
      const url = new URL(window.location.href);
      if (url.searchParams.has("reshuffle", String(true))) {
        url.searchParams.delete("reshuffle");
        window.history.replaceState({}, "", url);
      }

      //Disable / Enable "Load more" button
      setHasMore(fetcher.data.hasMoreProjects);

      //Replace data in state manager
      setProjects(fetcher.data.projects);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state]);

  return (
    <div className="w-full mt-10 md:mt-0">
      {/* Filters */}
      <button
        onClick={() => toggleOrderByOrFiltersDropdown("filters")}
        className={`text-xl font-semibold text-gray-900 sm:text-2xl flex justify-start items-center gap-x-3 ${
          !filtersOpened && "mb-10"
        }`}
      >
        Filters
        <ChevronDown
          className={`transition-transform duration-200 ${
            filtersOpened && "rotate-180"
          }`}
        />
      </button>
      <div className={`${!filtersOpened && "hidden"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 items-start gap-4 sm:gap-6 mb-5 mt-5 md:mt-5 relative z-40">
          {/* Qty of rooms selection */}
          <details
            open={openedFilterDropdownId === 0}
            className="group relative"
          >
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

            <div className="z-40 w-64 divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-sm group-open:absolute group-open:start-0 md:group-open:start-0 group-open:top-8">
              <div className="flex items-center justify-between px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    //Remove search params from url
                    handleOneUrlSearchParamsDelete("projectsRoomsQty");

                    //Clear input values
                    if (roomsQtyFormRef.current) {
                      roomsQtyFormRef.current.reset();
                    }
                  }}
                  className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                >
                  Сбросить
                </button>
              </div>

              <form
                ref={roomsQtyFormRef}
                className="flex items-center gap-3 p-3"
              >
                <label htmlFor="minRoomsQty">
                  <span className="text-sm text-gray-700"> Min </span>

                  <input
                    type="number"
                    id="minRoomsQty"
                    min={1}
                    onInput={handleRoomsQtyFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>

                <label htmlFor="maxRoomsQty">
                  <span className="text-sm text-gray-700"> Max </span>

                  <input
                    type="number"
                    id="maxRoomsQty"
                    min={1}
                    onInput={handleRoomsQtyFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>
              </form>
            </div>
          </details>

          {/* Price selection */}
          <details
            open={openedFilterDropdownId === 1}
            className="group relative"
          >
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
                <button
                  onClick={() => {
                    //Remove search params from url
                    handleOneUrlSearchParamsDelete("projectsPrice");

                    //Clear input values
                    if (priceFormRef.current) {
                      priceFormRef.current.reset();
                    }
                  }}
                  type="button"
                  className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                >
                  Сбросить
                </button>
              </div>

              <form ref={priceFormRef} className="flex items-center gap-3 p-3">
                <label htmlFor="priceMin">
                  <span className="text-sm text-gray-700"> Min </span>

                  <input
                    type="number"
                    id="priceMin"
                    onInput={handlePriceFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>

                <label htmlFor="priceMax">
                  <span className="text-sm text-gray-700"> Max </span>

                  <input
                    type="number"
                    id="priceMax"
                    onInput={handlePriceFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>
              </form>
            </div>
          </details>

          {/* Area */}
          <details
            open={openedFilterDropdownId === 3}
            className="group relative"
          >
            <summary
              onClick={(e) => handleFilterSelectorClick(e, 3)}
              className="cursor-pointer flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
            >
              <span className="text-sm font-medium"> Площадь </span>

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
                <button
                  onClick={() => {
                    //Remove search params from url
                    handleOneUrlSearchParamsDelete("projectsArea");

                    //Clear input values
                    if (areaFormRef.current) {
                      areaFormRef.current.reset();
                    }
                  }}
                  type="button"
                  className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                >
                  Сбросить
                </button>
              </div>

              <form ref={areaFormRef} className="flex items-center gap-3 p-3">
                <label htmlFor="areaMin">
                  <span className="text-sm text-gray-700"> Min </span>

                  <input
                    type="number"
                    id="areaMin"
                    onInput={handleAreaFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>

                <label htmlFor="areaMax">
                  <span className="text-sm text-gray-700"> Max </span>

                  <input
                    type="number"
                    id="areaMax"
                    onInput={handleAreaFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>
              </form>
            </div>
          </details>

          {/* Floors qty */}
          <details
            open={openedFilterDropdownId === 4}
            className="group relative"
          >
            <summary
              onClick={(e) => handleFilterSelectorClick(e, 4)}
              className="cursor-pointer flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
            >
              <span className="text-sm font-medium"> Колличество этажей </span>

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
                <button
                  onClick={() => {
                    //Remove search params from url
                    handleOneUrlSearchParamsDelete("projectsFloorsQty");

                    //Clear input values
                    if (floorsQtyFormRef.current) {
                      floorsQtyFormRef.current.reset();
                    }
                  }}
                  type="button"
                  className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                >
                  Сбросить
                </button>
              </div>

              <form
                ref={floorsQtyFormRef}
                className="flex items-center gap-3 p-3"
              >
                <label htmlFor="floorsQtyMin">
                  <span className="text-sm text-gray-700"> Min </span>

                  <input
                    type="number"
                    id="floorsQtyMin"
                    onInput={handleFloorsFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>

                <label htmlFor="floorsQtyMax">
                  <span className="text-sm text-gray-700"> Max </span>

                  <input
                    type="number"
                    id="floorsQtyMax"
                    onInput={handleFloorsFilter}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                  />
                </label>
              </form>
            </div>
          </details>
        </div>
        <div className="mb-10 flex flex-col md:flex-row justify-start items-center w-full gap-y-5 md:gap-x-5">
          {/* Apply filters button */}
          <button
            onClick={handleFiltersApplying}
            className="w-full md:w-4/12 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
          >
            Apply filters
          </button>

          {/* Clear all filters btn */}
          <button
            onClick={handleFiltersDrop}
            className="w-full md:w-4/12 inline-block rounded-sm border border-red-600 bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600"
          >
            Drop filters
          </button>
        </div>
      </div>

      {/* Order by */}
      <button
        onClick={() => toggleOrderByOrFiltersDropdown("orderBy")}
        className={`text-xl font-semibold text-gray-900 sm:text-2xl flex justify-start items-center gap-x-3 ${
          !orderByOpened && "mb-10"
        }`}
      >
        Order by
        <ChevronDown
          className={`transition-transform duration-200 ${
            orderByOpened && "rotate-180"
          }`}
        />
      </button>
      <div className={`${!orderByOpened && "hidden"}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 items-start gap-4 sm:gap-6 mb-5 mt-5 md:mt-5 relative z-30">
          {/* Order by price */}
          <details
            open={openedFilterDropdownId === 2}
            className="group relative"
          >
            <summary
              onClick={(e) => handleFilterSelectorClick(e, 2)}
              className="cursor-pointer flex items-center gap-2 border-b border-gray-300 pb-1 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 [&::-webkit-details-marker]:hidden"
            >
              <span className="text-sm font-medium">
                {" "}
                Упорядочить по цене:{" "}
              </span>

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
                  onClick={() => handleSingleOrderByClear("sortByPrice")}
                  type="button"
                  className="text-sm text-gray-700 underline transition-colors hover:text-gray-900"
                >
                  Сбросить
                </button>
              </div>

              <fieldset className="p-3">
                <legend className="sr-only">Sort Projects by Price</legend>

                <div className="flex flex-col items-start gap-3">
                  <label
                    htmlFor="orderByPriceInc"
                    className="inline-flex items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="orderBy"
                      className="size-5 rounded border-gray-300 shadow-sm"
                      id="orderByPriceInc"
                      value="asc"
                      onChange={handleOrderBy}
                    />

                    <span className="text-sm font-medium text-gray-700">
                      {" "}
                      Цена по возрастанию{" "}
                    </span>
                  </label>

                  <label
                    htmlFor="orderByPriceDec"
                    className="inline-flex items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="orderBy"
                      className="size-5 rounded border-gray-300 shadow-sm"
                      id="orderByPriceDec"
                      value="desc"
                      onChange={handleOrderBy}
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
        </div>

        <div className="mb-10 flex flex-col md:flex-row justify-start items-center w-full gap-y-5 md:gap-x-5">
          {/* Apply preferences button */}
          <button
            onClick={handleOrderByApplying}
            className="w-full md:w-4/12 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
          >
            Apply preferences
          </button>

          {/* Clear preferences button */}
          <button
            onClick={handleOrderByClear}
            className="w-full md:w-4/12 inline-block rounded-sm border border-red-600 bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600"
          >
            Clear preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsListFilter;
