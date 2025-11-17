import { useNavigate, useLocation } from "@remix-run/react";
import TechnologyArticle from "./TechnologyArticle";
import useTechnologyActiveLinkStore from "~/stores/TechnologyActiveLinkStore";

const translations = {
  technology: {
    rus: "Технология",
    est: "Tehnoloogia",
    en: "Technology",
    nor: "Teknologi",
  },
};

const TechnologyArticleSelectionListItem = ({
  title,
  id,
}: {
  title: string;
  id: string;
}) => {
  const nav = useNavigate();
  const activeLink = useTechnologyActiveLinkStore((state) => state.activeLink);
  const setActiveLink = useTechnologyActiveLinkStore(
    (state) => state.setActiveLink
  );

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

  const handleNavigation = () => {
    //Update active link
    setActiveLink(id);

    //Navigate to page with new URL
    const url = new URL(window.location.href);
    url.searchParams.set("techPage", String(id));
    nav(`${url.pathname}?${url.searchParams.toString()}`, {
      preventScrollReset: true,
    });
  };

  const isActive = activeLink === id;

  return (
    <li>
      <button
        className={`text-gray-700 ${
          isActive ? "font-bold" : ""
        } scale-110 origin-left`}
        onClick={handleNavigation}
      >
        {JSON.parse(title).content[currentLang === "en" ? "eng" : currentLang]}
      </button>
      {isActive && (
        <div className="w-full h-px bg-gray-700 bg-opacity-40"></div>
      )}
    </li>
  );
};

const Technology = ({
  techArticleContent,
  techArticlesTitles,
}: {
  techArticleContent: {
    _id: string;
    title: string;
    content: string;
  };
  techArticlesTitles: {
    _id: string;
    title: string;
  }[];
}) => {
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
    <section id="technology" className="py-10">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start md:gap-8">
          <div className="md:col-span-1">
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                {translations["technology"][currentLang]}
              </h2>

              {/* List of technologies links  */}
              <ul className="mt-5 flex flex-col items-start justify-between gap-3">
                {techArticlesTitles &&
                  techArticlesTitles.length &&
                  techArticlesTitles.map((item) => (
                    <TechnologyArticleSelectionListItem
                      key={item._id}
                      title={item.title}
                      id={item._id}
                    />
                  ))}
              </ul>
            </div>
          </div>

          {/* Technology content */}
          {techArticleContent && (
            <TechnologyArticle
              content={techArticleContent.content}
              header={techArticleContent.title}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Technology;
