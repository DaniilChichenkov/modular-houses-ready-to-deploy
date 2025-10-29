import { useParams } from "@remix-run/react";
import { Plus, Trash2, Pen } from "lucide-react";

import useChangeTechnologyItemStore from "~/stores/ChangeTechnologyStore";

const translations = {
  imagesCollection: {
    eng: "Images Collection",
    rus: "Коллекция изображений",
    est: "Pildikogu",
    nor: "Bildekolleksjon",
  },
};

const ChangeTechnologyImagesCollectionItem = ({
  url,
  uuid,
  parentUUid,
}: {
  url: string;
  uuid: string;
  parentUUid: string;
}) => {
  const deleteFileFromImagesCollection = useChangeTechnologyItemStore(
    (state) => state.deleteFileFromImagesCollection
  );
  const replaceImagesCollectionFile = useChangeTechnologyItemStore(
    (state) => state.replaceImagesCollectionFile
  );

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang: urlLang } = useParams<{ lang: SupportedLanguages }>();

  //Handle Image delete
  const handleImageDelete = () => {
    //Revoke url
    URL.revokeObjectURL(url);

    //Delete image
    deleteFileFromImagesCollection(parentUUid, uuid);
  };

  //Handle image repalce
  const handleReplaceImagesCollectionFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    //Check if file exists
    const file = e.target?.files?.[0];
    if (!file) {
      return;
    }

    //Revoke url of previous file
    URL.revokeObjectURL(url);

    const fileToUploadInStore = {
      previewUrl: URL.createObjectURL(file),
      file,
    };

    replaceImagesCollectionFile(parentUUid, uuid, fileToUploadInStore);
  };

  return (
    <div className="w-full grid grid-cols-5">
      {/* Img */}
      <img
        src={url}
        alt="#"
        className="col-span-4 object-contain max-h-[15rem]"
      />

      {/* Options */}
      <div className="flex  flex-col items-center justify-center col-start-5 col-span-1 gap-y-5">
        {/* Change button */}
        <label className="cursor-pointer" htmlFor={`${uuid}-change`}>
          <span>
            <Pen />
          </span>
          <input
            onChange={handleReplaceImagesCollectionFile}
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

const ChangeTechnologyImagesCollection = ({
  uuid,
  files,
}: {
  uuid: string;
  files?: {
    file?: File;
    uuid?: string;
    previewUrl?: string;
  }[];
}) => {
  const addFilesToImagesCollection = useChangeTechnologyItemStore(
    (state) => state.addFilesToImagesCollection
  );
  const deleteImagesCollection = useChangeTechnologyItemStore(
    (state) => state.deleteContentItem
  );

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang: urlLang } = useParams<{ lang: SupportedLanguages }>();

  //Handle files upload
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Check for files
    const files = e.target.files;
    if (!files || !files.length) {
      return;
    }

    //Transform files before uploading in store
    const filesToUploadInStore = [];
    for (let i = 0; i < files.length; i++) {
      const file = {
        file: files[i],
        previewUrl: URL.createObjectURL(files[i]),
        uuid: crypto.randomUUID(),
      };
      filesToUploadInStore.push(file);
    }

    //Upload in store
    addFilesToImagesCollection(uuid, filesToUploadInStore);
  };

  //Handle images collection delete
  const handleImagesCollectionDelete = () => {
    deleteImagesCollection(uuid);
  };

  return (
    <div className="w-full flex-col items-start justify-start">
      {/* Text for clarification and delete button */}
      <div className="w-full flex justify-between items-center">
        <p className="text-sm font-medium text-gray-700 underline">
          {translations.imagesCollection[urlLang!]}
        </p>
        <button onClick={handleImagesCollectionDelete}>
          <Trash2 />
        </button>
      </div>

      {/* Added images preview */}
      <div className="w-full flex flex-col items-start gap-y-10 mt-10">
        {(files &&
          files.length &&
          files.map((item) => (
            <div className="w-full" key={item.uuid}>
              {/* Image component */}
              <ChangeTechnologyImagesCollectionItem
                uuid={item.uuid!}
                url={item.previewUrl!}
                parentUUid={uuid}
              />

              {/* Divider */}
              <div className="w-full h-px bg-gray-400 mt-5"></div>
            </div>
          ))) ||
          null}
      </div>

      {/* Add images button */}
      <div className="w-full flex justify-center mt-10">
        <label className="cursor-pointer inline-block border-dashed border-4  border-indigo-600 text-indigo-600 bg-transparent p-5 rounded-md text-sm font-medium  hover:bg-indigo-600 hover:text-white  focus:ring-3 focus:outline-hidden">
          <span>
            <Plus strokeWidth={4} />
          </span>
          <input
            onChange={handleFilesUpload}
            multiple
            className="hidden"
            type="file"
            id={`${uuid}-files`}
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

export default ChangeTechnologyImagesCollection;
