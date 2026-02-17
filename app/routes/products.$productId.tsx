import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  NavLink,
  useLoaderData,
  useLocation,
  useSearchParams,
  Form,
  useActionData,
  useParams,
  useNavigation,
} from "@remix-run/react";
import { ChevronRight, Star, HandCoins, X } from "lucide-react";
import path from "path";
import fs from "fs/promises";

import { connectToDB } from "~/utils/db";
import projectModel from "~/models/Project";
import houseRequestModel from "~/models/HouseRequest";

import {
  ProjectSlider,
  ProjectBreadcrumbs,
  LightBox,
  ProjectModal,
} from "~/components/client";

import HomeLayout from "~/layouts/HomeLayout";
import useProjectModalStore from "~/stores/ProjectModalStore";
import { useEffect, useRef } from "react";

const translations = {
  area: {
    rus: "Площадь",
    est: "Pindala",
    en: "Area",
    nor: "Areal",
  },
  rooms: {
    rus: "Комнаты",
    est: "Toad",
    en: "Rooms",
    nor: "Rom",
  },
  floors: {
    rus: "Этажи",
    est: "Korrused",
    en: "Floors",
    nor: "Etasjer",
  },
  features: {
    rus: "Особенности",
    est: "Omadused",
    en: "Features",
    nor: "Egenskaper",
  },
  requestThisHouse: {
    en: "Request a Quote for This House",
    rus: "Запросить предложение на этот дом",
    est: "Küsi hinnapakkumist selle maja kohta",
    nor: "Be om tilbud på dette huset",
  },
  requestProductForm: {
    en: "Request a Quote",
    rus: "Запрос предложения",
    est: "Hinnapäring",
    nor: "Tilbudsforespørsel",
  },
  email: {
    en: "Email Address",
    rus: "Адрес электронной почты",
    est: "E-posti aadress",
    nor: "E-postadresse",
  },
  typeHereEmail: {
    en: "Enter your email address...",
    rus: "Введите адрес электронной почты...",
    est: "Sisestage oma e-posti aadress...",
    nor: "Skriv inn e-postadressen din...",
  },
  telOptional: {
    en: "Your phone number (optional)",
    rus: "Ваш номер телефона (необязательно)",
    est: "Teie telefoninumber (valikuline)",
    nor: "Ditt telefonnummer (valgfritt)",
  },
  typeHerePhone: {
    en: "Enter your phone number (optional)...",
    rus: "Введите номер телефона (необязательно)...",
    est: "Sisestage oma telefoninumber (valikuline)...",
    nor: "Skriv inn telefonnummeret ditt (valgfritt)...",
  },
  privacyPolicy: {
    en: "Privacy Policy",
    rus: "Политика конфиденциальности",
    est: "Privaatsuspoliitika",
    nor: "Personvernerklæring",
  },
  privacyPolicyInstrumental: {
    en: "the Privacy Policy",
    rus: "Политикой конфиденциальности",
    est: "privaatsuspoliitikaga",
    nor: "personvernerklæringen",
  },
  consentProcessing: {
    en: "I agree to the processing of my email address and, if provided, my phone number for the purpose of responding to my service inquiry in accordance with",
    rus: "Я согласен(на) на обработку моей электронной почты и, при указании, номера телефона для связи по запросу услуги в соответствии с",
    est: "Nõustun oma e-posti aadressi ja vajaduse korral telefoninumbri töötlemisega teenusepäringule vastamiseks vastavalt",
    nor: "Jeg samtykker til behandling av min e-postadresse og, dersom oppgitt, mitt telefonnummer for å besvare min tjenesteforespørsel i samsvar med",
  },
  submitRequest: {
    en: "Submit Request",
    rus: "Отправить запрос",
    est: "Esita päring",
    nor: "Send forespørsel",
  },
  requestSuccessMessage: {
    en: "Thank you for your request. Our team will reach out to you as soon as possible!",
    rus: "Спасибо за ваш запрос. Наша команда свяжется с вами в ближайшее время!",
    est: "Täname teid päringu eest. Meie meeskond võtab teiega esimesel võimalusel ühendust!",
    nor: "Takk for forespørselen din. Vårt team vil kontakte deg så snart som mulig!",
  },
  close: {
    en: "Close Window",
    rus: "Закрыть окно",
    est: "Sulge aken",
    nor: "Lukk vindu",
  },
  errorMessage: {
    en: "An error occurred. Please try again later or contact us directly.",
    rus: "Произошла ошибка. Пожалуйста, попробуйте снова позже или свяжитесь с нами напрямую.",
    est: "Ilmnes viga. Palun proovige hiljem uuesti või võtke meiega otse ühendust.",
    nor: "Det oppstod en feil. Vennligst prøv igjen senere eller kontakt oss direkte.",
  },
};

export const meta: MetaFunction = () => {
  return [
    { title: `Kuber - House Page` },
    {
      name: "description",
      content:
        "Discover our modern modular house projects built with advanced technology.",
    },
  ];
};

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const { productId } = params;

  //Check if product id was provided
  if (!productId) {
    return new Response("No project id was provided");
  }

  //Request db for data of this project
  try {
    //Establish db connection
    connectToDB();

    const project = await projectModel.find({ _id: productId }).lean();

    if (!project) {
      throw new Error("No project was found");
    }

    //Create images paths
    const projectImagesFolderName = project[0].imagesFolder!;

    //Get slider images
    const sliderImagesPath = path.join(
      process.cwd(),
      "public",
      "projects",
      projectImagesFolderName,
      "carousel_images",
    );
    const images = await fs.readdir(sliderImagesPath);
    const imagesFilePathsForClient = images.map(
      (item) => `/projects/${projectImagesFolderName}/carousel_images/${item}`,
    );

    return {
      ...project[0],
      carouselImagesPaths: imagesFilePathsForClient,
    };
  } catch (error) {
    throw new Error("Error during getting project from db");
  }
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const tel = formData.get("tel");
  const email = formData.get("email");
  const privacyAgreement = formData.get("privacyAgreement");
  const requestTime = formData.get("requestTime");
  const honeypot = formData.get("website");
  const projectId = formData.get("projectId");

  //Validate form
  const formValidationErrors: Record<string, boolean> = {};

  if (!email || typeof email !== "string") {
    formValidationErrors.invalidEmail = true;
  }

  if (!privacyAgreement) {
    formValidationErrors.uncheckedPrivacyAgreement = true;
  }

  if (tel && typeof tel !== "string") {
    formValidationErrors.invalidPhone = true;
  }

  if (!projectId || typeof projectId !== "string") {
    formValidationErrors.invalidId = true;
  }

  //Reject too-fast requests (But mimic as success)
  if (Date.now() < Number(requestTime) + 1000) {
    return Response.json({
      success: true,
      responseId: Date.now(),
    });
  }

  //Reject stale forms
  if (Date.now() > Number(requestTime) + 160000) {
    return Response.json({
      success: false,
      errors: {
        staleForm: true,
      },
      responseId: Date.now(),
    });
  }

  //Check honeypot
  if (honeypot) {
    return Response.json({
      success: true,
      responseId: Date.now(),
    });
  }

  if (Object.keys(formValidationErrors).length > 0) {
    return Response.json({
      success: false,
      errors: formValidationErrors,
      responseId: Date.now(),
    });
  }

  //Implement database integration
  //Check if project with provided id exists in database
  try {
    const project = await projectModel.findOne({ _id: projectId }).lean();

    //If no project was found
    if (!project) {
      return Response.json({
        success: false,
        responseId: Date.now(),
        errors: {
          noProjectFound: true,
        },
      });
    }

    //Create request record in db
    await houseRequestModel.create({
      projectId,
      tel,
      email,
    });

    return Response.json({
      success: true,
      responseId: Date.now(),
    });
  } catch (error) {
    return Response.json({
      success: false,
      serverSideError: true,
      responseId: Date.now(),
    });
  }
};

//Product description paragraph
const ProductDescriptionPar = ({ innerContent }: { innerContent: string }) => {
  //Check for language
  const { search } = useLocation();
  const lang: string = new URLSearchParams(search).get("lang")!;

  return (
    <p className="mt-4 text-gray-700 text-left whitespace-pre-wrap">
      {JSON.parse(innerContent)[lang === "en" ? "eng" : lang]}
    </p>
  );
};

//Product features list
const ProductFeaturesList = ({
  title,
  listItems,
}: {
  title: {
    eng: string;
    est: string;
    rus: string;
    nor: string;
  };
  listItems: {
    content: {
      eng: string;
      est: string;
      rus: string;
      nor: string;
    };
  }[];
}) => {
  //Check for language
  const { search } = useLocation();
  const lang: string = new URLSearchParams(search).get("lang")!;

  return (
    <div className="mt-10 w-full flex flex-col items-start md:items-center lg:items-start justify-start">
      <p className="text-lg font-semibold text-gray-900">
        {title[lang === "en" ? "eng" : lang]}
      </p>
      <ul className="mt-3 space-y-3">
        {listItems.map((item, i) => (
          <li
            key={i}
            className="flex justify-start md:justify-center lg:justify-start items-center gap-x-2"
          >
            <ChevronRight size={14} />
            {item.content[lang === "en" ? "eng" : lang]}
          </li>
        ))}
      </ul>
    </div>
  );
};

//Main product route
const ProductRoute = () => {
  //Product data
  const productData = useLoaderData<{
    _id: string;
    title: string;
    quickDesc: string;
    fullDesc: string;
    isDiscount: boolean;
    price: number;
    newPrice: number;
    isPopular: boolean;
    imagesFolder: string;
    carouselImagesPaths: string[];
    featuresList: string;
    area: number;
    numberOfRooms: number;
    floors: number;
  }>();

  //Action response
  const actionData = useActionData<{
    success: boolean;
    responseId: number;
    errors?: Record<string, boolean>;
  }>();

  //Track navigation state
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  //Response id (To show result of request once per request)
  const currentResponseId = useRef<number | null>(null);

  //Get search params
  const [searchParams] = useSearchParams();
  const { productId } = useParams();

  //Get lang
  const location = useLocation();
  type Lang = "rus" | "est" | "en" | "nor";
  const searchLang = new URLSearchParams(location.search).get("lang");
  const currentLang: Lang =
    searchLang === "rus" ||
    searchLang === "est" ||
    searchLang === "en" ||
    searchLang === "nor"
      ? searchLang
      : "en";

  //Parse features list
  const featuresList: {
    title: {
      eng: string;
      est: string;
      rus: string;
      nor: string;
    };
    listItems: {
      content: {
        eng: string;
        est: string;
        rus: string;
        nor: string;
      };
    }[];
  }[] = JSON.parse(productData.featuresList);

  //Modal store
  // const open = useProjectModalStore((state) => state.open);
  const handleOpen = useProjectModalStore((state) => state.setOpen);
  const setInnerContent = useProjectModalStore(
    (state) => state.setInnerContent,
  );

  //Handle modal close button click
  const handleModalCloseButtonClick = () => {
    handleOpen(false);
  };

  //Handle request button click
  const handleRequestButtonClick = () => {
    //Open modal
    handleOpen(true);

    //Set inner content for modal
    setInnerContent(
      <>
        <div className="w-11/12 max-w-md rounded-lg bg-white mx-auto max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <div className="flex items-start justify-between p-6">
            <h2
              id="modalTitle"
              className="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              {translations.requestProductForm[currentLang]}
            </h2>

            <button
              type="button"
              className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
              onClick={handleModalCloseButtonClick}
            >
              <X />
            </button>
          </div>

          <div>
            <Form
              method="POST"
              action={`.?${searchParams.toString()}`}
              className="space-y-4 p-4"
            >
              {/* Email */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  {translations.email[currentLang]}
                </label>

                <input
                  className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none p-3"
                  id="email"
                  type="email"
                  name="email"
                  placeholder={translations.typeHereEmail[currentLang]}
                  required
                />
              </div>

              {/* Phone number */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-900"
                  htmlFor="tel"
                >
                  {translations.telOptional[currentLang]}
                </label>

                <input
                  className="mt-1 w-full rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none p-3"
                  id="tel"
                  type="tel"
                  name="tel"
                  placeholder={translations.typeHerePhone[currentLang]}
                />
              </div>

              {/* Privacy agreement */}
              <div className="flex justify-start gap-x-3">
                <input
                  type="checkbox"
                  className="my-0.5 size-5 rounded border-gray-300 shadow-sm"
                  name="privacyAgreement"
                  required
                />

                <div>
                  <span className="font-medium text-gray-700">
                    {" "}
                    {translations.privacyPolicy[currentLang]}
                  </span>

                  <p className="mt-0.5 text-sm text-gray-700">
                    {translations.consentProcessing[currentLang]}
                    <NavLink
                      to={{
                        pathname: "/privacy-policy",
                        search: searchParams.toString(),
                      }}
                      state={{
                        returnTo: `/products/${productId}`,
                      }}
                      className="font-bold text-blue-600 underline ml-2"
                    >
                      {translations.privacyPolicyInstrumental[currentLang]}
                    </NavLink>
                  </p>
                </div>
              </div>

              <input type="hidden" name="requestTime" value={Date.now()} />

              <input type="text" name="website" className="hidden" />

              <input type="hidden" name="projectId" value={productId} />

              <div>
                <div className="h-px flex-1 bg-gray-300"></div>
              </div>

              <button
                className="block w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600"
                type="submit"
                disabled={isLoading}
              >
                {translations.submitRequest[currentLang!]}
              </button>
            </Form>
          </div>
        </div>
      </>,
    );
  };

  //Track action data
  useEffect(() => {
    //Show result of request
    if (actionData && actionData.responseId) {
      if (actionData.responseId !== currentResponseId.current) {
        //Change content of modal to inform user about result
        setInnerContent(
          <>
            <div className="w-11/12 max-w-md rounded-lg bg-white mx-auto max-h-[calc(100dvh-2rem)] overflow-y-auto">
              <div className="flex items-start justify-between p-6">
                <h2
                  id="modalTitle"
                  className="text-xl font-bold text-gray-900 sm:text-2xl text-center"
                >
                  {actionData.success
                    ? translations.requestSuccessMessage[currentLang!]
                    : translations.errorMessage[currentLang!]}
                </h2>
              </div>

              <div className="w-full flex justify-center items-center pb-6">
                <button
                  onClick={handleModalCloseButtonClick}
                  className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
                >
                  {translations.close[currentLang!]}
                </button>
              </div>
            </div>
          </>,
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData, setInnerContent]);

  return (
    <>
      <HomeLayout>
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 z-0">
            {/* Header section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-10">
              {/* Visual (Image and carousel) */}
              <div>
                <ProjectSlider imagePaths={productData.carouselImagesPaths} />
              </div>

              {/* Text data */}
              <div className="mt-10 md:mt-0 flex flex-col items-start justify-start">
                {/* Breadcrumbs navigation */}
                <ProjectBreadcrumbs projectTitle={productData.title} />

                {/* Features (Area, floors qty, rooms qty) */}
                <div className="w-full flex justify-start items-center flex-wrap gap-x-5 gap-y-5 mt-5">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                    {translations.area[currentLang]} - {productData.area}m2
                  </span>

                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                    {translations.floors[currentLang]} - {productData.floors}
                  </span>

                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                    {translations.rooms[currentLang]} -{" "}
                    {productData.numberOfRooms}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center mt-10">
                  {productData.title}
                </h2>

                {/* Badges (For now - Popular and Discount) */}
                <div className="w-full flex justify-start items-center gap-2 mt-3">
                  {/* Popular */}
                  {productData.isPopular && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-sm whitespace-nowrap text-purple-700 flex justify-start items-center gap-x-1">
                      <Star size={12} /> Popular
                    </span>
                  )}

                  {/* Discount */}
                  {productData.isDiscount && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700 flex justify-start items-center gap-x-1">
                      <HandCoins size={12} /> Discount
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="text-gray-700 mt-4">
                  {productData.price}&euro;
                  {productData.isDiscount && (
                    <span className="text-gray-400 line-through ml-2">
                      {productData.newPrice}&euro;
                    </span>
                  )}
                </p>

                {/* Description */}
                <ProductDescriptionPar innerContent={productData.fullDesc} />

                <button
                  onClick={handleRequestButtonClick}
                  className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 mt-10"
                >
                  {translations.requestThisHouse[currentLang]}
                </button>
              </div>
            </div>

            {/* List with features house provide */}
            {(featuresList.length && (
              <div className="w-full h-auto mt-10">
                {/* Divider */}
                <span className="flex items-center">
                  <span className="h-px flex-1 bg-gray-300"></span>

                  <span className="shrink-0 px-4 text-gray-900">
                    {translations.features[currentLang]}
                  </span>

                  <span className="h-px flex-1 bg-gray-300"></span>
                </span>

                {/* Replace with actual data in future */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {featuresList.map((item, i) => (
                    <ProductFeaturesList
                      key={i}
                      title={item.title}
                      listItems={item.listItems}
                    />
                  ))}
                </div>
              </div>
            )) ||
              null}
          </div>
        </section>
      </HomeLayout>
      <LightBox />
      <ProjectModal />
    </>
  );
};

export default ProductRoute;
