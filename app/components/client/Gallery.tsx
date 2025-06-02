import house from "/src/house.jpg";

const GallerySectionSelection = ({ isActive }: { isActive?: boolean }) => {
  return (
    <div>
      <button
        className={`w-full flex justify-center items-center transition-transform duration-200 text-lg ${
          isActive ? "md:-translate-y-1 lg:-translate-y-2" : ""
        }`}
      >
        Название секции
      </button>

      {isActive && (
        <div className="w-full h-1 bg-emerald-600 mt-2 rounded-sm"></div>
      )}
    </div>
  );
};

const GallerySectionImageItem = () => {
  return <img src={house} alt="#" />;
};

const Gallery = () => {
  return (
    <section className="w-full grid grid-cols-1 md:gap-x-12 lg:gap-x-20 gap-y-5 md:gap-y-10 bg-gray-50 p-8 md:p-12 lg:px-16 lg:py-24">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
          Галерея
        </h2>

        <p className="mt-4 text-gray-700 text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
          doloremque saepe architecto maiores repudiandae amet perferendis
          repellendus, reprehenderit voluptas sequi.
        </p>
      </div>

      {/* Section selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-y-2 w-full relative mt-5">
        <GallerySectionSelection isActive={false} />
        <GallerySectionSelection />
        <GallerySectionSelection />
        <GallerySectionSelection isActive={true} />
        <div className="w-full h-px bg-gray-700 opacity-60 mt-2 absolute bottom-0 rounded-sm"></div>
      </div>

      {/* Images section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 gap-y-3 md:gap-x-5 md:gap-y-5 ">
        <GallerySectionImageItem />
        <GallerySectionImageItem />
        <GallerySectionImageItem />
        <GallerySectionImageItem />
        <GallerySectionImageItem />
        <GallerySectionImageItem />
        <GallerySectionImageItem />
        <GallerySectionImageItem />
      </div>
    </section>
  );
};

export default Gallery;
