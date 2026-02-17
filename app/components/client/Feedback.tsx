import { NavLink, useSearchParams, useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

import useBetterModalStore from "~/stores/BetterModalStore";

const translations = {
  email: {
    eng: "Email Address",
    rus: "Адрес электронной почты",
    est: "E-posti aadress",
    nor: "E-postadresse",
  },
  typeHere: {
    eng: "Enter your text here...",
    rus: "Введите текст здесь...",
    est: "Sisestage tekst siia...",
    nor: "Skriv inn tekst her...",
  },
  message: {
    eng: "Message",
    rus: "Сообщение",
    est: "Sõnum",
    nor: "Melding",
  },
  consentEmailProcessing: {
    eng: "I agree to the processing of my email address in accordance with",
    rus: "Я согласен(на) с обработкой моей электронной почты в соответствии с",
    est: "Nõustun oma e-posti aadressi töötlemisega vastavalt",
    nor: "Jeg samtykker til behandling av min e-postadresse i samsvar med",
  },
  privacyPolicy: {
    eng: "Privacy Policy",
    rus: "Политика конфиденциальности",
    est: "Privaatsuspoliitika",
    nor: "Personvernerklæring",
  },
  privacyPolicyInstrumental: {
    eng: "the Privacy Policy",
    rus: "Политикой конфиденциальности",
    est: "privaatsuspoliitikaga",
    nor: "personvernerklæringen",
  },
  sendMessage: {
    eng: "Submit Message",
    rus: "Отправить сообщение",
    est: "Esita sõnum",
    nor: "Send inn melding",
  },
  weValueYourOpinion: {
    eng: "We value your opinion.",
    rus: "Мы ценим ваше мнение.",
    est: "Hindame teie arvamust.",
    nor: "Vi setter pris på din mening.",
  },
  feedbackInvitation: {
    eng: "If you have feedback about our modular houses, website, or overall experience, please share it with us.",
    rus: "Если у вас есть отзывы о наших модульных домах, веб-сайте или общем опыте взаимодействия, пожалуйста, поделитесь ими с нами.",
    est: "Kui teil on tagasisidet meie moodulmajade, veebisaidi või üldise kogemuse kohta, palun jagage seda meiega.",
    nor: "Hvis du har tilbakemeldinger om våre modulhus, nettsiden eller din generelle opplevelse, vennligst del det med oss.",
  },
  thanksForFeedback: {
    eng: "Thank you for your feedback!",
    rus: "Благодарим вас за ваш отзыв!",
    est: "Täname teid teie tagasiside eest!",
    nor: "Takk for din tilbakemelding!",
  },
  close: {
    eng: "Close",
    rus: "Закрыть",
    est: "Sulge",
    nor: "Lukk",
  },
  errorMessage: {
    eng: "An error occurred. Please try again later or contact us directly.",
    rus: "Произошла ошибка. Пожалуйста, попробуйте снова позже или свяжитесь с нами напрямую.",
    est: "Ilmnes viga. Palun proovige hiljem uuesti või võtke meiega otse ühendust.",
    nor: "Det oppstod en feil. Vennligst prøv igjen senere eller kontakt oss direkte.",
  },
};

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const { Form, state, data } = useFetcher<{
    success: boolean;
    errors?: Record<string, boolean>;
    responseId: number;
  }>();
  const currentResponseId = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const setOpen = useBetterModalStore((state) => state.setOpen);
  const setInnerContent = useBetterModalStore((state) => state.setInnerContent);

  //Get lang
  const langFromParams = searchParams.get("lang");
  const safeLang = langFromParams ? langFromParams : "est";
  const lang = safeLang === "en" ? "eng" : safeLang;

  useEffect(() => {
    if (data) {
      //Handle success
      if (data.success) {
        if (data.responseId !== currentResponseId.current) {
          currentResponseId.current = data.responseId;

          //Show modal
          setInnerContent(
            <div className="w-full p-4 flex flex-col items-center justify-start">
              <p className="text-xl text-center">
                {translations.thanksForFeedback[lang]}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 mt-5"
              >
                {translations.close[lang]}
              </button>
            </div>,
          );
          setOpen(true);
        }
      } else {
        //Handle error
        if (data.responseId !== currentResponseId.current) {
          currentResponseId.current = data.responseId;

          //Show modal
          setInnerContent(
            <div className="w-full p-4 flex flex-col items-center justify-start">
              <p className="text-xl text-center">
                {translations.errorMessage[lang]}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="inline-block rounded-sm border border-indigo-600 bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 mt-5"
              >
                {translations.close[lang]}
              </button>
            </div>,
          );
          setOpen(true);
        }
      }

      //Clear form
      formRef.current?.reset();
    }
  }, [data, state]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="md:py-4">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {translations.weValueYourOpinion[lang]}
          </h2>

          <p className="mt-4 text-pretty text-gray-700">
            {translations.feedbackInvitation[lang]}
          </p>
        </div>

        <Form
          ref={formRef}
          action="/handle-feedback-message"
          method="POST"
          className="space-y-4 rounded-lg border border-gray-300 bg-gray-100 p-6"
        >
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium text-gray-900"
              htmlFor="email"
            >
              {translations.email[lang]}
            </label>

            <input
              className="mt-1 w-full rounded-lg border p-4 border-gray-300 focus:border-indigo-500 focus:outline-none"
              id="email"
              type="email"
              placeholder={translations.typeHere[lang]}
              required
              name="email"
            />
          </div>

          {/* Msg content */}
          <div>
            <label
              className="block text-sm font-medium text-gray-900"
              htmlFor="message"
            >
              {translations.message[lang]}
            </label>

            <textarea
              className="mt-1 w-full resize-none border p-4 rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none"
              id="message"
              rows={4}
              placeholder={translations.typeHere[lang]}
              required
              name="messageContent"
            ></textarea>
          </div>

          <input type="hidden" name="date" value={Date.now()} />
          <input type="text" name="website" id="website" className="hidden" />

          {/* Privacy agreement */}
          <div className="flex justify-start gap-x-3">
            {" "}
            <input
              type="checkbox"
              className="my-0.5 size-5 rounded border-gray-300 shadow-sm"
              name="privacyAgreement"
              required
            />
            <div>
              <span className="font-medium text-gray-700">
                {" "}
                {translations.privacyPolicy[lang]}
              </span>

              <p className="mt-0.5 text-sm text-gray-700">
                {translations.consentEmailProcessing[lang]}
                <NavLink
                  to={{
                    pathname: "/privacy-policy",
                    search: searchParams.toString(),
                  }}
                  state={{ returnTo: "/" }}
                  className="font-bold text-blue-600 underline ml-1"
                >
                  {translations.privacyPolicyInstrumental[lang]}
                </NavLink>
              </p>
            </div>
          </div>

          <button
            className="block w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600"
            type="submit"
            disabled={state !== "idle"}
          >
            {translations.sendMessage[lang]}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default Feedback;
