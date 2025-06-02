import TechnologyArticle from "./TechnologyArticle";

const Technology = () => {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start md:gap-8">
          <div className="md:col-span-1">
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                Технология
              </h2>

              {/* List of technologies */}
              <ul className="mt-5 flex flex-col items-start justify-between gap-3">
                <li>
                  <button className="text-gray-700 font-bold scale-110 origin-left">
                    Lorem ipsum
                  </button>
                  <div className="w-full h-px bg-gray-700 bg-opacity-40"></div>
                </li>
                <li>
                  <button className="text-gray-700 transition-transform duration-200 hover:scale-110 origin-left">
                    Lorem ipsum
                  </button>
                </li>
                <li>
                  <button className="text-gray-700 transition-transform duration-200 hover:scale-110 origin-left">
                    Lorem ipsum
                  </button>
                </li>
                <li>
                  <button className="text-gray-700 transition-transform duration-200 hover:scale-110 origin-left">
                    Lorem ipsum
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Technology content */}
          <TechnologyArticle />
        </div>
      </div>
    </section>
  );
};

export default Technology;
