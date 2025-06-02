//For test purposes
import home from "/src/house.jpg";

const TechnologyArticleHeader = () => {
  return (
    <h3 className="text-2xl font-semibold text-gray-700 sm:text-3xl">
      Основной заголовок
    </h3>
  );
};

const TechnologyArticleSubHeader = () => {
  return (
    <h4 className="text-xl font-semibold text-gray-700 sm:text-2xl mt-5">
      Подзаголовок
    </h4>
  );
};

const TechnologyArticleSubHeaderSmall = () => {
  return (
    <h5 className="text-lg font-semibold text-gray-700 sm:text-xl mt-5">
      Подзаголовок маленький
    </h5>
  );
};

const TechnologyArticlePlainText = () => {
  return (
    <p className="text-gray-500 mt-4 lg:w-8/12">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, egestas
      tempus tellus etiam sed. Quam a scelerisque amet ullamcorper eu enim et
      fermentum, augue. Aliquet amet volutpat quisque ut interdum tincidunt
      duis.
    </p>
  );
};

const TechnologyArticleImagesCollection = () => {
  return (
    <div className="grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-4 w-full gap-y-2 md:gap-x-2">
      <img src={home} alt="#" />
      <img src={home} alt="#" />
      <img src={home} alt="#" />
      <img src={home} alt="#" />
      <img src={home} alt="#" />
      <img src={home} alt="#" />
      <img src={home} alt="#" />
    </div>
  );
};

//Can be plain text as well as link
const TechnologyArticleListItem = ({
  listItemType,
}: {
  listItemType: string;
}) => {
  return (
    <li>
      {listItemType === "text" ? (
        " - Элемент списка"
      ) : listItemType === "link" ? (
        <a
          href="/"
          className="block transition-colors text-indigo-600 hover:text-indigo-800 underline"
        >
          Ссылка
        </a>
      ) : (
        ""
      )}
    </li>
  );
};

const TechnologyArticleList = () => {
  return (
    <>
      <p className="font-bold text-lg text-gray-700 mt-5">Название списка:</p>
      <ul className="space-y-1 mt-2 pl-2">
        <TechnologyArticleListItem listItemType="text" />
        <TechnologyArticleListItem listItemType="link" />
        <TechnologyArticleListItem listItemType="text" />
        <TechnologyArticleListItem listItemType="link" />
      </ul>
    </>
  );
};

//Can be with annotaion or without it
const TechnologyArticleStandaloneLink = ({
  withAnnotaion,
  linkTextContent,
  linkAnnotaionContent,
}: {
  withAnnotaion: boolean;
  linkTextContent: string;
  linkAnnotaionContent?: string | null;
}) => {
  return (
    <div className="mt-5 flex flex-col items-start justify-start">
      {withAnnotaion && (
        <p className="text-xs text-gray-700">{linkAnnotaionContent}</p>
      )}
      <a
        href="/"
        className="block transition-colors text-indigo-600 hover:text-indigo-800 underline"
      >
        {linkTextContent}
      </a>
    </div>
  );
};

const TechnologyArticle = () => {
  return (
    <div className="md:col-span-3 mt-8 md:mt-0">
      <TechnologyArticleHeader />
      <TechnologyArticleSubHeader />
      <TechnologyArticlePlainText />
      <TechnologyArticleSubHeaderSmall />
      <TechnologyArticleImagesCollection />
      <TechnologyArticleList />
      <TechnologyArticleStandaloneLink
        withAnnotaion={true}
        linkAnnotaionContent="Описание ссылки"
        linkTextContent="Отдельная ссылка с описанием"
      />
      <TechnologyArticleStandaloneLink
        withAnnotaion={false}
        linkTextContent="Отдельная ссылка без описания"
      />
    </div>
  );
};

export default TechnologyArticle;
