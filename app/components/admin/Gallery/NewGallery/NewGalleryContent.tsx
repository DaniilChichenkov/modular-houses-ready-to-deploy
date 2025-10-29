import { useParams } from "@remix-run/react";
import { Plus, Pen, Trash2 } from "lucide-react";

import useNewGalleryStore from "~/stores/NewGalleryStore";

const translations = {
  addImages: {
    eng: "Add Images",
    rus: "Добавить изображения",
    est: "Lisa pilte",
    nor: "Legg til bilder",
  },
};

const NewGalleryContentItem = ({
  uuid,
  previewUrl,
}: {
  uuid: string;
  previewUrl: string;
}) => {
  const changeImage = useNewGalleryStore((state) => state.changeImage);
  const deleteImage = useNewGalleryStore((state) => state.deleteImage);

  //Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Check if file exists
    const file = e.target?.files?.[0];
    if (!file) {
      return;
    }

    //Revoke url of previous file
    URL.revokeObjectURL(previewUrl);

    const fileToUploadInStore = {
      previewUrl: URL.createObjectURL(file),
      file,
      uuid,
    };

    changeImage(uuid, fileToUploadInStore);
  };

  //Handle image delete
  const handleImageDelete = () => {
    //Revoke url (Prevent memory leaks)
    URL.revokeObjectURL(previewUrl);

    //Delete image
    deleteImage(uuid);
  };

  return (
    <div className="w-full grid grid-cols-5">
      {/* Img */}
      <img
        src={previewUrl}
        alt="#"
        className="col-span-4 object-contain max-h-[15rem] aspect-square"
      />

      {/* Options */}
      <div className="flex  flex-col items-center justify-center col-start-5 col-span-1 gap-y-5">
        {/* Change button */}
        <label className="cursor-pointer" htmlFor={`${uuid}-change`}>
          <span>
            <Pen />
          </span>
          <input
            onChange={handleImageChange}
            className="hidden"
            type="file"
            accept="image/*"
            id={`${uuid}-change`}
          />
        </label>

        {/* Delete button */}
        <button onClick={handleImageDelete}>
          <Trash2 />
        </button>
      </div>
    </div>
  );
};

const NewGalleryContent = () => {
  const addImages = useNewGalleryStore((state) => state.addImages);
  const images = useNewGalleryStore((state) => state.images);

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Handle add images
  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Check for images
    if (e.target.files && e.target.files.length > 0) {
      //Get files
      const files = e.target.files;

      //Transform files before uploading them in store
      const filesToUpload = [];
      for (let i = 0; i < files.length; i++) {
        const file = {
          file: files[i],
          previewUrl: URL.createObjectURL(files[i]),
          uuid: crypto.randomUUID(),
        };
        filesToUpload.push(file);
      }

      //Upload in store
      addImages(filesToUpload);
    } else {
      return;
    }
  };

  return (
    <div className="flex flex-col items-start justify-start gap-y-1 w-full md:col-start-2 md:col-span-2">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.addImages[lang!]}
      </h2>

      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
        {/* Images */}
        {(images &&
          images.length &&
          images.map((item) => (
            <div className="w-full" key={item.uuid}>
              {/* Image component */}
              <NewGalleryContentItem
                uuid={item.uuid}
                previewUrl={item.previewUrl}
              />

              {/* Divider */}
              <div className="w-full h-px bg-gray-400 mt-5"></div>
            </div>
          ))) ||
          null}

        {/* Add images button */}
        <div className="w-full flex justify-center mt-10">
          <label className="cursor-pointer inline-block border-dashed border-4  border-indigo-600 text-indigo-600 bg-transparent p-5 rounded-md text-sm font-medium  hover:bg-indigo-600 hover:text-white  focus:ring-3 focus:outline-hidden">
            <span>
              <Plus strokeWidth={4} />
            </span>
            <input
              onChange={handleAddImages}
              multiple
              className="hidden"
              type="file"
              id={`files`}
              accept="image/*"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default NewGalleryContent;
