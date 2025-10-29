//For test purposes
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

import useLightBoxStore from "~/stores/LightBoxStore";

const TechnologyArticleHeader = ({
  content,
}: {
  content: Record<"est" | "eng" | "rus" | "nor", string>;
}) => {
  return (
    <h3 className="text-2xl font-semibold text-gray-700 sm:text-3xl">
      {content["eng"]}
    </h3>
  );
};

const TechnologyArticleSubHeader = ({
  content,
}: {
  content: Record<"est" | "eng" | "rus" | "nor", string>;
}) => {
  return (
    <h4 className="text-xl font-semibold text-gray-700 sm:text-2xl mt-5">
      {content["eng"]}
    </h4>
  );
};

const TechnologyArticleSubHeaderSmall = ({
  content,
}: {
  content: Record<"est" | "eng" | "rus" | "nor", string>;
}) => {
  return (
    <h5 className="text-lg font-semibold text-gray-700 sm:text-xl mt-5">
      {content["eng"]}
    </h5>
  );
};

const TechnologyArticlePlainText = ({
  content,
}: {
  content: Record<"est" | "eng" | "rus" | "nor", string>;
}) => {
  return <p className="text-gray-500 mt-4 lg:w-8/12">{content["eng"]}</p>;
};

const TechnologyArticleImagesCollection = () => {
  const fetcher = useFetcher<{ success: boolean; files: string[] }>();
  const [images, setImages] = useState<string[] | undefined>(undefined);

  //Function to set images paths to store so they will be displayed in lightbox
  const setImagesToStore = useLightBoxStore((state) => state.setImages);
  const openLightBox = useLightBoxStore((state) => state.openLightbox);
  const setActiveImage = useLightBoxStore((state) => state.setActiveImage);

  //Make a request on component mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    const articleId = searchParams.get("techPage")?.toString();

    if (articleId) {
      fetcher.load(`/api/tech/get-images-collection-content/${articleId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Track fetcher data
  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      setImages(fetcher.data.files);
    }
  }, [fetcher.data]);

  //Set images URL`s to store and open Lightbox
  const handleImageClick = (imageUrl: string) => {
    setImagesToStore(images as string[]);
    setActiveImage(imageUrl);
    openLightBox();
  };

  return (
    <div className="grid grid-cols-3 mt-5 md:grid-cols-4 lg:grid-cols-6 w-full gap-x-5 gap-y-5 md:gap-x-2">
      {images &&
        images.length &&
        images.map((item) => (
          <button
            key={item}
            className="min-w-full cursor-pointer"
            onClick={() => handleImageClick(item)}
          >
            <div className="w-full aspect-square overflow-hidden">
              <img
                src={item}
                alt="#"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        ))}
    </div>
  );
};

//Can be plain text as well as link
const TechnologyArticleListItem = ({
  listItemType,
  content,
  route,
}: {
  listItemType: string;
  content: Record<"eng" | "rus" | "est" | "nor", string>;
  route?: string;
}) => {
  return (
    <li>
      {listItemType === "listItemText" ? (
        <>{content["eng"]}</>
      ) : listItemType === "listItemLink" ? (
        <a
          href={`https://${route}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-colors text-indigo-600 hover:text-indigo-800 underline"
        >
          {content["eng"]}
        </a>
      ) : (
        ""
      )}
    </li>
  );
};

const TechnologyArticleList = ({
  content,
}: {
  content: {
    listTitle: {
      content: Record<"eng" | "rus" | "est" | "nor", string>;
    };
    children: {
      content: Record<"eng" | "rus" | "est" | "nor", string>;
      linkRoute?: string;
      type: string;
      uuid: string;
    }[];
  };
}) => {
  //List title
  const listTitle = content.listTitle.content;

  //Array of children
  const listChildren = content.children;

  return (
    <>
      <p className="font-bold text-lg text-gray-700 mt-5">
        {listTitle["eng"]}:
      </p>
      <ul className="space-y-1 mt-2 pl-2">
        {listChildren &&
          listChildren.length &&
          listChildren.map((item) => (
            <TechnologyArticleListItem
              listItemType={item.type}
              key={item.uuid}
              content={item.content}
              route={item.linkRoute}
            />
          ))}
        {/* <TechnologyArticleListItem listItemType="text" />
        <TechnologyArticleListItem listItemType="link" />
        <TechnologyArticleListItem listItemType="text" />
        <TechnologyArticleListItem listItemType="link" /> */}
      </ul>
    </>
  );
};

//Can be with annotaion or without it
const TechnologyArticleStandaloneLink = ({
  withAnnotaion,
  content,
}: {
  withAnnotaion: boolean;
  content: {
    linkRoute: string;
    content: Record<"est" | "eng" | "rus" | "nor", string>;
    linkAnnotation?: {
      content: Record<"est" | "eng" | "rus" | "nor", string>;
    };
  };
}) => {
  return (
    <div className="mt-5 flex flex-col items-start justify-start">
      {withAnnotaion && (
        <p className="text-xs text-gray-700">
          {content.linkAnnotation?.content["eng"]}
        </p>
      )}
      <a
        href={`https://${content.linkRoute}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-colors text-indigo-600 hover:text-indigo-800 underline"
      >
        {content.content["eng"]}
      </a>
    </div>
  );
};

const TechnologyArticle = ({
  header,
  content,
}: {
  header: string;
  content: string;
}) => {
  //Parse article main header from json
  const parsedHeader = JSON.parse(header).content;

  //Parse article content items
  const parsedContent = JSON.parse(content);

  return (
    <div className="md:col-span-3 mt-8 md:mt-0">
      {/* Render header */}
      {parsedHeader && <TechnologyArticleHeader content={parsedHeader} />}

      {/* Render content */}
      {parsedContent &&
        parsedContent.length &&
        parsedContent.map((item) => {
          const parsedItem = JSON.parse(item);
          switch (parsedItem.type) {
            //Render subheader
            case "subHeader":
              return (
                <TechnologyArticleSubHeader
                  key={parsedItem.uuid}
                  content={parsedItem.content}
                />
              );

            //Render small subheader
            case "smallSubHeader":
              return (
                <TechnologyArticleSubHeaderSmall
                  key={parsedItem.uuid}
                  content={parsedItem.content}
                />
              );

            //Render plain text
            case "plainText":
              return (
                <TechnologyArticlePlainText
                  key={parsedItem.uuid}
                  content={parsedItem.content}
                />
              );

            //Render list
            case "list":
              return (
                <TechnologyArticleList
                  key={parsedItem.uuid}
                  content={parsedItem}
                />
              );

            //Render standalone link (Without annotation)
            case "linkWithoutAnnotation":
              return (
                <TechnologyArticleStandaloneLink
                  withAnnotaion={false}
                  key={parsedItem.uuid}
                  content={parsedItem}
                />
              );

            //Render standalone link (With annotation)
            case "linkWithAnnotation":
              return (
                <TechnologyArticleStandaloneLink
                  withAnnotaion={true}
                  key={parsedItem.uuid}
                  content={parsedItem}
                />
              );

            //Render images collection
            case "imagesCollection":
              return (
                <TechnologyArticleImagesCollection key={parsedItem.uuid} />
              );
          }
        })}
    </div>
  );
};

export default TechnologyArticle;
