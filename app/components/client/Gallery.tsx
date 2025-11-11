import { useSearchParams, useNavigate } from "@remix-run/react";

import useLightBoxStore from "~/stores/LightBoxStore";

const GallerySectionSelection = ({
  galleryId,
  title,
}: {
  galleryId: string;
  title: string;
}) => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  //Parse title from JSON format
  const parsedTitle = JSON.parse(title);

  const handleNavButtonClick = () => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    searchParams.set("galleryPage", galleryId);
    nav(`${url.pathname}?${searchParams.toString()}`, {
      preventScrollReset: true,
    });
  };

  const isLinkActive = searchParams.get("galleryPage") === galleryId;

  return (
    <div>
      <button
        onClick={handleNavButtonClick}
        className={`w-full flex justify-center items-center transition-transform duration-200 text-lg ${
          isLinkActive ? "md:-translate-y-1 lg:-translate-y-2" : ""
        }`}
      >
        {parsedTitle.content["eng"]}
      </button>

      {isLinkActive && (
        <div className="w-full h-1 bg-emerald-600 mt-2 rounded-sm"></div>
      )}
    </div>
  );
};

const GallerySectionImageItem = ({
  src,
  handleImageClick,
}: {
  src: string;
  handleImageClick: () => void;
}) => {
  return (
    <button className="min-w-full cursor-pointer" onClick={handleImageClick}>
      <div className="w-full aspect-square overflow-hidden">
        <img
          loading="lazy"
          className="w-full h-full object-cover"
          src={src}
          alt="#"
        />
      </div>
    </button>
  );
};

const Gallery = ({
  titles,
  currentGalleryFiles,
}: {
  titles: { _id: string; title: string }[];
  currentGalleryFiles: string[];
}) => {
  const openLightbox = useLightBoxStore((state) => state.openLightbox);
  const setImages = useLightBoxStore((state) => state.setImages);
  const setActiveImage = useLightBoxStore((state) => state.setActiveImage);

  //Set images URL`s to store and open Lightbox
  const handleImageClick = (imageUrl: string) => {
    setImages(currentGalleryFiles as string[]);
    setActiveImage(imageUrl);
    openLightbox();
  };

  return (
    <section
      id="gallery"
      className="w-full grid grid-cols-1 md:gap-x-12 lg:gap-x-20 gap-y-5 md:gap-y-10 bg-gray-50 p-8 md:p-12 lg:px-16 lg:py-24"
    >
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
          Галерея
        </h2>

        <p className="mt-4 text-gray-700 text-center md:w-8/12 mx-auto lg:w-6/12 xl:w-4/12">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
          doloremque saepe architecto maiores repudiandae amet perferendis
          repellendus, reprehenderit voluptas sequi.
        </p>
      </div>

      {/* Section selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2 w-full relative mt-5">
        {titles.map((item) => (
          <GallerySectionSelection
            key={item._id}
            galleryId={item._id}
            title={item.title}
          />
        ))}
        <div className="w-full h-px bg-gray-700 opacity-60 mt-2 absolute bottom-0 rounded-sm"></div>
      </div>

      {/* Images section */}
      <div className="grid grid-cols-3 mt-5 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 w-full gap-x-5 gap-y-5 md:gap-x-2">
        {currentGalleryFiles &&
          currentGalleryFiles.length &&
          currentGalleryFiles.map((item) => (
            <GallerySectionImageItem
              handleImageClick={() => handleImageClick(item)}
              src={item}
              key={item}
            />
          ))}
      </div>
    </section>
  );
};

export default Gallery;
