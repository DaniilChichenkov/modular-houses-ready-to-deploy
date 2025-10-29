import useChangeProjectStore from "~/stores/ChangeProjectStore";
import { useParams } from "@remix-run/react";

const translations = {
  discount: {
    eng: "Discount",
    rus: "Скидка",
    est: "Soodustus",
    nor: "Rabatt",
  },
  discountPrice: {
    eng: "Discount Price",
    rus: "Цена со скидкой",
    est: "Soodushind",
    nor: "Rabattert pris",
  },
  popular: {
    eng: "Popular",
    rus: "Популярный",
    est: "Populaarne",
    nor: "Populær",
  },
  productPromotions: {
    eng: "Product Promotions",
    rus: "Акции на товар",
    est: "Tootekampaaniad",
    nor: "Produktkampanjer",
  },
};

const ChangeProjectPromotionForm = () => {
  const isDiscount = useChangeProjectStore((state) => state.isDiscount);
  const isPopular = useChangeProjectStore((state) => state.isPopular);
  const newPrice = useChangeProjectStore((state) => state.newPrice);
  const setIsDiscount = useChangeProjectStore((state) => state.setIsDiscount);
  const setIsPopular = useChangeProjectStore((state) => state.setIsPopular);
  const setNewPrice = useChangeProjectStore((state) => state.setNewPrice);

  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  return (
    <div className="flex flex-col items-center justify-start gap-y-1 w-full">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.productPromotions[lang!]}
      </h2>

      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
        {/* Discount select */}
        <div className="w-full flex flex-col items-start justify-start">
          {/* Discount toggle */}
          <label className="inline-flex items-center cursor-pointer gap-x-5">
            <input
              onChange={(e) => setIsDiscount(e.target.checked)}
              type="checkbox"
              className="sr-only peer"
              checked={isDiscount!}
            />
            <span className="ms-3 text-lg font-medium text-black">
              {translations.discount[lang!]}
            </span>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>

          {/* New price input */}
          {isDiscount ? (
            <div className="mt-5">
              <label htmlFor="newPrice">
                <span className="text-sm font-medium text-gray-700">
                  {" "}
                  {translations.discountPrice[lang!]}{" "}
                </span>
                <input
                  type="number"
                  onChange={(e) => setNewPrice(+e.target.value)}
                  name="newPrice"
                  id="newPrice"
                  value={newPrice || ""}
                  className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
                />
              </label>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Is popular select */}
        <label
          htmlFor="popular"
          className="inline-flex items-center gap-x-5 cursor-pointer"
        >
          <input
            onChange={(e) => setIsPopular(e.target.checked)}
            id="popular"
            type="checkbox"
            className="sr-only peer"
            checked={isPopular!}
          />
          <span className="ms-3 text-lg font-medium text-black">
            {translations.popular[lang!]}:{" "}
          </span>
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export default ChangeProjectPromotionForm;
