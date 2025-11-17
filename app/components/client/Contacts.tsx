import { ReactNode } from "react";
import { useLocation } from "@remix-run/react";

const translations = {
  contactData: {
    rus: "Контактные данные",
    est: "Kontaktandmed",
    en: "Contact details",
    nor: "Kontaktinformasjon",
  },
  location: {
    rus: "Местоположение",
    est: "Asukoht",
    en: "Location",
    nor: "Plassering",
  },
  ourTeam: {
    rus: "Наша команда",
    est: "Meie meeskond",
    en: "Our team",
    nor: "Vårt team",
  },
};

const ContactsSectionButton = ({ innerText }: { innerText: string }) => {
  return (
    <button className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden">
      {innerText}
    </button>
  );
};

const ContactsSectionFormTextArea = ({
  inputTitle,
}: {
  inputTitle: string;
}) => {
  return (
    <label htmlFor="Notes">
      <span className="text-md text-gray-700 font-bold capitalize">
        {" "}
        {`${inputTitle} :`}{" "}
      </span>

      <textarea
        id="Notes"
        className="w-full resize-none rounded border-gray-300 shadow-sm shadow-gray-400 sm:text-sm px-2 py-2 mt-1"
        rows={4}
      ></textarea>
    </label>
  );
};

const ContactsSectionFormRegularInput = ({
  inputType,
  inputTitle,
}: {
  inputType: string;
  inputTitle: string;
}) => {
  return (
    <label htmlFor="Email">
      <span className="text-md text-gray-700 font-bold capitalize">
        {" "}
        {`${inputTitle} :`}{" "}
      </span>

      <input
        type={inputType}
        id="Email"
        className="w-full rounded border-gray-300 shadow-sm sm:text-sm shadow-gray-400 py-2 pl-2 mt-1"
      />
    </label>
  );
};

const ContactsSectionForm = ({ children }) => {
  return (
    <form
      action="#"
      className="flex flex-col items-start justify-start gap-y-8 mt-10"
    >
      {children}
      <ContactsSectionButton innerText="Отправить " />
    </form>
  );
};

const ContactsSectionMapFrame = ({ src }: { src: string }) => {
  return (
    <div className="relative w-full pb-[75%] mt-5">
      {/* <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13669.621941924257!2d24.79189865039252!3d59.429964108740904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692eb54f4edfe43%3A0x206e6dcbdf41435e!2s%C3%9Clemiste%20Centre!5e0!3m2!1sen!2see!4v1748823182825!5m2!1sen!2see"
        className="absolute top-0 left-0 w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ülemiste Centre map"
      /> */}
      <iframe
        src={src}
        width="100%"
        height="450"
        className="absolute top-0 left-0 w-full h-full border-0"
        title="Aboba"
      ></iframe>
    </div>
  );
};

const ContactsSectionEmail = ({ innerText }: { innerText: string }) => {
  return (
    <p>
      E-mail:{" "}
      <a
        href="/"
        className="transition-colors text-indigo-600 hover:text-indigo-800 underline"
      >
        {innerText}
      </a>
    </p>
  );
};

const ContactsSectionPlainText = ({ innerText }: { innerText: string }) => {
  return <p className="text-gray-700">{innerText}</p>;
};

const ContactsSectionSubHeader = ({
  innerText,
  withMargin,
}: {
  innerText: string;
  withMargin?: boolean;
}) => {
  return (
    <p
      className={`text-lg text-gray-700 font-bold ${withMargin ? "mt-4" : ""}`}
    >
      {innerText}
    </p>
  );
};

const ContactsSectionHeader = ({ innerText }: { innerText: string }) => {
  return (
    <p className="text-2xl font-semibold text-gray-900 sm:text-3xl">
      {innerText}
    </p>
  );
};

const ContactsSectionTeamMember = ({
  name,
  position,
  tel,
  email,
  languages,
}: {
  name: string;
  position: string;
  tel: string;
  email: string;
  languages: string;
}) => {
  //Get languages familiar to team member
  const spokenLanguages = Object.entries(JSON.parse(languages))
    .filter((item) => item[1] === true)
    .map((item) => item[0]);

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

  return (
    <div className="w-full rounded-md border border-gray-300 p-4 shadow-sm shadow-gray-400 sm:p-6 mt-7">
      <ContactsSectionSubHeader innerText={name} />
      <div className="w-full flex justify-start items-center gap-x-2 py-0.5">
        {spokenLanguages &&
          spokenLanguages.length &&
          spokenLanguages.map((item) =>
            item === "est" ? (
              <span
                key={`${name}-${position}-${item}`}
                className="fi fi-ee"
              ></span>
            ) : item === "eng" ? (
              <span
                key={`${name}-${position}-${item}`}
                className="fi fi-gb-eng"
              ></span>
            ) : item === "nor" ? (
              <span
                key={`${name}-${position}-${item}`}
                className="fi fi-no"
              ></span>
            ) : item === "rus" ? (
              <span
                key={`${name}-${position}-${item}`}
                className="fi fi-ru"
              ></span>
            ) : (
              ""
            )
          )}
      </div>
      <ContactsSectionPlainText
        innerText={
          JSON.parse(position).content[
            currentLang === "en" ? "eng" : currentLang
          ]
        }
      />
      <ContactsSectionPlainText innerText={tel} />
      <ContactsSectionEmail innerText={email} />
    </div>
  );
};

const ContactsSection = ({ children }: { children: ReactNode }) => {
  return <div className="py-5">{children}</div>;
};

const Contacts = ({
  members,
  businessContactInfo,
}: {
  members: {
    name: string;
    tel: string;
    email: string;
    position: string;
    languages: string;
    _id: string;
  }[];
  businessContactInfo: {
    businessTitle: string;
    emailsArr: { value: string; id: string }[];
    phoneNumbersArr: { value: string; id: string }[];
    physicalAddressArr: { value: string; id: string }[];
    addressToDisplayInFrame: {
      country: string;
      city: string;
      street: string;
      houseNumber: string;
    };
  };
}) => {
  const {
    businessTitle,
    emailsArr,
    phoneNumbersArr,
    physicalAddressArr,
    addressToDisplayInFrame,
  } = businessContactInfo;

  const fullAddress = Object.values(addressToDisplayInFrame).join(", ");
  const encodedAddress = `https://maps.google.com/maps?q=${encodeURIComponent(
    fullAddress
  )}&t=&z=17&ie=UTF8&iwloc=&output=embed`;

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

  return (
    <section id="contacts">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-8">
          {/* Overall contacts */}
          <ContactsSection>
            <ContactsSectionHeader
              innerText={translations["contactData"][currentLang]}
            />
            {businessTitle && (
              <ContactsSectionSubHeader
                innerText={businessTitle}
                withMargin={true}
              />
            )}

            {/* Addresses */}
            {physicalAddressArr &&
              physicalAddressArr.length &&
              physicalAddressArr.map((item) => (
                <ContactsSectionPlainText
                  key={item.id}
                  innerText={item.value}
                />
              ))}

            {/* Phone numbers */}
            <ContactsSection>
              {phoneNumbersArr &&
                phoneNumbersArr.length &&
                phoneNumbersArr.map((item) => (
                  <ContactsSectionPlainText
                    key={item.id}
                    innerText={item.value}
                  />
                ))}
            </ContactsSection>

            {/* Emails */}
            <ContactsSection>
              {emailsArr &&
                emailsArr.length &&
                emailsArr.map((item) => (
                  <ContactsSectionEmail key={item.id} innerText={item.value} />
                ))}
            </ContactsSection>
          </ContactsSection>

          {/* Location */}
          <ContactsSection>
            <ContactsSectionHeader
              innerText={translations["location"][currentLang]}
            />
            <ContactsSectionMapFrame src={encodedAddress} />
          </ContactsSection>

          {/* Feedback */}
          {/* <ContactsSection>
            <ContactsSectionHeader innerText="Обратная связь" />
            <ContactsSectionForm>
              <ContactsSectionFormRegularInput
                inputType="text"
                inputTitle="name"
              />
              <ContactsSectionFormRegularInput
                inputType="email"
                inputTitle="email"
              />
              <ContactsSectionFormTextArea inputTitle="Ваше сообщение нам" />
            </ContactsSectionForm>
          </ContactsSection> */}
        </div>

        <ContactsSection>
          <ContactsSectionHeader
            innerText={translations["ourTeam"][currentLang]}
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-10 justify-items-center">
            {/* Team */}
            {members &&
              members.length &&
              members.map((item) => (
                <ContactsSectionTeamMember
                  key={item._id}
                  name={item.name}
                  position={item.position}
                  tel={item.tel}
                  email={item.email}
                  languages={item.languages}
                />
              ))}
          </div>
        </ContactsSection>
      </div>
    </section>
  );
};

export default Contacts;
