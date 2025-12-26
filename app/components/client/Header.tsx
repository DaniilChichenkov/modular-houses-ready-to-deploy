import { useLocation } from "@remix-run/react";

import houseImg from "/src/house.jpg";

const translations = {
  header: {
    rus: "Модульные дома для современной жизни",
    est: "Moodulmajad kaasaegseks eluks",
    en: "Modular Homes for Modern Living",
    nor: "Modulære hjem for moderne liv",
  },
};

const Header = () => {
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

  return (
    <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-2xl lg:text-3xl xl:text-5xl font-bold text-gray-900 md:text-3xl md:text-left">
            {translations["header"][currentLang]}
          </h1>
          {/* 
          <p className="hidden text-gray-500 md:mt-4 md:block md:text-left">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas
            tempus tellus etiam sed. Quam a scelerisque amet ullamcorper eu enim
            et fermentum, augue. Aliquet amet volutpat quisque ut interdum
            tincidunt duis.
          </p> */}

          {/* <div className="mt-4 md:mt-8 md:flex">
            <button className="inline-block rounded-sm bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:ring-3 focus:ring-yellow-400 focus:outline-hidden">
              Ознакомьтесь с проектами
            </button>
          </div> */}
        </div>
      </div>

      <img
        alt=""
        src={houseImg}
        className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"
      />
    </section>
  );
};

export default Header;
