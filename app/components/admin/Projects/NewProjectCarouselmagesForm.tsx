/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react";
import { Pen, Trash2 } from "lucide-react";
import { useParams } from "@remix-run/react";

const translations = {
  sliderImages: {
    eng: "Slider Images",
    rus: "Картинки слайдера",
    est: "Liuguri pildid",
    nor: "Slider-bilder",
  },
  uploadMoreImages: {
    eng: "Upload More Images",
    rus: "Загрузить больше изображений",
    est: "Laadi üles rohkem pilte",
    nor: "Last opp flere bilder",
  },
  addPictures: {
    eng: "Add Pictures",
    rus: "Добавить картинки",
    est: "Lisa pilte",
    nor: "Legg til bilder",
  },
};

import useNewProjectStore from "~/stores/NewProjectStore";

const NewProjectCarouselmagesForm = () => {
  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null);

  const carouselImages = useNewProjectStore((state) => state.carouselImages);
  const uploadCarouselImages = useNewProjectStore(
    (state) => state.uploadCarouselImages
  );
  const changeCarouselImage = useNewProjectStore(
    (state) => state.changeCarouselImage
  );
  const deleteCarouselImage = useNewProjectStore(
    (state) => state.deleteCarouselImage
  );

  //Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Get files
    const files = e.target.files;

    //If no files selected
    if (!files || files.length === 0 || files === null) {
      return;
    }

    //Array of files which will be uploaded to Zustand Store
    const filesToUpload = [];

    //Create URLs for each file
    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      filesToUpload.push({
        previewUrl: url,
        file: files[i],
        uuid: crypto.randomUUID(),
      });
    }

    //If any images were uploaded before - Append new images to this array
    if (carouselImages && carouselImages.length > 0) {
      // setImgPreviewUrl((prev) => [...prev!, ...fileUrls]);
      uploadCarouselImages(filesToUpload);
      //If images preview were empty
    } else {
      uploadCarouselImages(filesToUpload);
    }
  };

  //Handle image selection
  const handleImageSelection = (
    e: React.MouseEvent<HTMLImageElement>,
    key: string
  ) => {
    setSelectedImageKey(key);
  };

  //Handle selected image remove
  const handleSelectedImageRemove = () => {
    if (!selectedImageKey) return;
    deleteCarouselImage(selectedImageKey);
  };

  //Handle selected image change
  const handleSelectedImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    //Get file
    const file = e.target.files?.[0];

    //If file is not selected - just close dialogue
    if (!file || !selectedImageKey) {
      return;
    }

    //Object which will be uploaded to Zustand Store
    const fileToUpload = {
      file,
      uuid: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
    };

    //Replace file in store
    changeCarouselImage(fileToUpload, selectedImageKey);
  };

  //Clear files urls on umount or when files changed
  useEffect(() => {
    return () => {
      if (carouselImages) {
        carouselImages.forEach((item) => {
          URL.revokeObjectURL(item.previewUrl);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-start gap-y-1 w-full">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.sliderImages[lang!]}
      </h2>

      {/* File input and images preview */}
      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col items-center gap-y-8">
        {/* Preview */}
        {carouselImages && carouselImages.length > 0 && (
          <div
            style={{ gridAutoRows: "minmax(0, 200px)" }}
            className="w-full grid grid-cols-2 gap-y-5 gap-x-5 justify-items-center"
          >
            {carouselImages.map((item) => (
              <div className="w-full h-full relative" key={item.uuid}>
                {/* Options container */}
                <div
                  className={`${
                    selectedImageKey === item.uuid ? "flex" : "hidden"
                  }  w-full h-full absolute bg-black bg-opacity-50 rounded-md z-50 justify-between items-center px-5`}
                >
                  {/* Change image button */}
                  <label htmlFor={`${item.uuid}_replace`}>
                    <span className="text-white cursor-pointer">
                      <Pen />
                    </span>
                    <input
                      onChange={handleSelectedImageChange}
                      type="file"
                      name="imageReplace"
                      id={`${item.uuid}_replace`}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>

                  {/* Delete image button */}
                  <button
                    onClick={handleSelectedImageRemove}
                    className="text-white"
                  >
                    <Trash2 />
                  </button>
                </div>

                {/* Image preview */}
                <img
                  onClick={(e) => handleImageSelection(e, item.uuid)}
                  src={item.previewUrl}
                  alt="Preview"
                  className="border-[1px] border-slate-500 border-opacity-40 w-full h-full object-contain rounded-md z-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        )}

        {/* Main input */}
        <label
          htmlFor="CarouselFiles"
          className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium">
              {" "}
              {carouselImages && carouselImages.length > 0
                ? `${translations.uploadMoreImages[lang!]}`
                : `${translations.addPictures[lang!]}`}{" "}
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
            onChange={handleImageUpload}
            multiple
            type="file"
            id="CarouselFiles"
            className="sr-only"
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

export default NewProjectCarouselmagesForm;
