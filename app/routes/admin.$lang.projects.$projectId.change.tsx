import {
  redirect,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  ActionFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import fs from "fs/promises";
import path from "path";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { useEffect } from "react";

import projectModel from "~/models/Project";
import { getSession } from "~/utils/session";
import { connectToDB } from "~/utils/db";

import {
  ChangeProjectQuickData,
  ChangeProjectFullDescriptionForm,
  ChangeProjectCarouselImagesForm,
  ChangeProjectDetailsListForm,
  ChangeProjectPromotionForm,
} from "~/components/admin";

const translations = {
  saveChanges: {
    eng: "Save Changes",
    rus: "Сохранить изменения",
    est: "Salvesta muudatused",
    nor: "Lagre endringer",
  },
  loading: {
    eng: "Loading",
    rus: "Загрузка",
    est: "Laadimine",
    nor: "Laster",
  },
};

import useChangeProjectStore from "~/stores/ChangeProjectStore";
import compressFile from "~/utils/compressImageFile";

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

  //Check for params
  const { projectId } = params;
  if (!projectId) {
    return json({ msg: "Bad request" });
  }

  //Check if project which user trying to change exists in db
  connectToDB();
  const projectToChange = await projectModel.findOne({ _id: projectId }).lean();
  if (!projectToChange) {
    return json({ msg: "No project found" });
  }

  //Get form data
  const formData = await request.formData();

  //Get payload
  const jsonPayload = JSON.parse(formData.get("payload") as string) as {
    title: string;
    price: number;
    numberOfRooms: number;
    area: number;
    floors: number;
    quickDesc: {
      content: {
        eng: string;
        rus: string;
        est: string;
        nor: string;
      };
    };
    fullDesc: {
      content: {
        eng: string;
        rus: string;
        est: string;
        nor: string;
      };
    };
    featuresList: {
      title: {
        eng: string | null;
        rus: string | null;
        est: string | null;
        nor: string | null;
      };
      listItems: {
        uuid: string;
        content: {
          eng: string | null;
          rus: string | null;
          est: string | null;
          nor: string | null;
        };
      }[];
    }[];
    isDiscount: boolean;
    isPopular: boolean;
    newPrice: number;
  };

  // Get and check main image
  const mainImage = formData.get("mainImage");
  if (!(mainImage instanceof File)) {
    return json({ msg: "No main file provided" });
  }

  //Get and check carousel images
  let areCarouselImagesProvided = null;
  const carouselImages = formData.getAll("carouselImages") as File[];
  carouselImages.forEach((item) => {
    if (!(item instanceof File)) return (areCarouselImagesProvided = false);
  });
  if (
    areCarouselImagesProvided !== null &&
    areCarouselImagesProvided === false
  ) {
    return json({ msg: "No carousel images provided" });
  }

  //Change entity in DB
  try {
    await projectModel.findOneAndUpdate(
      { _id: projectId },
      {
        title: jsonPayload.title,
        price: jsonPayload.price,
        area: jsonPayload.area,
        numberOfRooms: jsonPayload.numberOfRooms,
        floors: jsonPayload.floors,
        quickDesc: JSON.stringify(jsonPayload.quickDesc.content),
        fullDesc: JSON.stringify(jsonPayload.fullDesc.content),
        featuresList: JSON.stringify(jsonPayload.featuresList),
        isDiscount: jsonPayload.isDiscount,
        newPrice: jsonPayload.newPrice,
        isPopular: jsonPayload.isPopular,
      }
    );

    //Change images
    const projectBaseDir = path.join(
      process.cwd(),
      "public",
      "projects",
      projectId
    );
    const mainImageDir = path.join(projectBaseDir, "main_image");
    const carouselImagesDir = path.join(projectBaseDir, "carousel_images");

    //Remove pre-change directories
    await fs.rm(mainImageDir, { recursive: true, force: true });
    await fs.rm(carouselImagesDir, { recursive: true, force: true });

    //Creat new directories for projects
    await fs.mkdir(mainImageDir, { recursive: true });
    await fs.mkdir(carouselImagesDir, { recursive: true });

    //Write main image file on disk
    const mainImageArrayBuffer = await mainImage.arrayBuffer();
    const mainImageBuffer = Buffer.from(mainImageArrayBuffer);
    const mainImageFileName = `${projectId}_${Date.now()}_${mainImage.name}`;
    const mainImageFilePath = path.join(mainImageDir, mainImageFileName);
    await fs.writeFile(mainImageFilePath, mainImageBuffer);

    //Write carousel images files on disk
    const carouselImagesArrayBuffers = await Promise.all(
      carouselImages.map((item) => item.arrayBuffer())
    );
    const carouselImagesBuffers = carouselImagesArrayBuffers.map((item) =>
      Buffer.from(item)
    );
    const carouselImagesFileNames = carouselImages.map(
      (item) => `${projectId}_${Date.now()}_${item.name}`
    );
    const carouselImagesFilePaths = carouselImagesFileNames.map((item) =>
      path.join(carouselImagesDir, item)
    );
    await Promise.all(
      carouselImagesBuffers.map((item, i) =>
        fs.writeFile(carouselImagesFilePaths[i], item)
      )
    );

    return json({ success: true });
  } catch (error) {
    return json({ success: false, msg: "Error during Project Changing" });
  }
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

  //Get project id
  const { projectId } = params;

  if (!projectId) {
    return json({ msg: "No project provided", success: false });
  }

  //Find project data in DB
  try {
    const projectToChange = await projectModel
      .findOne({ _id: projectId })
      .lean();

    if (!projectToChange) {
      return json({ msg: "No project found", success: true });
    }

    //Turn _id into String
    const projectToChangeIdString = projectToChange._id.toString();

    //Get project images folder
    const projectsBaseDir = path.join(process.cwd(), "public", "projects");

    //Main Image
    const projMainDirPath = path.join(
      projectsBaseDir,
      projectToChange.imagesFolder!,
      "main_image"
    );

    //Carousel images
    const projCarouselDirPath = path.join(
      projectsBaseDir,
      projectToChange.imagesFolder!,
      "carousel_images"
    );

    //Get main image
    const mainImageFile = await fs.readdir(projMainDirPath);
    const mainImageUrl = `/public/projects/${projectToChange.imagesFolder}/main_image/${mainImageFile}`;

    //Get carousel images
    const carouselImages = await fs.readdir(projCarouselDirPath);
    const carouselImagesUrl = carouselImages.map(
      (item) =>
        `/public/projects/${projectToChange.imagesFolder}/carousel_images/${item}`
    );

    return {
      ...projectToChange,
      _id: projectToChangeIdString,
      mainImageUrl,
      carouselImagesUrl,
    };
  } catch (error) {
    return json({ msg: error, success: false });
  }
};

const ChangeProjectRoute = () => {
  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Get project data from db
  const loaderData = useLoaderData<{
    _id: string;
    quickDesc: string;
    title: string;
    price: number;
    area: number;
    floors: number;
    numberOfRooms: number;
    mainImageUrl: {
      previewUrl: string;
      file: File;
    };
    carouselImagesUrl: string[];
    isDiscount: boolean;
    isPopular: boolean;
    newPrice: number | null;
    featuresList: string;
    fullDesc: string;
  }>();

  const fetcher = useFetcher<{ success: boolean }>();
  const nav = useNavigate();

  //Store
  const setTitle = useChangeProjectStore((state) => state.setTitle);
  const setPrice = useChangeProjectStore((state) => state.setPrice);
  const setNumberOfRooms = useChangeProjectStore(
    (state) => state.setNumberOfRooms
  );
  const setArea = useChangeProjectStore((state) => state.setArea);
  const setFloors = useChangeProjectStore((state) => state.setFloors);
  const setInitialQuickDesc = useChangeProjectStore(
    (state) => state.setInitialQuickDesc
  );
  const setInitialFullDesc = useChangeProjectStore(
    (state) => state.setInitialFullDesc
  );
  const setInitialFeaturesList = useChangeProjectStore(
    (state) => state.setInitialFeaturesList
  );
  const setInitialPromotionData = useChangeProjectStore(
    (state) => state.setInitialPromotionData
  );
  const resetForm = useChangeProjectStore((state) => state.resetState);

  //Populate store
  useEffect(() => {
    //Quick date
    setTitle(loaderData.title);
    setPrice(loaderData.price);
    setNumberOfRooms(loaderData.numberOfRooms);
    setArea(loaderData.area);
    setFloors(loaderData.floors);
    setInitialQuickDesc({
      selectedLang: "est",
      content: { ...JSON.parse(loaderData.quickDesc) },
    });

    //Full desc
    setInitialFullDesc({
      selectedLang: "est",
      content: { ...JSON.parse(loaderData.fullDesc) },
    });

    //Features list
    setInitialFeaturesList(JSON.parse(loaderData.featuresList));

    //Promotion data
    setInitialPromotionData({
      isDiscount: loaderData.isDiscount,
      newPrice: loaderData.newPrice,
      isPopular: loaderData.isPopular,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps

    //Clear Images URLS
    return () => {
      URL.revokeObjectURL(loaderData.mainImageUrl.previewUrl);
      loaderData.carouselImagesUrl.forEach((item) => {
        URL.revokeObjectURL(item);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Track if change request went well
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      resetForm();

      //Navigate back to all projects
      nav(`/admin/${lang}/projects`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const changeProject = async () => {
    //Get form input results
    const {
      title,
      price,
      numberOfRooms,
      area,
      floors,
      quickDesc,
      featuresList,
      fullDesc,
      mainImage,
      carouselImages,
      newPrice,
      isDiscount,
      isPopular,
    } = useChangeProjectStore.getState();

    //Validate form
    const errors: { msg: string }[] = [];

    if (!title || !title.trim())
      errors.push({ msg: "Title must not be empty" });
    if (!price) errors.push({ msg: "Price must not be empty" });
    if (!floors) errors.push({ msg: "Floors must not be empty" });
    if (!numberOfRooms)
      errors.push({ msg: "Number of rooms must not be empty" });
    if (!area) errors.push({ msg: "Area must not be empty" });

    for (const [lang, text] of Object.entries(quickDesc.content)) {
      if (!text || !text.trim()) {
        errors.push({ msg: `${lang} Quick description must not be empty` });
      }
    }

    for (const [lang, text] of Object.entries(fullDesc.content)) {
      if (!text || !text.trim()) {
        errors.push({ msg: `${lang} Full description must not be empty` });
      }
    }

    //Check if item is on discount but discount price was not provided
    if (isDiscount && !newPrice) {
      errors.push({ msg: "Item marked as DISCOUNT but no new price provided" });
    }

    //If any features were added
    if (featuresList.length) {
      featuresList.forEach((list) => {
        //Check list title
        for (const [lang, text] of Object.entries(list.title)) {
          if (!text || !text.trim()) {
            errors.push({ msg: `${lang} List title must not be empty` });
          }
        }

        //Check list items
        if (!list.listItems.length) {
          errors.push({ msg: "Empty list" });
        } else {
          list.listItems.forEach((listItem) => {
            for (const [lang, text] of Object.entries(listItem.content)) {
              if (!text || !text.trim()) {
                errors.push({ msg: `${lang} List item must not be empty` });
              }
            }
          });
        }
      });
    }

    //Check for main image
    if (!mainImage) {
      errors.push({ msg: "No main image provided" });
    }

    //Check for carousel images
    if (!carouselImages.length) {
      errors.push({ msg: "No carousel images provided" });
    }

    //Check for errors (Implement errors display later)
    if (errors.length) {
      console.log(errors);
      return;
    }

    //Create new form data
    const formData = new FormData();

    //Create json payload
    const payload = {
      title,
      price,
      area,
      numberOfRooms,
      floors,
      quickDesc: quickDesc.content,
      featuresList: featuresList.map((item) => ({
        uuid: item.uuid,
        title: item.title,
        listItems: item.listItems,
      })),
      fullDesc: fullDesc.content,
      isDiscount,
      isPopular,
      newPrice,
    };
    formData.append("payload", JSON.stringify(payload));

    //Append main image (With compression)
    const compressedMainImageBlob = await compressFile(mainImage.file!);
    const compressedMainImage = new File(
      [compressedMainImageBlob],
      mainImage!.file!.name,
      { type: compressedMainImageBlob.type }
    );
    formData.append("mainImage", compressedMainImage);

    //Append carousel images (With compression)
    const compressedCarouselImagesBlobs = await Promise.all(
      carouselImages.map((item) => compressFile(item.file))
    );
    const compressedCarouselImages = compressedCarouselImagesBlobs.map(
      (item, i) => {
        return new File([item], carouselImages[i].file.name, {
          type: compressedCarouselImagesBlobs[i].type,
        });
      }
    );
    compressedCarouselImages.forEach((item) =>
      formData.append("carouselImages", item)
    );

    //Send data to server
    fetcher.submit(formData, {
      encType: "multipart/form-data",
      method: "POST",
      action: `/admin/${lang}/projects/${loaderData._id}/change`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 gap-y-20 pb-20">
      {/* Change project quick data */}
      <ChangeProjectQuickData imageUrl={loaderData.mainImageUrl} />

      {/* Change carousel images */}
      <ChangeProjectCarouselImagesForm
        imagesUrls={loaderData.carouselImagesUrl}
      />

      {/* Change project full description */}
      <ChangeProjectFullDescriptionForm />

      {/* Change project details list */}
      <ChangeProjectDetailsListForm />

      {/* Promotion data */}
      <ChangeProjectPromotionForm />

      {/* Submit button */}
      {fetcher.state === "idle" ? (
        <button
          onClick={changeProject}
          className="w-full h-[5rem] md:col-start-2 md:self-end md:cols-span-1 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.saveChanges[lang!]}
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

export default ChangeProjectRoute;
