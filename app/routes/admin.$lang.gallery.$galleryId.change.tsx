import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useState, useRef } from "react";

import {
  ChangeGalleryTitle,
  ChangeGalleryContent,
} from "~/components/admin/Gallery/ChangeGallery";

import path from "path";
import fs from "fs/promises";

import { getSession } from "~/utils/session";

import useChangeGalleryStore from "~/stores/ChangeGalleryStore";

import useAdminInfoModalStore from "~/stores/AdminInfoModalStore";

import compressFile from "~/utils/compressImageFile";
import galleryModel from "~/models/Gallery";
import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { connectToDB } from "~/utils/db";

const translations = {
  submit: {
    eng: "Submit",
    rus: "Отправить",
    est: "Esita",
    nor: "Send inn",
  },
  loading: {
    eng: "Loading",
    rus: "Загрузка",
    est: "Laadimine",
    nor: "Laster",
  },
  formValidationError: {
    eng: "Form validation error",
    rus: "Ошибка проверки формы",
    est: "Vormi valideerimise viga",
    nor: "Skjemavalideringsfeil",
  },
  notAllFieldsFilled: {
    eng: "Not all fields are filled",
    rus: "Не все поля заполнены",
    est: "Kõik väljad ei ole täidetud",
    nor: "Ikke alle felt er fylt ut",
  },
  changingResults: {
    eng: "Changing Results",
    rus: "Результаты изменения",
    est: "Muutmise tulemused",
    nor: "Endringsresultater",
  },
  everythingWentWell: {
    eng: "Everything went well",
    rus: "Всё прошло хорошо",
    est: "Kõik läks hästi",
    nor: "Alt gikk bra",
  },
  errorOccurred: {
    eng: "An error occurred",
    rus: "Произошла ошибка",
    est: "Tekkis viga",
    nor: "Det oppsto en feil",
  },
};

export const action: ActionFunction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //Check for galleryId
  const { galleryId } = params;
  if (!galleryId) {
    return json({ success: false, msg: "No id provided" });
  }

  //Get form data
  const formData = await request.formData();

  //Check for title
  const title = formData.get("title") as string;
  if (!title) {
    return json({ success: false, msg: "No title provided" });
  }

  //Get all images
  const images = formData.getAll("images") as File[];
  if (!images.length) {
    return json({ success: false, msg: "No images provided" });
  }

  //If everything is provided - Change record in db
  try {
    connectToDB();
    const galleryToChange = await galleryModel.findOne({ _id: galleryId });

    if (!galleryToChange) {
      throw new Error("Nothing was found");
    }

    //Change titlte
    galleryToChange.title = title;

    //Get id of created gallery item
    const galleryToChangeId = galleryToChange._id.toString();

    //Create path
    const galleryBaseDirPath = path.join(process.cwd(), "public", "gallery");
    const currentGalleryDirPath = path.join(
      galleryBaseDirPath,
      galleryToChangeId
    );

    //Remove previous images folder
    await fs.rm(currentGalleryDirPath, { force: true, recursive: true });

    //Create new dir
    await fs.mkdir(currentGalleryDirPath, { recursive: true });

    //Handle files
    const imagesArrayBuffers = await Promise.all(
      images.map((item) => item.arrayBuffer())
    );
    const imagesBuffers = imagesArrayBuffers.map((item) => Buffer.from(item));
    const imagesFileNames = images.map((item) => `${Date.now()}_${item.name}`);
    const imagesFilePaths = imagesFileNames.map((item) =>
      path.join(currentGalleryDirPath, item)
    );
    await Promise.all(
      imagesBuffers.map((item, i) => fs.writeFile(imagesFilePaths[i], item))
    );

    //Store path to images folder in db
    galleryToChange.imagesFolder = galleryToChangeId;
    await galleryToChange.save();
  } catch (error) {
    return json({ success: false, msg: error });
  }

  return json({ success: true });
};

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //Check for gallery id
  const { galleryId } = params;
  if (!galleryId) {
    return json({ msg: "No Gallery Id provided", success: false });
  }

  try {
    connectToDB();
    const gallery = await galleryModel.findOne({ _id: galleryId }).lean();

    if (!gallery) {
      throw new Error("Nothing was found");
    }

    //Get images
    const pathToGalleryImages = path.join(
      process.cwd(),
      "public",
      "gallery",
      gallery._id.toString()
    );

    //Get files from dir
    const files = await fs.readdir(pathToGalleryImages, {
      withFileTypes: true,
    });

    //Transform into images paths
    const imagesFullPaths = files.map((item) => {
      const absolutePath = path.join(item.parentPath, item.name);
      const relPath = path.relative(path.join(process.cwd()), absolutePath);
      const pathToUse = relPath.replace(/\\/g, "/");
      const pathToUseWithoutPublic = pathToUse.replace(/^public/, "");
      return path.join("/", pathToUseWithoutPublic);
    });

    return {
      ...gallery,
      _id: gallery._id.toString(),
      images: imagesFullPaths,
    };
  } catch (error) {
    return json({ msg: "Nothing was found", success: false });
  }
};

const ChangeGallery = () => {
  const didFetch = useRef(false);
  const fetcher = useFetcher<{ success: boolean }>();
  const loaderData = useLoaderData<{
    title: string;
    _id: string;
    imagesFolder: string;
    images: string[];
  }>();

  //Form validation flag
  const [isValidating, setIsValidating] = useState(false);

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const resetForm = useChangeGalleryStore((state) => state.resetState);
  const setInitialTitle = useChangeGalleryStore(
    (state) => state.setInitialTitle
  );
  const addImages = useChangeGalleryStore((state) => state.addImages);

  //Modal manager
  const isOpen = useAdminInfoModalStore((state) => state.isOpen);
  const openModal = useAdminInfoModalStore((state) => state.openModal);
  const setTitle = useAdminInfoModalStore((state) => state.setTitle);
  const setContent = useAdminInfoModalStore((state) => state.setContent);

  //Show modal window
  const showModal = (title: string, content: string) => {
    setTitle(title);
    setContent(content);
    openModal();
  };

  //Handle submit
  const handleSubmit = async () => {
    //Set form validating flag
    setIsValidating(true);

    //Get title and content from state
    const { title, images } = useChangeGalleryStore.getState();

    //Errors array
    const errors: { msg: string }[] = [];

    //Validate Title
    for (const [key, value] of Object.entries(title.content)) {
      if (!value) {
        errors.push({ msg: `${key} of Title input is empty` });
      }
    }

    //Check if Images are not empty
    if (!images.length) {
      errors.push({ msg: "Technology content is empty!" });
    }

    //Check for errors
    if (errors.length > 0) {
      //Implement modal window here later
      showModal(
        translations.formValidationError[lang!],
        translations.notAllFieldsFilled[lang!]
      );
      setIsValidating(false);
      return;
    }

    //If no error were found -- proceed
    const formData = new FormData();

    //Transform Title into JSON format
    formData.append("title", JSON.stringify(title));

    //Compress images before submit
    const compressedImagesBlobs = await Promise.all(
      images.map((item) => compressFile(item.file))
    );

    //Return blobs back to File after compression
    const compressedImages = compressedImagesBlobs.map((blob, i) => {
      return new File([blob], images[i].file.name, {
        type: compressedImagesBlobs[i].type,
      });
    });

    //Append compressed images to Formdata
    compressedImages.forEach((file) => {
      formData.append("images", file);
    });

    //Remove validating flag at the end
    setIsValidating(false);

    //Send data to server
    fetcher.submit(formData, {
      encType: "multipart/form-data",
      method: "POST",
      action: `/admin/${lang}/gallery/${loaderData._id}/change`,
    });
  };

  //Populate store
  useEffect(() => {
    const populateState = async () => {
      //Clear previous data (If exists)
      resetForm();

      //Set initial title
      setInitialTitle(JSON.parse(loaderData.title));

      //Set images
      //Real files store
      const filesArr = [];

      for (const file of loaderData.images) {
        const res = await fetch(file);
        const blob = await res.blob();
        const name = file.split("/").pop()!.split("_").pop()!;
        const imageFile = new File([blob], name, { type: blob.type });
        filesArr.push(imageFile);
      }

      //Transform files before storing them in State manager
      const transformedFiles = filesArr.map((item) => {
        return {
          file: item,
          previewUrl: URL.createObjectURL(item),
          uuid: crypto.randomUUID(),
        };
      });

      addImages(transformedFiles);
    };

    if (!didFetch.current) {
      populateState();
      didFetch.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderData]);

  //Handle scroll disable/enable
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isOpen]);

  //Display status of new technology article change
  useEffect(() => {
    if (fetcher.state === "idle") {
      if (fetcher.data) {
        if (fetcher.data.success) {
          showModal(
            translations.changingResults[lang!],
            translations.everythingWentWell[lang!]
          );
        } else {
          showModal(
            translations.changingResults[lang!],
            translations.errorOccurred[lang!]
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 gap-y-20 pb-20">
      {/* Add new gallery title */}
      <ChangeGalleryTitle />

      {/* Add new gallery content */}
      <ChangeGalleryContent />

      {/* Submit button */}
      {fetcher.state === "idle" && !isValidating ? (
        <button
          onClick={handleSubmit}
          className="w-full h-[5rem] md:col-start-2 md:cols-span-1 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.submit[lang!]}
        </button>
      ) : (
        <div className="w-full md:col-start-2 md:cols-span-1 flex justify-center items-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">{translations.loading[lang!]}...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeGallery;
