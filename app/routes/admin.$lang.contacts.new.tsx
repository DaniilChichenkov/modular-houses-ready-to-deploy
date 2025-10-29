import { useState, useEffect } from "react";
import { useFetcher, useParams } from "@remix-run/react";
import {
  ActionFunction,
  ActionFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { ChevronDown } from "lucide-react";

import { getSession } from "~/utils/session";
import { connectToDB } from "~/utils/db";
import memberModel from "~/models/Member";

import useNewContactStore from "~/stores/NewContactStore";
import useAdminInfoModalStore from "~/stores/AdminInfoModalStore";

const translations = {
  addContact: {
    eng: "Add Contact",
    rus: "Добавить контакт",
    est: "Lisa kontakt",
    nor: "Legg til kontakt",
  },
  teamMemberName: {
    eng: "Team Member Name",
    rus: "Имя участника команды",
    est: "Meeskonnaliikme nimi",
    nor: "Navn på teammedlem",
  },
  inputNameHere: {
    eng: "Input name here",
    rus: "Введите имя здесь",
    est: "Sisesta nimi siia",
    nor: "Skriv inn navn her",
  },
  position: {
    eng: "Position",
    rus: "Должность",
    est: "Ametikoht",
    nor: "Stilling",
  },
  selectPosition: {
    eng: "Select position",
    rus: "Выберите должность",
    est: "Vali ametikoht",
    nor: "Velg stilling",
  },
  inputPosition: {
    eng: "Enter position...",
    rus: "Введите должность...",
    est: "Sisesta ametikoht...",
    nor: "Skriv inn stilling...",
  },
  language: {
    eng: "Language",
    rus: "Язык",
    est: "Keel",
    nor: "Språk",
  },
  manager: {
    eng: "Manager",
    rus: "Менеджер",
    est: "Juhataja",
    nor: "Leder",
  },
  customerSpecialist: {
    eng: "Customer Specialist",
    rus: "Специалист по работе с клиентами",
    est: "Kliendispetsialist",
    nor: "Kundespesialist",
  },
  customerSupport: {
    eng: "Customer Support",
    rus: "Поддержка клиентов",
    est: "Klienditugi",
    nor: "Kundestøtte",
  },
  languages: {
    eng: "Languages",
    rus: "Языки",
    est: "Keeled",
    nor: "Språk",
  },
  inputTelHere: {
    eng: "Input Tel here",
    rus: "Введите номер телефона здесь",
    est: "Sisesta telefoninumber siia",
    nor: "Skriv inn telefonnummer her",
  },
  inputEmailHere: {
    eng: "Input Email here",
    rus: "Введите адрес электронной почты здесь",
    est: "Sisesta e-postiaadress siia",
    nor: "Skriv inn e-postadresse her",
  },
  submitContact: {
    eng: "Submit",
    rus: "Создать",
    est: "Loo",
    nor: "Opprett",
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
  contactCreateError: {
    eng: "Contact creation error",
    rus: "Ошибка при создании контакта",
    est: "Kontakti loomise viga",
    nor: "Feil ved opprettelse av kontakt",
  },
  mustFillAllInputs: {
    eng: "You must fill all inputs",
    rus: "Вы должны заполнить все поля",
    est: "Kõik väljad peavad olema täidetud",
    nor: "Du må fylle ut alle felt",
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

  //Extract and validate data
  const name = formData.get("name");
  const tel = formData.get("tel");
  const email = formData.get("email");
  const languages = formData.get("languages");
  const position = formData.get("position");

  if (!name || !tel || !email || !languages || !position) {
    return json({ success: false, msg: "Not enough data provided" });
  }

  //Create db record
  try {
    await connectToDB();
    await memberModel.create({
      name,
      tel,
      email,
      languages,
      position,
    });
    return json({ success: true });
  } catch (error) {
    return json({ success: false });
  }
};

const AdminNewContactRoute = () => {
  const [isValidating, setIsValidating] = useState<boolean>(false);
  //Options dropdown visibility
  const [optionsVisible, setOptionsVisible] = useState<boolean>(false);
  const fetcher = useFetcher<{ success: boolean }>();

  //Get language from params
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  //Store
  const name = useNewContactStore((state) => state.name);
  const tel = useNewContactStore((state) => state.tel);
  const email = useNewContactStore((state) => state.email);
  const languages = useNewContactStore((state) => state.languages);
  const position = useNewContactStore((state) => state.position);

  const setName = useNewContactStore((state) => state.setName);
  const setTel = useNewContactStore((state) => state.setTel);
  const setEmail = useNewContactStore((state) => state.setEmail);
  const setPosition = useNewContactStore((state) => state.setPoisition);
  const selectLanguage = useNewContactStore((state) => state.selectLanguage);
  const unSelectLanguage = useNewContactStore(
    (state) => state.unSelectLanguage
  );
  const selectPositionLanguage = useNewContactStore(
    (state) => state.selectPositionLanguage
  );
  const resetForm = useNewContactStore((state) => state.resetForm);

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

  //Toggle dropdown
  const toggleDropdown = () => {
    setOptionsVisible((prev) => !prev);
  };

  //Handle content input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Check input
    switch (e.target.id) {
      //Name
      case "teamMemberNameInput":
        setName(e.target.value);
        break;

      //Tel
      case "teamMemberTelInput":
        setTel(e.target.value);
        break;

      //Email
      case "teamMemberEmailInput":
        setEmail(e.target.value);
        break;

      //Position
      case "teamMemberPosition":
        setPosition(e.target.value);
        break;
    }
  };

  //Handle language select/un-select
  const handleLanguage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectLanguage(e.target.id);
    } else {
      unSelectLanguage(e.target.id);
    }
  };

  //Handle dropdown item click
  const handleDropdownItemClick = (action: () => void) => {
    //Perform action
    action();

    //Close dropdown
    setOptionsVisible(false);
  };

  //Handle submit
  const handleSubmit = () => {
    //Set validation flag
    setIsValidating(true);

    //Get data
    const { name, tel, email, position, languages } =
      useNewContactStore.getState();

    //Errors storage
    const errors: { msg: string }[] = [];

    if (!name.trim().length) {
      errors.push({ msg: "Name must not be empty" });
    }

    if (!tel.trim().length) {
      errors.push({ msg: "Tel must not be empty" });
    }

    if (!email.trim().length) {
      errors.push({ msg: "Email must not be empty" });
    }

    for (const key in position.content) {
      if (!position.content[key].length) {
        errors.push({ msg: "Position must not be empty" });
      }
    }

    let isLangSelected = false;
    for (const [key, value] of Object.entries(languages)) {
      if (value) isLangSelected = true;
    }

    if (!isLangSelected) {
      errors.push({ msg: "You must select at least 1 language" });
    }

    //Check for errors
    if (errors.length) {
      showModal(
        translations.contactCreateError[lang!],
        translations.mustFillAllInputs[lang!]
      );
      setIsValidating(false);
      return;
    }

    //Create formData
    const formData = new FormData();

    //Append team member`s data
    formData.append("name", name);
    formData.append("position", JSON.stringify(position));
    formData.append("tel", tel);
    formData.append("email", email);
    formData.append("tel", tel);
    formData.append("languages", JSON.stringify(languages));

    //Send data to server
    fetcher.submit(formData, {
      encType: "multipart/form-data",
      method: "POST",
      action: `/admin/${lang}/contacts/new`,
    });

    //Disable validation flag
    setIsValidating(false);
  };

  //Handle scroll disable/enable
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  }, [isOpen]);

  //Display status of new technology article creation
  useEffect(() => {
    if (fetcher.state === "idle") {
      if (fetcher.data) {
        if (fetcher.data.success) {
          showModal(
            translations.creationResults[lang!],
            translations.everythingWentWell[lang!]
          );
          //Clear form
          resetForm();
        } else {
          showModal(
            translations.creationResults[lang!],
            translations.errorOccurred[lang!]
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="w-full flex flex-col items-center justify-start gap-y-1 md:w-8/12 md:mx-auto lg:w-4/12">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center">
        {translations.addContact[lang!]}
      </h2>

      {/* Inputs */}
      <div className="w-full rounded-lg shadow-md px-4 py-8 flex flex-col gap-y-8">
        {/* Name */}
        <div className="w-full flex flex-col items-start justify-start mt-5">
          <p className="text-sm text-gray-500">
            {translations.teamMemberName[lang!]}
          </p>
          <input
            type="text"
            id="teamMemberNameInput"
            onChange={handleInput}
            placeholder={`${translations.inputNameHere[lang!]}...`}
            value={name}
            className="py-1 pl-2 w-full rounded border-gray-300 shadow-sm sm:text-sm mt-1"
          />
        </div>

        {/* Position */}
        <div className="w-full flex flex-col justify-start items-start">
          {/* Text and options dropdown */}
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-gray-500">{`${
              translations.position[lang!]
            }:`}</p>

            {/* Options dropdown */}
            <div className="relative inline-flex">
              <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                >
                  {position.lang}
                </button>

                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="duration-200 transition-colors px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative"
                  aria-label="Menu"
                >
                  <ChevronDown
                    className={`${
                      optionsVisible && "rotate-180"
                    } duration-200 transition-transform`}
                    size={16}
                  />
                </button>
              </span>

              <div
                role="menu"
                className={`${
                  !optionsVisible && "hidden"
                } absolute end-0 top-12 z-50 w-56 divide-y divide-gray-200 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
              >
                <div>
                  <p className="block px-3 py-2 text-sm text-gray-500">
                    {translations.language[lang!]}:
                  </p>

                  <button
                    onClick={() =>
                      handleDropdownItemClick(() =>
                        selectPositionLanguage("est")
                      )
                    }
                    className={`${
                      position.lang === "est" && "bg-gray-50"
                    } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                    role="menuitem"
                  >
                    Est
                  </button>

                  <button
                    onClick={() =>
                      handleDropdownItemClick(() =>
                        selectPositionLanguage("rus")
                      )
                    }
                    className={`${
                      position.lang === "rus" && "bg-gray-50"
                    } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                    role="menuitem"
                  >
                    Rus
                  </button>

                  <button
                    onClick={() =>
                      handleDropdownItemClick(() =>
                        selectPositionLanguage("eng")
                      )
                    }
                    className={`${
                      position.lang === "eng" && "bg-gray-50"
                    } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                    role="menuitem"
                  >
                    Eng
                  </button>

                  <button
                    onClick={() =>
                      handleDropdownItemClick(() =>
                        selectPositionLanguage("nor")
                      )
                    }
                    className={`${
                      position.lang === "nor" && "bg-gray-50"
                    } w-full text-left block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900`}
                    role="menuitem"
                  >
                    Nor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <input
            type="text"
            id="teamMemberPosition"
            onChange={handleInput}
            value={position.content[position.lang]}
            placeholder={translations.inputPosition[lang!]}
            className="w-full rounded pe-10 py-2 shadow-md sm:text-sm pl-2 mt-3"
          />

          {/* <div>
            <p className="text-sm text-gray-500">{`${
              translations.position[lang!]
            }:`}</p>

            <p className="text-normal text-black">
              {(position && translations[position][lang!]) ||
                translations.selectPosition[lang!]}
            </p>
          </div> */}

          {/* Position selection dropdown */}
          {/* <div className="relative inline-flex">
            <span className="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button
                onClick={toggleDropdown}
                type="button"
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
              >
                {translations.selectPosition[lang!]}
              </button>

              <button
                type="button"
                onClick={toggleDropdown}
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                aria-label="Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </span>

            <div
              role="menu"
              className={`${
                !isDropdownOpen && "hidden"
              } absolute z-50 end-0 top-12 w-56 overflow-hidden rounded border border-gray-300 bg-white shadow-sm`}
            >
              <button
                className="w-full  block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
                onClick={() => handleDropdownItemClick("manager")}
              >
                {translations.manager[lang!]}
              </button>

              <button
                className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
                onClick={() => handleDropdownItemClick("customerSpecialist")}
              >
                {translations.customerSpecialist[lang!]}
              </button>

              <button
                className="w-full block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
                onClick={() => handleDropdownItemClick("customerSupport")}
              >
                {translations.customerSupport[lang!]}
              </button>
            </div>
          </div> */}
        </div>

        {/* Languages */}
        <div className="w-full flex flex-col items-start justify-start">
          {/* Text for clarification */}
          <p className="text-sm text-gray-500">{`${
            translations.languages[lang!]
          }:`}</p>

          {/* Select languages */}
          <div className="w-full grid grid-cols-2 mt-5 gap-y-8">
            {/* Est */}
            <label className="inline-flex items-center cursor-pointer gap-x-5">
              <input
                checked={languages["est"]}
                type="checkbox"
                id="est"
                onChange={handleLanguage}
                className="sr-only peer"
              />
              <span className="ms-3 text-lg font-medium text-black">Est</span>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>

            {/* Eng */}
            <label className="inline-flex items-center cursor-pointer gap-x-5">
              <input
                checked={languages["eng"]}
                type="checkbox"
                id="eng"
                onChange={handleLanguage}
                className="sr-only peer"
              />
              <span className="ms-3 text-lg font-medium text-black">Eng</span>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>

            {/* Rus */}
            <label className="inline-flex items-center cursor-pointer gap-x-5">
              <input
                checked={languages["rus"]}
                type="checkbox"
                id="rus"
                onChange={handleLanguage}
                className="sr-only peer"
              />
              <span className="ms-3 text-lg font-medium text-black">Rus</span>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>

            {/* Nor */}
            <label className="inline-flex items-center cursor-pointer gap-x-5">
              <input
                checked={languages["nor"]}
                type="checkbox"
                id="nor"
                onChange={handleLanguage}
                className="sr-only peer"
              />
              <span className="ms-3 text-lg font-medium text-black">Nor</span>
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Tel */}
        <div className="w-full flex flex-col items-start justify-start mt-5">
          <p className="text-sm text-gray-500">{"Tel:"}</p>
          <input
            type="tel"
            id="teamMemberTelInput"
            value={tel}
            onChange={handleInput}
            placeholder={`${translations.inputTelHere[lang!]}...`}
            className="py-1 pl-2 w-full rounded border-gray-300 shadow-sm sm:text-sm mt-1"
          />
        </div>

        {/* Email */}
        <div className="w-full flex flex-col items-start justify-start mt-5">
          <p className="text-sm text-gray-500">{"Email:"}</p>
          <input
            type="email"
            id="teamMemberEmailInput"
            value={email}
            onChange={handleInput}
            placeholder={`${translations.inputEmailHere[lang!]}...`}
            className="py-1 pl-2 w-full rounded border-gray-300 shadow-sm sm:text-sm mt-1"
          />
        </div>
      </div>

      {/* Submit button */}
      {fetcher.state === "idle" && !isValidating ? (
        <button
          onClick={handleSubmit}
          className="w-full h-[5rem] mt-[5rem] md:col-start-2 md:cols-span-1 inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
        >
          {translations.submitContact[lang!]}
        </button>
      ) : (
        <div className="w-full flex justify-center items-center mt-[5rem]">
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
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewContactRoute;
