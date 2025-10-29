/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";

import useChangeProjectStore from "~/stores/ChangeProjectStore";

//Translations
const translations = {
  productMainData: {
    eng: "Product main data (Price, Title, Short Description, Image, Area, Number of Floors, and Number of Rooms)",
    rus: "Основные данные товара (Цена, Заголовок, Краткое описание, Изображение, Площадь, Количество этажей и Количество комнат)",
    est: "Toote põhiteave (Hind, Pealkiri, Lühikirjeldus, Pilt, Pindala, Korruste arv ja Tubade arv)",
    nor: "Produktens hoveddata (Pris, Tittel, Kort beskrivelse, Bilde, Areal, Antall etasjer og Antall rom)",
  },
  price: {
    eng: "Price",
    rus: "Цена",
    est: "Hind",
    nor: "Pris",
  },
  title: {
    eng: "Title",
    rus: "Заголовок",
    est: "Pealkiri",
    nor: "Tittel",
  },
  quickDescription: {
    eng: "Quick Description",
    rus: "Краткое описание",
    est: "Lühikirjeldus",
    nor: "Kort beskrivelse",
  },
  image: {
    eng: "Image",
    rus: "Изображение",
    est: "Pilt",
    nor: "Bilde",
  },
  uploadImage: {
    eng: "Choose a picture to upload",
    rus: "Выберите изображение для загрузки",
    est: "Vali üleslaadimiseks pilt",
    nor: "Velg et bilde du vil laste opp",
  },
  changeImage: {
    eng: "Choose a new picture",
    rus: "Выберите новое изображение",
    est: "Vali uus pilt",
    nor: "Velg et nytt bilde",
  },
  preview: {
    eng: "Preview",
    rus: "Предпросмотр",
    est: "Eelvaade",
    nor: "Forhåndsvisning",
  },
  numberOfRooms: {
    eng: "Number of Rooms",
    rus: "Количество комнат",
    est: "Tubade arv",
    nor: "Antall rom",
  },
  houseArea: {
    eng: "House Area",
    rus: "Площадь дома",
    est: "Maja pindala",
    nor: "Husets areal",
  },
  numberOfFloors: {
    eng: "Number of Floors",
    rus: "Количество этажей",
    est: "Korruste arv",
    nor: "Antall etasjer",
  },
};

type Props = {
  imageUrl: string;
};
const ChangeProjectQuickData = ({ imageUrl }: Props) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Store
  const price = useChangeProjectStore((state) => state.price);
  const numberOfRooms = useChangeProjectStore((state) => state.numberOfRooms);
  const area = useChangeProjectStore((state) => state.area);
  const floors = useChangeProjectStore((state) => state.floors);
  const setPrice = useChangeProjectStore((state) => state.setPrice);
  const quickDesc = useChangeProjectStore((state) => state.quickDesc);
  const setQuickDescription = useChangeProjectStore(
    (state) => state.setQuickDescription
  );
  const title = useChangeProjectStore((state) => state.title);
  const setTitle = useChangeProjectStore((state) => state.setTitle);
  const selectQuickDescriptionLanguage = useChangeProjectStore(
    (state) => state.selectQuickDescriptionLanguage
  );
  const mainImage = useChangeProjectStore((state) => state.mainImage);
  const setMainImage = useChangeProjectStore((state) => state.setMainImage);
  const setInitialMainImage = useChangeProjectStore(
    (state) => state.setInitialMainImage
  );
  const setNumberOfRooms = useChangeProjectStore(
    (state) => state.setNumberOfRooms
  );
  const setArea = useChangeProjectStore((state) => state.setArea);
  const setFloors = useChangeProjectStore((state) => state.setFloors);

  const handleQuickDescriptionLanguageSelectorClick = (lang: string) => {
    //Close dropdown
    setIsDropdownVisible(false);

    //Select language
    selectQuickDescriptionLanguage(lang);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleTextareaClick = () => {
    setIsDropdownVisible(false);
  };

  //Handle image selection
  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setMainImage({ previewUrl, file });
  };

  //Request for initial image
  useEffect(() => {
    const requestForInitialMainImage = async () => {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const name = imageUrl.split("/").pop()!.split("_").pop()!;
      const file = new File([blob], name, { type: blob.type });
      setInitialMainImage(file);
    };
    requestForInitialMainImage();

    //Revoke url on umount
    return () => {
      if (mainImage.previewUrl) {
        URL.revokeObjectURL(mainImage.previewUrl);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-start justify-start gap-y-1 w-full">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.productMainData[lang!]}
      </h2>

      {/* Form inputs */}
      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
        {/* Price input */}
        <label htmlFor="price">
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {translations.price[lang!]}{" "}
          </span>
          <input
            onChange={(e) => setPrice(+e.target.value)}
            type="number"
            id="price"
            name="price"
            min={1}
            value={price || ""}
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
          />
        </label>

        {/* Title input */}
        <label htmlFor="title">
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {translations.title[lang!]}{" "}
          </span>
          <input
            onChange={(e) => setTitle(e.target.value)}
            name="title"
            type="text"
            id="title"
            value={title || ""}
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
          />
        </label>

        {/* Quick description input */}
        <div>
          <div className="w-full flex justify-between items-center">
            {/* Name of the input */}
            <p className="text-sm font-medium text-gray-700">
              {translations.quickDescription[lang!]}
            </p>

            {/* Language selector */}
            <div className="relative inline-flex">
              <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                >
                  {quickDesc.selectedLang}
                </button>

                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                  aria-label="Menu"
                >
                  <ChevronDown
                    className={`${
                      isDropdownVisible && "rotate-180"
                    } transition-transform duration-200 rotate-0`}
                    size={18}
                  />
                </button>
              </span>

              <div
                role="menu"
                className={`${
                  !isDropdownVisible && "hidden"
                } absolute end-0 top-12 z-auto w-20 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
              >
                <button
                  onClick={() => {
                    handleQuickDescriptionLanguageSelectorClick("est");
                  }}
                  className={`${
                    quickDesc.selectedLang === "est" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  est
                </button>

                <button
                  onClick={() => {
                    handleQuickDescriptionLanguageSelectorClick("eng");
                  }}
                  className={`${
                    quickDesc.selectedLang === "eng" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  eng
                </button>

                <button
                  onClick={() => {
                    handleQuickDescriptionLanguageSelectorClick("nor");
                  }}
                  className={`${
                    quickDesc.selectedLang === "nor" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  nor
                </button>

                <button
                  onClick={() => {
                    handleQuickDescriptionLanguageSelectorClick("rus");
                  }}
                  className={`${
                    quickDesc.selectedLang === "rus" && "bg-gray-50"
                  } block w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                  role="menuitem"
                >
                  rus
                </button>
              </div>
            </div>
          </div>

          {/* Actual description input */}
          <textarea
            onClick={handleTextareaClick}
            onChange={(e) => setQuickDescription(e.target.value)}
            value={quickDesc.content[quickDesc.selectedLang] || ""}
            id="quickDescription"
            name="quickDescription"
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2 resize-none"
            rows={4}
          ></textarea>
        </div>

        {/* Rooms qty input */}
        <label htmlFor="roomsQty">
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {translations.numberOfRooms[lang!]}{" "}
          </span>
          <input
            onChange={(e) => setNumberOfRooms(+e.target.value)}
            type="number"
            id="roomsQty"
            min={1}
            name="roomsQty"
            value={numberOfRooms || ""}
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
          />
        </label>

        {/* Area input */}
        <label htmlFor="houseArea">
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {translations.houseArea[lang!]}{" "}
          </span>
          <input
            onChange={(e) => setArea(+e.target.value)}
            type="number"
            id="houseArea"
            name="houseArea"
            min={1}
            value={area || ""}
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
          />
        </label>

        {/* Floors input */}
        <label htmlFor="houseFloors">
          <span className="text-sm font-medium text-gray-700">
            {" "}
            {translations.numberOfFloors[lang!]}{" "}
          </span>
          <input
            onChange={(e) => setFloors(+e.target.value)}
            type="number"
            id="houseFloors"
            min={1}
            name="houseFloors"
            value={floors || ""}
            className="mt-1 w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2"
          />
        </label>

        {/* Title image preview */}
        {mainImage.previewUrl && (
          <div className="w-full flex flex-col justify-start items-center">
            {/* Text  */}
            <div className="w-full flex justify-between">
              <p className="text-sm font-medium text-gray-700 text-left">
                {translations.preview[lang!]}
              </p>
            </div>

            {/* Actual image */}
            <img className="mt-5" src={mainImage.previewUrl} alt="Preview" />
          </div>
        )}

        {/* Title image input */}
        <label
          htmlFor="File"
          className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium">
              {" "}
              {mainImage.previewUrl
                ? `${translations.changeImage[lang!]}`
                : `${translations.uploadImage[lang!]}`}
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
              />
            </svg>
          </div>

          <input
            onChange={handleImageSelection}
            type="file"
            id="File"
            className="sr-only"
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

export default ChangeProjectQuickData;
