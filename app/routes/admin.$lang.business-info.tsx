import { ReactNode, useEffect, useState } from "react";
import { Trash } from "lucide-react";

import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { getSession } from "~/utils/session";
import { connectToDB } from "~/utils/db";

import businessInfoModel from "~/models/BusinessInfo";
import { useLoaderData, useFetcher, useParams } from "@remix-run/react";

import useAdminBusinessInfoStore from "~/stores/AdminBusinessInfoStore";

type ArrayItem = {
  id: string;
  value: string;
};

const translations = {
  header: {
    rus: "Контактные данные предприятия и общая информация",
    est: "Ettevõtte kontaktandmed ja üldine teave",
    eng: "Company contact details and general information",
    nor: "Bedriftens kontaktinformasjon og generell informasjon",
  },
  businessTitle: {
    rus: "Название компании",
    est: "Ettevõtte nimi",
    eng: "Business Title",
    nor: "Bedriftstittel",
  },
  addressesInputs: {
    rus: "Поля для адресов",
    est: "Aadressi sisestusväljad",
    eng: "Addresses inputs",
    nor: "Adresse-innskrivingsfelt",
  },
  addNewAddressLine: {
    rus: "Добавить новую строку адреса",
    est: "Lisa uus aadressirida",
    eng: "Add new address line",
    nor: "Legg til ny adresselinje",
  },
  phoneInputs: {
    rus: "Поля для телефонов",
    est: "Telefoninumbri sisestusväljad",
    eng: "Phone inputs",
    nor: "Telefon-innskrivingsfelt",
  },
  emailInputs: {
    rus: "Поля для электронной почты",
    est: "E-posti sisestusväljad",
    eng: "Email inputs",
    nor: "E-post innskrivingsfelt",
  },
  addNewEmailLine: {
    rus: "Добавить новую строку электронной почты",
    est: "Lisa uus e-posti rida",
    eng: "Add new email line",
    nor: "Legg til ny e-postlinje",
  },
  addNewPhoneNumberLine: {
    rus: "Добавить новую строку телефона",
    est: "Lisa uus telefonirida",
    eng: "Add new phone line",
    nor: "Legg til ny telefonlinje",
  },
  country: {
    rus: "страна",
    est: "riik",
    eng: "country",
    nor: "land",
  },
  city: {
    rus: "город",
    est: "linn",
    eng: "city",
    nor: "by",
  },
  street: {
    rus: "улица",
    est: "tänav",
    eng: "street",
    nor: "gate",
  },
  houseNumber: {
    rus: "номер дома",
    est: "maja number",
    eng: "house number",
    nor: "husnummer",
  },
  addressToBeDisplayedOnMap: {
    rus: "Адрес, который будет отображаться на карте",
    est: "Aadress, mida kuvatakse kaardil",
    eng: "Address that will be displayed on the map",
    nor: "Adresse som vises på kartet",
  },
  saveChanges: {
    rus: "сохранить изменения",
    est: "salvesta muudatused",
    eng: "save changes",
    nor: "lagre endringer",
  },
  email: {
    rus: "электронная почта",
    est: "e-post",
    eng: "email",
    nor: "e-post",
  },
  phoneNumber: {
    rus: "номер телефона",
    est: "telefoninumber",
    eng: "phone number",
    nor: "telefonnummer",
  },
  address: {
    rus: "адрес",
    est: "aadress",
    eng: "address",
    nor: "adresse",
  },
  warning: {
    rus: "Предупреждение",
    est: "Hoiatus",
    eng: "Warning",
    nor: "Advarsel",
  },
  noEmailsProvided: {
    rus: "Не были указаны электронные почты",
    est: "Ühtegi e-posti ei ole esitatud",
    eng: "No emails were provided",
    nor: "Ingen e-poster ble oppgitt",
  },
  noPhoneNumberProvided: {
    rus: "Не были указаны номера телефонов",
    est: "Ühtegi telefoninumbrit ei ole esitatud",
    eng: "No phone numbers were provided",
    nor: "Ingen telefonnumre ble oppgitt",
  },
  noAddresses: {
    rus: "Не были указаны адреса",
    est: "Ühtegi aadressi ei ole esitatud",
    eng: "No addresses were provided",
    nor: "Ingen adresser ble oppgitt",
  },
  noAddressToBeDisplayed: {
    rus: "Не был указан адрес для отображения на карте",
    est: "Kaardil kuvamiseks ei ole aadressi esitatud",
    eng: "No address to be displayed on the map was provided",
    nor: "Ingen adresse for visning på kartet ble oppgitt",
  },
  noBusinessTitleProvided: {
    rus: "Название компании не указано",
    est: "Ettevõtte nime ei ole esitatud",
    eng: "No business title provided",
    nor: "Ingen bedriftsnavn ble oppgitt",
  },

  success: {
    rus: "Успех",
    est: "Õnnestus",
    eng: "Success",
    nor: "Suksess",
  },
  changesSaved: {
    rus: "Изменения были сохранены",
    est: "Muudatused on salvestatud",
    eng: "Changes were saved",
    nor: "Endringene ble lagret",
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

  //Get data
  const data = await request.formData();

  //Check data
  const title = data.get("businessTitle");
  const emails = data.get("businessEmails");
  const phones = data.get("businessPhoneNumbers");
  const address = data.get("businessAddress");
  const addressToDisplay = data.get("businessAddressToDisplayInFrame");

  //Object which will contain errors (If any present)
  const errors: string[] = [];

  if (!title) {
    errors.push("noTitleProvided");
  }

  const parsedEmails = JSON.parse(emails as string);
  if (!parsedEmails.length) {
    errors.push("noEmailsProvided");
  }

  const parsedAddress = JSON.parse(address as string);
  if (!parsedAddress.length) {
    errors.push("noAddressProvided");
  }

  const parsedPhones = JSON.parse(phones as string);
  if (!parsedPhones.length) {
    errors.push("noPhonesProvided");
  }

  const parsedAddressToDisplay = JSON.parse(addressToDisplay as string);
  if (!parsedAddressToDisplay) {
    errors.push("noAddressToDisplayProvided");
  }
  for (const key in parsedAddressToDisplay) {
    if (!parsedAddressToDisplay[key]) {
      if (!errors.find((item) => item === "noAddressToDisplayProvided")) {
        errors.push("noAddressToDisplayProvided");
      }
    }
  }

  try {
    await connectToDB();
    await businessInfoModel.findOneAndUpdate(
      { id: "businessInfoData" },
      {
        businessTitle: title,
        physicalAddressArr: parsedAddress,
        phoneNumbersArr: parsedPhones,
        emailsArr: parsedEmails,
        addressToDisplayInFrame: parsedAddressToDisplay,
      }
    );

    return json({
      success: true,
      errors,
    });
  } catch (error) {
    return json({
      success: false,
      error,
    });
  }
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Check for authentication
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  //If user is unauthorized
  if (!session.get("isAdmin")) {
    return redirect("/login");
  }

  try {
    await connectToDB();

    const businessData = await businessInfoModel
      .findOne({
        id: "businessInfoData",
      })
      .lean();

    if (!businessData) {
      return json({
        success: false,
        msg: "noDataFound",
      });
    }

    return businessData;
  } catch (error) {
    return json({
      success: false,
      error,
    });
  }
};

const BusinessFormInputComponent = ({
  title,
  type,
  id,
  removable,
  removeButtonAction,
  value,
  onChangeHandler,
}: {
  type: string;
  title: string;
  id: string;
  removable?: boolean;
  removeButtonAction?: () => void;
  value: string | null;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label htmlFor={id} className="w-full grid grid-cols-5 grid-rows-2">
      <span className="text-md font-medium text-gray-700 row-start-1 row-span-1 col-start-1 col-span-3 self-end">
        {" "}
        {title}{" "}
      </span>

      {removable && (
        <button
          onClick={removeButtonAction}
          className="col-start-5 col-span-1 row-start-1 row-span-1 self-end justify-self-end"
        >
          <Trash />
        </button>
      )}

      <input
        type={type}
        id={id}
        value={value || ""}
        onChange={onChangeHandler}
        className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm py-2 px-2 border row-start-2 row-span-1 col-span-5"
      />
    </label>
  );
};

const BusinessAddInputButtonComponent = ({
  buttonInnerText,
  clickHandler,
}: {
  buttonInnerText: string;
  clickHandler: () => void;
}) => {
  return (
    <button
      onClick={clickHandler}
      className="mt-4 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
    >
      {buttonInnerText}
    </button>
  );
};

const BusinessMultipleInputsSectionComponent = ({
  children,
  header,
}: {
  children: ReactNode;
  header: string;
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-start">
      {/* Section header */}
      <p className="font-normal text-lg pb-4">{header}</p>

      {/* Inner content */}
      <div className="rounded-md border border-gray-300 p-4 shadow-sm w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

const WarningToastComponent = ({
  isOpened,
  content,
}: {
  isOpened: boolean;
  content: string[] | null;
}) => {
  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  return (
    <div
      role="alert"
      className={`${
        !isOpened && "hidden"
      } rounded-md border border-amber-500 bg-amber-50 p-4 shadow-sm fixed top-10 w-11/12 lg:w-6/12 lg:left-[20rem] justify-self-center`}
    >
      <div className="flex items-start gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="-mt-0.5 size-6 text-amber-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          ></path>
        </svg>

        <div className="flex-1">
          <strong className="block leading-tight font-medium text-amber-800">
            {" "}
            {translations["warning"][lang!]}{" "}
          </strong>

          {/* Render content */}
          {content &&
            content.length &&
            content.map((item) => (
              <p key={item} className="mt-0.5 text-sm text-amber-700">
                {item === "noEmailsProvided"
                  ? translations["noEmailsProvided"][lang!]
                  : item === "noPhonesProvided"
                  ? translations["noPhoneNumberProvided"][lang!]
                  : item === "noAddressProvided"
                  ? translations["noAddresses"][lang!]
                  : item === "noTitleProvided"
                  ? translations["noBusinessTitleProvided"][lang!]
                  : item === "noAddressToDisplayProvided"
                  ? translations["noAddressToBeDisplayed"][lang!]
                  : ""}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

const SuccessToastComponent = ({ isOpened }: { isOpened: boolean }) => {
  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  return (
    <div
      role="alert"
      className={`${
        !isOpened && "hidden"
      } rounded-md border border-green-500 bg-green-50 p-4 shadow-sm fixed top-10 w-11/12 lg:w-6/12 lg:left-[20rem] justify-self-center`}
    >
      <div className="flex items-start gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="-mt-0.5 size-6 text-green-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>

        <div className="flex-1">
          <strong className="block leading-tight font-medium text-green-800">
            {" "}
            {translations["success"][lang!]}
            {}
          </strong>

          <p className="mt-0.5 text-sm text-green-700">
            {translations["changesSaved"][lang!]}
          </p>
        </div>
      </div>
    </div>
  );
};

const BusinessInfoRoute = () => {
  const {
    businessTitle,
    phoneNumbersArr,
    physicalAddressArr,
    emailsArr,
    addressToDisplayInFrame,
  } = useLoaderData<{
    businessTitle: string;
    physicalAddressArr: ArrayItem[];
    phoneNumbersArr: ArrayItem[];
    emailsArr: ArrayItem[];
    addressToDisplayInFrame: {
      country: string;
      city: string;
      street: string;
      houseNumber: string;
    };
  }>();
  const fetcher = useFetcher<{ errors: string[]; success: boolean }>();

  //Warning toast state
  const [warningToastOpened, setWarningToastOpened] = useState(false);
  const [warningToastContent, setWarningToastContent] = useState<
    string[] | null
  >(null);

  //Success toast state
  const [successToastOpened, setSuccessToastOpened] = useState(false);

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Store manager
  const setDataFromDB = useAdminBusinessInfoStore(
    (state) => state.setDataFromDB
  );
  const businessTitleFromStore = useAdminBusinessInfoStore(
    (state) => state.businessTitle
  );
  const setBusinessTitle = useAdminBusinessInfoStore(
    (state) => state.setBusinessTitle
  );
  const businessAddressToDisplayInFrame = useAdminBusinessInfoStore(
    (state) => state.businessAddressToDisplayInFrame
  );
  const businessPhysicalAddressesArray = useAdminBusinessInfoStore(
    (state) => state.businessPhysicalAddressesArray
  );
  const businessPhoneNumbersArray = useAdminBusinessInfoStore(
    (state) => state.businessPhoneNumbersArray
  );
  const businessEmailsArray = useAdminBusinessInfoStore(
    (state) => state.businessEmailsArray
  );
  const changeArrayItemValue = useAdminBusinessInfoStore(
    (state) => state.changeArrayItemValue
  );
  const appendToArray = useAdminBusinessInfoStore(
    (state) => state.appendToArray
  );
  const removeFromArray = useAdminBusinessInfoStore(
    (state) => state.removeFromArray
  );
  const setAddressToDisplay = useAdminBusinessInfoStore(
    (state) => state.setAddressToDisplay
  );

  //Handle data submit
  const handleSubmit = () => {
    //Get data
    const {
      businessTitle,
      businessEmailsArray,
      businessPhysicalAddressesArray,
      businessPhoneNumbersArray,
      businessAddressToDisplayInFrame,
    } = useAdminBusinessInfoStore.getState();

    //Convert data to FormData format
    const formDataToAppend = new FormData();
    formDataToAppend.append("businessTitle", businessTitle!);
    formDataToAppend.append(
      "businessEmails",
      JSON.stringify(businessEmailsArray)
    );
    formDataToAppend.append(
      "businessAddress",
      JSON.stringify(businessPhysicalAddressesArray)
    );
    formDataToAppend.append(
      "businessPhoneNumbers",
      JSON.stringify(businessPhoneNumbersArray)
    );
    formDataToAppend.append(
      "businessAddressToDisplayInFrame",
      JSON.stringify(businessAddressToDisplayInFrame)
    );

    //Send data to server
    fetcher.submit(formDataToAppend, {
      encType: "multipart/form-data",
      method: "POST",
      action: `/admin/${lang}/business-info`,
    });
  };

  //Set initial data after loader is done
  useEffect(() => {
    setDataFromDB({
      title: businessTitle,
      emailsArr,
      phonesNumbers: phoneNumbersArr,
      addressesArr: physicalAddressArr,
      addressToDisplay: addressToDisplayInFrame,
    });
  }, [
    businessTitle,
    phoneNumbersArr,
    physicalAddressArr,
    emailsArr,
    setDataFromDB,
    addressToDisplayInFrame,
  ]);

  //Track fetcher data
  useEffect(() => {
    if (fetcher.state === "idle") {
      //Show Warning toast if there were any errors
      if (fetcher.data?.errors.length && fetcher.data?.success) {
        setWarningToastOpened(true);
        setWarningToastContent(fetcher.data.errors);
      } else if (!fetcher.data?.errors.length && fetcher.data?.success) {
        setSuccessToastOpened(true);
      }
    }
  }, [fetcher.data, fetcher.state]);

  //Track toasts states
  useEffect(() => {
    if (warningToastOpened) {
      setTimeout(() => {
        setWarningToastOpened(false);
      }, 5000);
    } else if (successToastOpened) {
      setTimeout(() => {
        setSuccessToastOpened(false);
      }, 5000);
    }
  }, [warningToastOpened, successToastOpened]);

  return (
    <>
      <section className="w-full grid grid-cols-1 pb-10">
        {/* Header */}
        <header className="w-full flex justify-center px-4 mt-10">
          <p className="text-xl">{translations["header"][lang!]}</p>
        </header>

        {/* Content */}
        <div className="w-full">
          <div className="w-full lg:w-11/12 xl:w-9/12 mx-auto px-10 mt-10 grid grid-cols-1 md:grid-cols-2 md:gap-x-10 gap-y-10 md:items-start">
            {/* Business title input */}
            <BusinessFormInputComponent
              title={translations["businessTitle"][lang!]}
              id="businessTitle"
              type="text"
              value={businessTitleFromStore}
              onChangeHandler={(e) => setBusinessTitle(e.target.value)}
            />

            {/* Business address input (Can consist of multiple inputs) */}
            <BusinessMultipleInputsSectionComponent
              header={translations["addressesInputs"][lang!]}
            >
              {(businessPhysicalAddressesArray &&
                businessPhysicalAddressesArray.length &&
                businessPhysicalAddressesArray.map((item, i) => (
                  <BusinessFormInputComponent
                    key={item.id}
                    title={`${translations["address"][lang!]} #${i + 1}`}
                    removable
                    id={item.id}
                    value={item.value}
                    type="string"
                    onChangeHandler={(e) =>
                      changeArrayItemValue(e.target.value, item.id, "address")
                    }
                    removeButtonAction={() =>
                      removeFromArray("address", item.id)
                    }
                  />
                ))) ||
                null}

              {/* Add new input button */}
              <BusinessAddInputButtonComponent
                clickHandler={() => {
                  appendToArray("address");
                }}
                buttonInnerText={translations["addNewAddressLine"][lang!]}
              />
            </BusinessMultipleInputsSectionComponent>

            {/* Business phones input (Can consist of multiple inputs) */}
            <BusinessMultipleInputsSectionComponent
              header={translations["phoneInputs"][lang!]}
            >
              {(businessPhoneNumbersArray &&
                businessPhoneNumbersArray.length &&
                businessPhoneNumbersArray.map((item, i) => (
                  <BusinessFormInputComponent
                    key={item.id}
                    title={`${translations["phoneNumber"][lang!]} #${i + 1}`}
                    removable
                    id={item.id}
                    value={item.value}
                    type="tel"
                    onChangeHandler={(e) =>
                      changeArrayItemValue(e.target.value, item.id, "phones")
                    }
                    removeButtonAction={() =>
                      removeFromArray("phones", item.id)
                    }
                  />
                ))) ||
                null}

              {/* Add new input button */}
              <BusinessAddInputButtonComponent
                clickHandler={() => {
                  appendToArray("phones");
                }}
                buttonInnerText={translations["addNewPhoneNumberLine"][lang!]}
              />
            </BusinessMultipleInputsSectionComponent>

            {/* Business emails input (Can consist of multiple inputs) */}
            <BusinessMultipleInputsSectionComponent
              header={translations["emailInputs"][lang!]}
            >
              {(businessEmailsArray &&
                businessEmailsArray.length &&
                businessEmailsArray.map((item, i) => (
                  <BusinessFormInputComponent
                    key={item.id}
                    title={`${translations["email"][lang!]} #${i + 1}`}
                    removable
                    id={item.id}
                    value={item.value}
                    type="email"
                    onChangeHandler={(e) =>
                      changeArrayItemValue(e.target.value, item.id, "emails")
                    }
                    removeButtonAction={() =>
                      removeFromArray("emails", item.id)
                    }
                  />
                ))) ||
                null}

              {/* Add new input button */}
              <BusinessAddInputButtonComponent
                clickHandler={() => {
                  appendToArray("emails");
                }}
                buttonInnerText={translations["addNewEmailLine"][lang!]}
              />
            </BusinessMultipleInputsSectionComponent>

            {/* Address to display in frame input */}
            <BusinessMultipleInputsSectionComponent
              header={translations["addressToBeDisplayedOnMap"][lang!]}
            >
              {/* Country */}
              <BusinessFormInputComponent
                title={translations["country"][lang!]}
                id={"countryInput"}
                value={businessAddressToDisplayInFrame["country"]}
                onChangeHandler={(e) =>
                  setAddressToDisplay(e.target.value, "country")
                }
                type="string"
              />

              {/* City */}
              <BusinessFormInputComponent
                title={translations["city"][lang!]}
                id={"cityInput"}
                value={businessAddressToDisplayInFrame["city"]}
                onChangeHandler={(e) =>
                  setAddressToDisplay(e.target.value, "city")
                }
                type="string"
              />

              {/* Street */}
              <BusinessFormInputComponent
                title={translations["street"][lang!]}
                id={"streetInput"}
                value={businessAddressToDisplayInFrame["street"]}
                onChangeHandler={(e) =>
                  setAddressToDisplay(e.target.value, "street")
                }
                type="string"
              />

              {/* House number */}
              <BusinessFormInputComponent
                title={translations["houseNumber"][lang!]}
                id={"houseNumberInput"}
                value={businessAddressToDisplayInFrame["houseNumber"]}
                onChangeHandler={(e) =>
                  setAddressToDisplay(e.target.value, "houseNumber")
                }
                type="string"
              />
            </BusinessMultipleInputsSectionComponent>
          </div>
        </div>

        {/* Save changes button */}
        <div className="w-full flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            disabled={fetcher.state !== "idle"}
            className="w-10/12 lg:w-6/12 mx-auto inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600"
          >
            {translations["saveChanges"][lang!]}
          </button>
        </div>
      </section>

      <WarningToastComponent
        isOpened={warningToastOpened}
        content={warningToastContent}
      />

      <SuccessToastComponent isOpened={successToastOpened} />
    </>
  );
};

export default BusinessInfoRoute;
