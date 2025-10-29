import { useNavigate } from "@remix-run/react";

const ProjectsListItem = ({
  _id,
  title,
  price,
  isPopular,
  isDiscount,
  newPrice,
  quickDesc,
  imagesFolder,
}: {
  _id: string;
  title: string;
  price: number;
  imagesFolder: string;
  isPopular: boolean;
  isDiscount: boolean;
  newPrice: number;
  quickDesc: {
    eng: string;
    rus: string;
    est: string;
    nor: string;
  };
}) => {
  const nav = useNavigate();

  //Get current search query to pass them to another page through Link component
  const getSearchQueryParams = () => {
    //Get current search query
    const url = new URL(window.location.href);
    const urlSearch = url.searchParams.toString();

    nav(`/products/${_id}?${urlSearch}`);
  };

  return (
    <button
      onClick={getSearchQueryParams}
      className="group relative block overflow-hidden"
    >
      <img
        src={`/api/projects/main-image?folder=${imagesFolder}`}
        alt=""
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
      />

      {/* If item is marked as popular */}
      {isPopular && (
        <span className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 px-4 text-gray-900 transition hover:text-gray-900/75">
          <span className="sr-only">Популярное</span>
          Популярное
        </span>
      )}

      <div className="relative border border-gray-100 bg-white p-6">
        <p className="text-gray-700">
          {price}${/* If item is on discount */}
          {isDiscount && (
            <span className="text-gray-400 line-through ml-1">{newPrice}$</span>
          )}
        </p>

        <h3 className="mt-1.5 text-lg font-medium text-gray-900">{title}</h3>

        <p className="mt-1.5 line-clamp-3 text-gray-700">{quickDesc.eng}</p>

        <div className="mt-4 flex gap-4 flex-row md:flex-col">
          <div className="block text-center w-full rounded-sm bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:scale-105">
            Подробнее
          </div>
        </div>
      </div>
    </button>
  );
};

export default ProjectsListItem;
