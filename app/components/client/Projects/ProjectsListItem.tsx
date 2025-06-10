import { Link } from "@remix-run/react";

import { type ProductsItemProps } from "~/types/productsTypes";

import home from "/src/house.jpg";

const ProjectsListItem = ({
  id,
  name,
  desc,
  currentPrice,
  isPopular,
  previousPrice,
  hasDiscount,
}: ProductsItemProps) => {
  return (
    <Link
      to={`/products/${id}`}
      className="group relative block overflow-hidden"
    >
      {isPopular && (
        <button className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 px-4 text-gray-900 transition hover:text-gray-900/75">
          {/* <span className="sr-only">Популярное</span> */}
          Популярное
        </button>
      )}

      <img
        src={home}
        alt=""
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
      />

      <div className="relative border border-gray-100 bg-white p-6">
        <p className="text-gray-700">
          {currentPrice}$
          {hasDiscount && (
            <span className="text-gray-400 line-through ml-1">
              {previousPrice}$
            </span>
          )}
        </p>

        <h3 className="mt-1.5 text-lg font-medium text-gray-900">{name}</h3>

        <p className="mt-1.5 line-clamp-3 text-gray-700">{desc}</p>

        <form className="mt-4 flex gap-4 flex-row md:flex-col">
          {/* <button className="block w-full rounded-sm bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 transition hover:scale-105">
            Подробнее
          </button> */}

          <button className="block text-center w-full rounded-sm bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:scale-105">
            Подробнее
          </button>
        </form>
      </div>
    </Link>
  );
};

export default ProjectsListItem;
