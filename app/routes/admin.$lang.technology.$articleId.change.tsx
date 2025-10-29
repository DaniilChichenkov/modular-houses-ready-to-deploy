import {
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
  json,
  ActionFunction,
  ActionFunctionArgs,
} from "@remix-run/node";

import { getSession } from "~/utils/session";

import { connectToDB } from "~/utils/db";
import technologyModel from "~/models/Technology";
import { useLoaderData, useFetcher, useParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import compressFile from "~/utils/compressImageFile";

import fs from "fs/promises";
import path from "path";

import {
  ChangeTechnologyHeader,
  ChangeTechnologyContent,
} from "~/components/admin";

import useChangeTechnologyItemStore from "~/stores/ChangeTechnologyStore";
import useAdminInfoModalStore from "~/stores/AdminInfoModalStore";

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

  //Check for article id
  const { articleId } = params;
  if (!articleId) {
    return false;
  }

  //Get FormData from request
  const formData = await request.formData();

  //Get title
  const title = formData.get("title");

  //Get content
  const content = formData.getAll("content");

  //Get images collection
  const collections: Record<string, File[]> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("imagesCollection-")) {
      //Get uuid of images collection
      const uuid = key.replace("imagesCollection-", "");

      //Check if array of this collection was not already added
      if (!collections[uuid]) {
        collections[uuid] = [];
      }

      collections[uuid].push(value as File);
    }
  }

  try {
    connectToDB();

    //Try to find article in db
    const articleToChange = await technologyModel.findOne({ _id: articleId });

    //If article was not found
    if (!articleToChange) {
      throw new Error("Article was not found");
    }

    //Replace article`s title
    articleToChange.title = title as string;

    //Replace article`s content
    articleToChange.content = JSON.stringify(content);

    //Handle images
    //Get path to the article folder
    const technologyId = articleToChange._id.toString();
    const technologyFolderPath = path.join(
      process.cwd(),
      "public",
      "technology",
      technologyId
    );

    //Firstly - delete old images collections folders
    await fs.rm(technologyFolderPath, { recursive: true, force: true });

    //Create new folder (Where updated images will be stored)
    if (Object.entries(collections).length > 0) {
      await fs.mkdir(technologyFolderPath, { recursive: true });
    }

    //Store images collections (Each in separate folder)
    for (const [key, value] of Object.entries(collections)) {
      //Create folder for collection
      const imagesCollectionPath = path.join(technologyFolderPath, key);
      await fs.mkdir(imagesCollectionPath, { recursive: true });

      //Add json metadata file (Will help display collections in order later)
      const collectionMetaData = {
        createdAt: new Date().toISOString(),
        collectionName: key,
      };
      const metadataFilePath = path.join(imagesCollectionPath, "meta.json");
      await fs.writeFile(
        metadataFilePath,
        JSON.stringify(collectionMetaData, null, 2),
        "utf-8"
      );

      //Write all images in this collection on disk
      const imagesArrayBuffers = await Promise.all(
        value.map((item) => item.arrayBuffer())
      );
      const imagesBuffers = imagesArrayBuffers.map((item) => Buffer.from(item));
      const imagesFileNames = value.map(
        (item) => `${key}_${Date.now()}_${item.name}`
      );
      const imagesFilePaths = imagesFileNames.map((item) =>
        path.join(imagesCollectionPath, item)
      );
      await Promise.all(
        imagesBuffers.map((item, i) => fs.writeFile(imagesFilePaths[i], item))
      );
    }

    //Store path to images collections in db
    if (Object.entries(collections).length > 0) {
      articleToChange.imagesFolder = technologyId;

      //If no images were provided - clear imagesFolder field
    } else {
      articleToChange.imagesFolder = null;
    }

    await articleToChange.save();
  } catch (error) {
    return json({ success: false });
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

  //Check if articleId is provided
  const { articleId } = params;
  if (!articleId) {
    return false;
  }

  //Get technology article
  try {
    connectToDB();
    const article = await technologyModel.findOne({ _id: articleId }).lean();

    //If article was not found
    if (!article) {
      return false;
    }

    //If imagesFolder exists - get images paths
    if (article.imagesFolder) {
      //Get base path to images
      const articleBaseDir = path.join(process.cwd(), "public", "technology");

      //Get path to folder where images of this article stored
      const articleImagesStorageDir = path.join(articleBaseDir, articleId);

      //Prepare storage for images
      const imagesPaths: {
        collectionUUid: string;
        images: string[];
        metaData: { createdAt: string };
      }[] = [];

      //Read article directory
      const collectionDirectories = await fs.readdir(articleImagesStorageDir, {
        withFileTypes: true,
      });

      //Read all files inside of collection directory
      for (const dir of collectionDirectories) {
        if (dir.isDirectory()) {
          const collectionName = dir.name;
          const pathToCollectionImages = path.join(
            articleImagesStorageDir,
            collectionName
          );

          //Get filenames
          const files = await fs.readdir(pathToCollectionImages, {
            withFileTypes: true,
          });

          //Get array of images dirents
          const imagesDirents = files.filter(
            (item) => !item.name.includes("meta.json")
          );

          //Transform into images paths
          const imagesFullPaths = imagesDirents.map((item) => {
            const absolutePath = path.join(item.parentPath, item.name);
            const relPath = path.relative(
              path.join(process.cwd()),
              absolutePath
            );
            const pathToUse = relPath
              .replace(/\\/g, "/")
              .replace(/^public\//, "");
            return path.join("/", pathToUse);
          });

          //Read metadata
          const metadataPath = path.join(pathToCollectionImages, "meta.json");
          let metadata: { createdAt?: string } = {};

          try {
            const metadataRaw = await fs.readFile(metadataPath, "utf-8");
            metadata = JSON.parse(metadataRaw);
          } catch (error) {
            console.warn("Metadata reading error");
          }

          imagesPaths.push({
            collectionUUid: collectionName,
            images: imagesFullPaths,
            metaData: metadata,
          });
        }
      }

      return json({
        ...article,
        images: imagesPaths,
      });
    } else {
      //If no images exists in this article - send content to client
      return json(article);
    }
  } catch (error) {
    return false;
  }
};

const ChangeTechnologyArticle = () => {
  const didFetch = useRef(false);

  const fetcher = useFetcher<{ success: boolean }>();

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Form validation flag
  const [isValidating, setIsValidating] = useState(false);

  const loaderData = useLoaderData<{
    title: string;
    content: string;
    _id: string;
    imagesFolder?: string[];
    images?: {
      collectionUUid: string;
      images: string[];
      metaData: {
        createdAt: string;
        collectionName: string;
      };
    }[];
  }>();

  //Form state manager
  const setInitialTitle = useChangeTechnologyItemStore(
    (state) => state.setInitialTitle
  );
  const addContentItem = useChangeTechnologyItemStore(
    (state) => state.addContentItem
  );
  const resetForm = useChangeTechnologyItemStore((state) => state.resetForm);
  const addFilesToImagesCollection = useChangeTechnologyItemStore(
    (state) => state.addFilesToImagesCollection
  );

  //Modal manager
  const isOpen = useAdminInfoModalStore((state) => state.isOpen);
  const openModal = useAdminInfoModalStore((state) => state.openModal);
  const setTitle = useAdminInfoModalStore((state) => state.setTitle);
  const setContent = useAdminInfoModalStore((state) => state.setContent);

  //Populate store
  useEffect(() => {
    const populateState = async () => {
      //Clear previous data (If exists)
      resetForm();

      setInitialTitle(JSON.parse(loaderData.title));

      for (const contentItem of JSON.parse(loaderData.content)) {
        const item = JSON.parse(contentItem);

        //Handle images
        if (item.type === "imagesCollection") {
          //Create entity in store
          addContentItem({
            type: "imagesCollection",
            children: [],
            parentUUID: null,
            uuid: item.uuid,
          });

          //Find collection in Images from loader data
          for (const imagesCollection of loaderData.images!) {
            if (imagesCollection.collectionUUid === item.uuid) {
              //Real files store
              const filesArr = [];

              //Fetch for each file
              for (const file of imagesCollection.images) {
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

              //Send them to state manager
              addFilesToImagesCollection(item.uuid, transformedFiles);
            }
          }
        } else {
          addContentItem(item);
        }
      }
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

    //Get content from store
    const { title, content } = useChangeTechnologyItemStore.getState();

    //Errors array
    const errors: { msg: string }[] = [];

    //Validate Title
    for (const [key, value] of Object.entries(title.content)) {
      if (!value) {
        errors.push({ msg: `${key} of Title input is empty` });
      }
    }

    //Check if Content is not empty
    if (!content.length) {
      errors.push({ msg: "Technology content is empty!" });
    }

    //Validate Content
    content.forEach((contentItem) => {
      //Validate specific content types
      switch (contentItem.type) {
        //Images collection
        case "imagesCollection":
          //Check if any files were provided to images collection
          if (!contentItem.children || !contentItem.children.length) {
            errors.push({ msg: "You have an empty Images Collection" });
          }
          break;

        //Items list
        case "list":
          //Check list title
          for (const [key, value] of Object.entries(
            contentItem.listTitle!.content
          )) {
            if (!value) {
              errors.push({ msg: `${key} of List Title input is empty` });
            }
          }

          //Check list items
          contentItem.children!.forEach((child) => {
            //Check list item with text type
            if (child.type === "listItemText") {
              for (const [key, value] of Object.entries(child.content!)) {
                if (!value) {
                  errors.push({
                    msg: `${key} list item of some list is empty`,
                  });
                }
              }
              //Check list item with link type
            } else if (child.type === "listItemLink") {
              //Check link route
              if (!child.linkRoute!) {
                errors.push({
                  msg: `List item link route is empty`,
                });
              }

              //Check content
              for (const [key, value] of Object.entries(child.content!)) {
                if (!value) {
                  errors.push({
                    msg: `${key} list item of some list is empty`,
                  });
                }
              }
            }
          });
          break;

        //Check Link with Annotation
        case "linkWithAnnotation":
          //Check Link annotation content
          for (const [key, value] of Object.entries(
            contentItem.linkAnnotation!.content
          )) {
            if (!value) {
              errors.push({
                msg: `${key} Link annotation is empty`,
              });
            }
          }

          //Check Link route
          if (!contentItem.linkRoute!) {
            errors.push({
              msg: `Link route of Link with Annotation is empty`,
            });
          }

          //Check Link content
          for (const [key, value] of Object.entries(contentItem.content)) {
            if (!value) {
              errors.push({
                msg: `${key} content of Link with Annotation is empty`,
              });
            }
          }
          break;

        //Check Link without Annotation
        case "linkWithoutAnnotation":
          //Check Link route
          if (!contentItem.linkRoute!) {
            errors.push({
              msg: `Link route of Link without Annotation is empty`,
            });
          }

          //Check Link content
          for (const [key, value] of Object.entries(contentItem.content)) {
            if (!value) {
              errors.push({
                msg: `${key} content of Link without Annotation is empty`,
              });
            }
          }
          break;

        //Check all other text elements
        default:
          for (const [key, value] of Object.entries(contentItem.content)) {
            if (!value) {
              errors.push({
                msg: `${key} content of ${contentItem.type} is empty`,
              });
            }
          }
      }
    });

    //Check for errors
    if (errors.length > 0) {
      //Implement modal window here later
      showModal("Form validation error", "Not all fields are filled");
      return;
    }

    //If no error were found -- proceed
    const formData = new FormData();

    //Transform Title into JSON format
    formData.append("title", JSON.stringify(title));

    //Transform Content into JSON format
    for (const item of content) {
      //Compress images before sending them
      if (item.type === "imagesCollection") {
        //Compress images
        const compressedImagesBlobs = await Promise.all(
          item.children!.map((image) => compressFile(image.file!))
        );

        //Return blobs back to File after compression
        const compressedImages = compressedImagesBlobs.map((blob, i) => {
          return new File([blob], item.children![i].file!.name, {
            type: compressedImagesBlobs[i].type,
          });
        });

        //Append compressed images to Formdata
        compressedImages.forEach((file) => {
          formData.append(`imagesCollection-${item.uuid}`, file);
        });

        //Append images collection data into content
        formData.append(
          "content",
          JSON.stringify({ type: "imagesCollection", uuid: item.uuid })
        );
      } else {
        formData.append("content", JSON.stringify(item));
      }
    }

    //Disable validating flag
    setIsValidating(false);

    //Send data to server
    fetcher.submit(formData, {
      encType: "multipart/form-data",
      method: "POST",
      action: `/admin/${lang}/technology/${loaderData._id}/change`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-10 gap-y-20 pb-[15rem]">
      {/* Change header */}
      <ChangeTechnologyHeader />

      {/* Change content */}
      <ChangeTechnologyContent />

      {/* Submit button */}
      <div className="w-full flex justify-center mt-10 md:col-span-2 lg:col-span-1 lg:col-start-2">
        {fetcher.state === "idle" && !isValidating ? (
          <button
            onClick={handleSubmit}
            className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 font-bold text-white text-xl hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden lg:max-h-[5rem]"
          >
            {translations.submit[lang!]}
          </button>
        ) : (
          <div className="w-full flex justify-center items-center">
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
    </div>
  );
};

export default ChangeTechnologyArticle;
