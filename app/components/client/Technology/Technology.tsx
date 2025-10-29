import { useNavigate } from "@remix-run/react";
import TechnologyArticle from "./TechnologyArticle";
import useTechnologyActiveLinkStore from "~/stores/TechnologyActiveLinkStore";

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
        {JSON.parse(title).content["eng"]}
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
  return (
    <section id="technology" className="py-10">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start md:gap-8">
          <div className="md:col-span-1">
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
                Технология
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
