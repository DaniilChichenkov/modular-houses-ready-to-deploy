/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from "react";
import { Pen, Trash2 } from "lucide-react";
import { useParams } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";

import useChangeProjectStore from "~/stores/ChangeProjectStore";

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

type Props = {
  imagesUrls: string[];
};
const ChangeProjectCarouselImagesForm = ({ imagesUrls }: Props) => {
  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  //Store
  const carouselImages = useChangeProjectStore((state) => state.carouselImages);
  const setInitialCarouselImages = useChangeProjectStore(
    (state) => state.setInitialCarouselImages
  );
  const clearCarouselImagesPreviewUrls = useChangeProjectStore(
    (state) => state.clearCarouselImagesPreviewUrls
  );
  const uploadCarouselImages = useChangeProjectStore(
    (state) => state.uploadCarouselImages
  );
  const removeCarouselImage = useChangeProjectStore(
    (state) => state.removeCarouselImage
  );
  const changeCarouselImage = useChangeProjectStore(
    (state) => state.changeCarouselImage
  );

  //Handle image selection
  const handleImageSelection = (id: string) => {
    setSelectedImageId(id);
  };

  //Handle images upload
  const handleCarouselImagesUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    //Check if any files were provided
    const files = e.target.files;

    if (!files?.length) {
      return;
    }

    const filesToUpload = [];
    for (let i = 0; i < files.length; i++) {
      filesToUpload.push({
        previewUrl: URL.createObjectURL(files[i]),
        file: files[i],
        uuid: uuidv4(),
      });
    }

    uploadCarouselImages(filesToUpload);
  };

  //Get initial carousel images
  useEffect(() => {
    Promise.all(
      imagesUrls.map(async (file) => {
        const res = await fetch(file);
        const blob = await res.blob();
        const name = file.split("/").pop()!.split("_").pop()!;
        return new File([blob], name, { type: blob.type });
      })
    ).then((files) => {
      //If any images already existed - clear their preview urls before setting new images
      if (carouselImages.length) {
        clearCarouselImagesPreviewUrls();
      }
      setInitialCarouselImages(files);
    });

    return () => {
      if (carouselImages.length) {
        carouselImages.forEach((item) => {
          URL.revokeObjectURL(item.previewUrl);
        });
      }
    };
  }, [imagesUrls]);

  //Handle image remove
  const handleImageRemove = (id: string) => {
    removeCarouselImage(id);
  };

  //Handle image change
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    changeCarouselImage(id, file);
  };

  return (
    <div className="flex flex-col items-center justify-start gap-y-1 w-full">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.sliderImages[lang!]}
      </h2>

      {/* File input and images preview */}
      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col items-center gap-y-8">
        {/* Preview */}
        {carouselImages && carouselImages.length ? (
          <div
            style={{ gridAutoRows: "minmax(0, 200px)" }}
            className="w-full grid grid-cols-2 gap-y-5 gap-x-5 justify-items-center"
          >
            {carouselImages.map((item) => (
              <div
                onClick={() => {
                  handleImageSelection(item.uuid);
                }}
                className="w-full h-full relative"
                key={item.uuid}
              >
                {/* Options container */}
                <div
                  className={`${
                    selectedImageId === item.uuid ? "flex" : "hidden"
                  }  w-full h-full absolute bg-black bg-opacity-50 rounded-md z-50 justify-between items-center px-5`}
                >
                  {/* Change image button */}
                  <label htmlFor={`${item.uuid}_replace`}>
                    <span className="text-white cursor-pointer">
                      <Pen />
                    </span>
                    <input
                      onChange={(e) => handleImageChange(e, item.uuid)}
                      type="file"
                      name="imageReplace"
                      id={`${item.uuid}_replace`}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>

                  {/* Delete image button */}
                  <button
                    onClick={() => handleImageRemove(item.uuid)}
                    className="text-white"
                  >
                    <Trash2 />
                  </button>
                </div>

                {/* Image preview */}
                <img
                  src={item.previewUrl}
                  alt="Preview"
                  className="border-[1px] border-slate-500 border-opacity-40 w-full h-full object-contain rounded-md z-0 cursor-pointer"
                />
              </div>
            ))}
          </div>
        ) : (
          ""
        )}

        {/* Main input */}
        <label
          htmlFor="CarouselFiles"
          className="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="font-medium">
              {" "}
              {carouselImages.length > 0
                ? `${translations.uploadMoreImages[lang!]}`
                : `${translations.addPictures[lang!]}`}
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
            onChange={handleCarouselImagesUpload}
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

export default ChangeProjectCarouselImagesForm;
