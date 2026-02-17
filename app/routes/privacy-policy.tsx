import { MoveLeft } from "lucide-react";
import { NavLink, useLocation, useSearchParams } from "@remix-run/react";

import HomeLayout from "~/layouts/HomeLayout";
import { useEffect } from "react";

const interfaceTranslations = {
  back: {
    eng: "Back",
    rus: "Назад",
    est: "Tagasi",
    nor: "Gå tilbake",
  },

  privacyPolicy: {
    eng: "Privacy Policy",
    rus: "Политика конфиденциальности",
    est: "Privaatsuspoliitika",
    nor: "Personvernerklæring og personvernpolicy",
  },
};
const translations = [
  {
    title: {
      eng: "1. General Information",
      rus: "1. Общая информация",
      est: "1. Üldine teave",
      nor: "1. Generell informasjon",
    },
    content: {
      eng: "This website respects your privacy and processes personal data in accordance with applicable data protection legislation, including the General Data Protection Regulation (GDPR). By submitting a form on this website, you agree to the processing of your personal data in accordance with the terms outlined below.",
      rus: "Данный веб-сайт уважает вашу конфиденциальность и обрабатывает персональные данные в соответствии с применимым законодательством о защите данных, включая Общий регламент по защите данных (GDPR). Отправляя форму на этом сайте, вы соглашаетесь с обработкой ваших персональных данных в соответствии с условиями, изложенными ниже.",
      est: "Käesolev veebisait austab teie privaatsust ja töötleb isikuandmeid vastavalt kehtivatele andmekaitsealastele õigusaktidele, sealhulgas isikuandmete kaitse üldmäärusele (GDPR). Vormide esitamisega sellel veebisaidil nõustute oma isikuandmete töötlemisega allpool kirjeldatud tingimustel.",
      nor: "Dette nettstedet respekterer ditt personvern og behandler personopplysninger i samsvar med gjeldende personvernlovgivning, inkludert personvernforordningen (GDPR). Ved å sende inn et skjema på dette nettstedet samtykker du til behandling av dine personopplysninger i henhold til vilkårene beskrevet nedenfor.",
    },
  },
  {
    title: {
      eng: "2. What Data We Collect",
      rus: "2. Какие данные мы собираем",
      est: "2. Milliseid andmeid me kogume",
      nor: "2. Hvilke opplysninger vi samler inn",
    },
    content: {
      eng: "When submitting forms on the website, we may collect the following personal data:\n\n• Email address (required)\n• Phone number (optional, at the user's discretion)\n• Message content (if applicable)\n\nWe do not collect sensitive personal data.",
      rus: "При отправке формы на сайте мы можем собирать следующие персональные данные:\n\n• Адрес электронной почты (обязательно)\n• Номер телефона (необязательно, по желанию пользователя)\n• Содержание сообщения (если применимо)\n\nМы не собираем чувствительные персональные данные.",
      est: "Veebisaidi vormide esitamisel võime koguda järgmisi isikuandmeid:\n\n• E-posti aadress (kohustuslik)\n• Telefoninumber (valikuline, kasutaja soovil)\n• Sõnumi sisu (vajaduse korral)\n\nMe ei kogu tundlikke isikuandmeid.",
      nor: "Ved innsending av skjema på nettstedet kan vi samle inn følgende personopplysninger:\n\n• E-postadresse (obligatorisk)\n• Telefonnummer (valgfritt, etter brukerens ønske)\n• Meldingsinnhold (hvis aktuelt)\n\nVi samler ikke inn sensitive personopplysninger.",
    },
  },
  {
    title: {
      eng: "3. Purpose of Data Processing",
      rus: "3. Цели обработки данных",
      est: "3. Andmete töötlemise eesmärk",
      nor: "3. Formål med behandling av data",
    },
    content: {
      eng: "Personal data is processed solely for the following purposes:\n\n• To contact you regarding your inquiry\n• To provide information about requested services\n• To respond to your message\n\nYour data is not used for marketing, newsletters, or automated profiling.",
      rus: "Персональные данные обрабатываются исключительно для следующих целей:\n\n• Связь с вами по поводу вашего запроса\n• Предоставление информации о запрошенных услугах\n• Ответ на ваше сообщение\n\nВаши данные не используются для маркетинга, рассылок или автоматизированного профилирования.",
      est: "Isikuandmeid töödeldakse üksnes järgmistel eesmärkidel:\n\n• Teiega ühenduse võtmiseks seoses teie päringuga\n• Teabe edastamiseks soovitud teenuste kohta\n• Teie sõnumile vastamiseks\n\nTeie andmeid ei kasutata turunduseks, uudiskirjadeks ega automatiseeritud profiilianalüüsiks.",
      nor: "Personopplysninger behandles utelukkende for følgende formål:\n\n• Å kontakte deg angående din forespørsel\n• Å gi informasjon om etterspurte tjenester\n• Å svare på din melding\n\nDine opplysninger brukes ikke til markedsføring, nyhetsbrev eller automatisert profilering.",
    },
  },
  {
    title: {
      eng: "4. Legal Basis for Processing",
      rus: "4. Правовое основание обработки",
      est: "4. Andmete töötlemise õiguslik alus",
      nor: "4. Rettslig grunnlag for behandling",
    },
    content: {
      eng: "The processing of personal data is based on:\n\n• Your consent expressed through voluntary submission of the form\n• Legitimate interest – to respond to your inquiry\n\nYou may withdraw your consent at any time by contacting us.",
      rus: "Обработка персональных данных осуществляется на основании:\n\n• Вашего согласия, выраженного добровольной отправкой формы\n• Законного интереса — для ответа на ваш запрос\n\nВы можете отозвать свое согласие в любое время, связавшись с нами.",
      est: "Isikuandmete töötlemine toimub järgmistel alustel:\n\n• Teie nõusolek, mis on antud vabatahtlikult vormi esitamisega\n• Õigustatud huvi – teie päringule vastamiseks\n\nTeil on õigus oma nõusolek igal ajal tagasi võtta, võttes meiega ühendust.",
      nor: "Behandlingen av personopplysninger skjer på grunnlag av:\n\n• Ditt samtykke gitt ved frivillig innsending av skjema\n• Berettiget interesse – for å besvare din forespørsel\n\nDu kan når som helst trekke tilbake ditt samtykke ved å kontakte oss.",
    },
  },
  {
    title: {
      eng: "5. Data Storage and Security",
      rus: "5. Хранение и защита данных",
      est: "5. Andmete säilitamine ja turvalisus",
      nor: "5. Lagring og sikkerhet av data",
    },
    content: {
      eng: "Personal data is stored in a secure environment, and appropriate measures are taken to prevent unauthorized access.\n\nData may be stored and processed using third-party infrastructure services (for example, MongoDB Atlas) located within or outside the European Union, in compliance with GDPR requirements.\n\nWe do not sell or transfer your personal data to third parties, except where required by law.",
      rus: "Персональные данные хранятся в защищенной среде и принимаются меры для предотвращения несанкционированного доступа.\n\nДанные могут храниться и обрабатываться с использованием сторонних инфраструктурных сервисов (например, MongoDB Atlas), расположенных в пределах или за пределами Европейского Союза, при соблюдении требований GDPR.\n\nМы не продаем и не передаем ваши данные третьим лицам, за исключением случаев, предусмотренных законом.",
      est: "Isikuandmeid hoitakse turvalises keskkonnas ning rakendatakse meetmeid volitamata juurdepääsu vältimiseks.\n\nAndmeid võidakse säilitada ja töödelda kolmandate osapoolte infrastruktuuriteenuste abil (näiteks MongoDB Atlas), mis võivad asuda Euroopa Liidus või väljaspool seda, järgides GDPR-i nõudeid.\n\nMe ei müü ega edasta teie isikuandmeid kolmandatele isikutele, välja arvatud seadusest tulenevatel juhtudel.",
      nor: "Personopplysninger lagres i et sikkert miljø, og det iverksettes tiltak for å forhindre uautorisert tilgang.\n\nOpplysninger kan lagres og behandles ved bruk av tredjeparts infrastrukturtjenester (for eksempel MongoDB Atlas) som kan være lokalisert innenfor eller utenfor Den europeiske union, i samsvar med GDPR-kravene.\n\nVi selger eller overfører ikke dine personopplysninger til tredjeparter, med mindre dette er påkrevd ved lov.",
    },
  },

  {
    title: {
      eng: "6. Data Retention Period",
      rus: "6. Срок хранения данных",
      est: "6. Andmete säilitamise aeg",
      nor: "6. Lagringsperiode",
    },
    content: {
      eng: "Personal data is stored only for as long as necessary to fulfill the purposes for which it was collected, or in accordance with legal obligations.",
      rus: "Персональные данные хранятся только в течение времени, необходимого для достижения целей, для которых они были собраны, либо в соответствии с требованиями законодательства.",
      est: "Isikuandmeid säilitatakse ainult seni, kuni see on vajalik nende kogumise eesmärkide täitmiseks või vastavalt seadusest tulenevatele nõuetele.",
      nor: "Personopplysninger oppbevares kun så lenge det er nødvendig for å oppfylle formålene de ble samlet inn for, eller i henhold til lovpålagte krav.",
    },
  },

  {
    title: {
      eng: "7. User Rights",
      rus: "7. Права пользователя",
      est: "7. Kasutaja õigused",
      nor: "7. Brukerens rettigheter",
    },
    content: {
      eng: "You have the right to:\n\n• Request access to your personal data\n• Request correction or deletion of data\n• Withdraw your consent at any time\n• Restrict the processing of data\n\nTo exercise these rights, you may contact us using the contact information provided on the website.",
      rus: "Вы имеете право:\n\n• Запросить доступ к вашим персональным данным\n• Запросить исправление или удаление данных\n• Отозвать свое согласие в любое время\n• Ограничить обработку данных\n\nДля реализации этих прав вы можете связаться с нами, используя контактные данные, указанные на сайте.",
      est: "Teil on õigus:\n\n• Taotleda juurdepääsu oma isikuandmetele\n• Nõuda andmete parandamist või kustutamist\n• Võtta oma nõusolek igal ajal tagasi\n• Piirata andmete töötlemist\n\nNende õiguste kasutamiseks võtke meiega ühendust veebisaidil toodud kontaktandmete kaudu.",
      nor: "Du har rett til å:\n\n• Be om innsyn i dine personopplysninger\n• Be om retting eller sletting av opplysninger\n• Trekke tilbake ditt samtykke når som helst\n• Begrense behandlingen av opplysninger\n\nFor å utøve disse rettighetene kan du kontakte oss via kontaktinformasjonen oppgitt på nettstedet.",
    },
  },

  {
    title: {
      eng: "8. Contact Information",
      rus: "8. Контактная информация",
      est: "8. Kontaktandmed",
      nor: "8. Kontaktinformasjon",
    },
    content: {
      eng: "If you have any questions regarding this Privacy Policy or the processing of your personal data, please contact us using the contact information provided on the website.",
      rus: "Если у вас есть вопросы относительно данной Политики конфиденциальности или обработки ваших данных, пожалуйста, свяжитесь с нами через контактную информацию, размещенную на сайте.",
      est: "Kui teil on küsimusi käesoleva privaatsuspoliitika või teie isikuandmete töötlemise kohta, võtke meiega ühendust veebisaidil toodud kontaktandmete kaudu.",
      nor: "Hvis du har spørsmål om denne personvernerklæringen eller behandlingen av dine personopplysninger, vennligst kontakt oss via kontaktinformasjonen oppgitt på nettstedet.",
    },
  },

  {
    title: {
      eng: "9. Changes to the Policy",
      rus: "9. Изменения в Политике",
      est: "9. Privaatsuspoliitika muudatused",
      nor: "9. Endringer i erklæringen",
    },
    content: {
      eng: "This Privacy Policy may be updated from time to time. All changes will be published on this page.",
      rus: "Настоящая Политика конфиденциальности может обновляться. Все изменения будут публиковаться на данной странице.",
      est: "Käesolevat privaatsuspoliitikat võidakse aeg-ajalt uuendada. Kõik muudatused avaldatakse sellel lehel.",
      nor: "Denne personvernerklæringen kan bli oppdatert fra tid til annen. Alle endringer vil bli publisert på denne siden.",
    },
  },

  {
    content: {
      eng: "By submitting the form, you agree to the processing of your personal data in accordance with the Privacy Policy.",
      rus: "Отправляя форму, вы соглашаетесь с обработкой ваших персональных данных в соответствии с Политикой конфиденциальности.",
      est: "Vormi esitamisega nõustute oma isikuandmete töötlemisega vastavalt privaatsuspoliitikale.",
      nor: "Ved å sende inn skjemaet samtykker du til behandling av dine personopplysninger i samsvar med personvernerklæringen.",
    },
  },
];

const PrivacyPolicy = () => {
  //Get language from params
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const langFromParams = searchParams.get("lang");
  const safeLang = langFromParams ? langFromParams : "est";
  const lang = safeLang === "en" ? "eng" : safeLang;

  //Enable overflow (For some reason set to hidden)
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  console.log(location.state.returnTo);

  return (
    <HomeLayout>
      <div className="flex-1 py-5 px-5">
        {/* Nav back button */}
        <NavLink
          className="flex w-6/12 md:w-2/12 lg:w-1/12 justify-start items-center gap-x-2 cursor-pointer btn btn-primary"
          to={{
            pathname: location.state?.returnTo || "/",
            search: searchParams.toString(),
          }}
        >
          <MoveLeft />
          {interfaceTranslations.back[lang]}
        </NavLink>

        {/* Content */}
        <h1 className="font-bold text-2xl mt-10">
          {interfaceTranslations.privacyPolicy[lang]}
        </h1>
        {translations.map((item, i) => (
          <div key={i} className="mt-10">
            {item.title ? (
              <h2 className="font-bold text-xl">{item.title[lang]}</h2>
            ) : null}
            <p className="mt-2 whitespace-pre-wrap">{item.content[lang]}</p>
          </div>
        ))}
      </div>
    </HomeLayout>
  );
};

export default PrivacyPolicy;
