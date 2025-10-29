import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useFetcher, useParams } from "@remix-run/react";
import fs from "fs/promises";
import path from "path";
import { useEffect } from "react";

import { getSession } from "~/utils/session";

import useAdminInfoModalStore from "~/stores/AdminInfoModalStore";

import {
  NewProjectQuickDataForm,
  NewProjectDetailsListForm,
  NewProjectFullDescriptionForm,
  NewProjectCarouselmagesForm,
} from "~/components/admin";

import projectModel from "~/models/Project";
import { connectToDB } from "~/utils/db";

import useNewProjectStore from "~/stores/NewProjectStore";

import compressFile from "~/utils/compressImageFile";

//Content translations
const translations = {
  submitButton: {
    eng: "submit new entry",
    rus: "отправить новую запись",
    est: "esita uus kirje",
    nor: "send inn ny oppføring",
  },
  loading: {
    eng: "Loading...",
    rus: "Загрузка...",
    est: "Laadimine...",
    nor: "Laster...",
  },
  modal: {
    errorMessages: {
      title: {
        eng: "Please check the form",
        rus: "Пожалуйста, проверьте форму",
        est: "Palun kontrolli vormi",
        nor: "Vennligst sjekk skjemaet",
      },
      content: {
        eng: "Not all fields are filled",
        rus: "Не все поля заполнены",
        est: "Kõik väljad ei ole täidetud",
        nor: "Ikke alle felt er fylt ut",
      },
    },
    creationResults: {
      eng: "Creation Results",
      rus: "Результаты создания",
      est: "Loomise tulemused",
      nor: "Opprettelsesresultater",
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
  },
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  //Get form data
  const formData = await request.formData();

  //Get payload
  const jsonPayload = JSON.parse(formData.get("payload") as string) as {
    title: string;
    price: number;
    area: number;
    numberOfRooms: number;
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
  };

  //Get and check main image
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

  //Save in DB
  await connectToDB();
  try {
    //Firstly create entity in mongodb
    const createdProject = await projectModel.create({
      title: jsonPayload.title,
      price: jsonPayload.price,
      area: jsonPayload.area,
      numberOfRooms: jsonPayload.numberOfRooms,
      floors: jsonPayload.floors,
      quickDesc: JSON.stringify(jsonPayload.quickDesc),
      fullDesc: JSON.stringify(jsonPayload.fullDesc),
      featuresList: JSON.stringify(jsonPayload.featuresList),
    });

    //If db creation went well - create folder for the project on Disk
    const projectId = createdProject._id.toString();
    const projectBaseDir = path.join(
      process.cwd(),
      "public",
      "projects",
      projectId
    );
    const mainImageDir = path.join(projectBaseDir, "main_image");
    const carouselImagesDir = path.join(projectBaseDir, "carousel_images");
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

    //Store path to the folder in DB
    createdProject.imagesFolder = projectId;
    await createdProject.save();
  } catch (error) {
    console.log(error);
    return json({ success: false });
  }

  return json({ success: true });
};

const NewProject = () => {
  //Fetcher
  const fetcher = useFetcher<{ success: boolean }>();

  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const resetState = useNewProjectStore((state) => state.resetState);

  //Modal manager
  const isOpen = useAdminInfoModalStore((state) => state.isOpen);
  const openModal = useAdminInfoModalStore((state) => state.openModal);
  const setTitle = useAdminInfoModalStore((state) => state.setTitle);
  const setContent = useAdminInfoModalStore((state) => state.setContent);

  //Show modal window
  const showModal = () => {
    setTitle(translations.modal.errorMessages.title[lang!]);
    setContent(translations.modal.errorMessages.content[lang!]);
    openModal();
  };

  const submitNewProject = async () => {
    //Get form input results
    const {
      title,
      price,
      area,
      numberOfRooms,
      floors,
      quickDesc,
      featuresList,
      fullDesc,
      mainImage,
      carouselImages,
    } = useNewProjectStore.getState();

    //Validate form
    const errors: { msg: string }[] = [];

    if (!title || !title.trim())
      errors.push({ msg: "Title must not be empty" });
    if (!price) errors.push({ msg: "Price must not be empty" });
    if (!area) errors.push({ msg: "Area must not be empty" });
    if (!numberOfRooms)
      errors.push({ msg: "Number of rooms must not be empty" });
    if (!floors) errors.push({ msg: "Floors must not be empty" });

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
      showModal();
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
    };
    formData.append("payload", JSON.stringify(payload));

    //Append main image (With compression)
    const compressedMainImageBlob = await compressFile(mainImage!);
    const compressedMainImage = new File(
      [compressedMainImageBlob],
      mainImage!.name,
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
      action: `/admin/${lang}/projects/new`,
    });
  };

  //Track action result
  useEffect(() => {
    //If all went well
    if (fetcher.state === "idle" && fetcher.data?.success === true) {
      //Show modal window

      //Reset form
      resetState();
    }
  }, [fetcher.data, fetcher.state, resetState]);

  //Handle scroll disable/enable
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isOpen]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 gap-y-20 pb-20">
      {/* Inputs for quick data (Visible in products list) */}
      <NewProjectQuickDataForm />

      {/* Input for images carousel */}
      <NewProjectCarouselmagesForm />

      {/* Input for product`s full description (Will be visible on product`s page) */}
      <NewProjectFullDescriptionForm />

      {/* Inputs for detailed data (Visible in products page) */}
      <NewProjectDetailsListForm />

      {/* Submit button */}
      {fetcher.state === "idle" ? (
        <button
          onClick={submitNewProject}
          className="w-full capitalize h-[5rem] md:col-start-2 md:cols-span-1 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.submitButton[lang!]}
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
            <span className="sr-only">{translations.loading[lang!]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProject;
