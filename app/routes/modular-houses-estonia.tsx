import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

const SITE_URL = "https://kuber.ee";

const supportedLangs = ["eng", "rus", "est", "nor"] as const;
type Lang = (typeof supportedLangs)[number];

// --- META ---

export const meta: MetaFunction<typeof loader> = ({ location }) => {
  const url = new URL(location.pathname + location.search, SITE_URL);
  const urlLangParam = url.searchParams.get("lang") ?? "eng";

  const lang: Lang = supportedLangs.includes(urlLangParam as Lang)
    ? (urlLangParam as Lang)
    : "eng";

  const titles: Record<Lang, string> = {
    eng: "Modular Houses in Estonia – Design, Prices & Turnkey Construction | Kuber",
    rus: "Модульные дома в Эстонии – проекты, цены и строительство под ключ | Kuber",
    est: "Moodulmajad Eestis – projektid, hinnad ja valmislahendused | Kuber",
    nor: "Modulhus i Estland – design, priser og nøkkelferdige løsninger | Kuber",
  };

  const descriptions: Record<Lang, string> = {
    eng: "Learn about modern modular houses in Estonia: design options, technology, pricing, and turnkey construction with Kuber.",
    rus: "Узнайте больше о современных модульных домах в Эстонии: варианты планировок, технологии, цены и строительство под ключ с Kuber.",
    est: "Tutvuge kaasaegsete moodulmajadega Eestis: planeeringud, tehnoloogia, hinnad ja valmislahendused koos Kuberiga.",
    nor: "Lær mer om moderne modulhus i Estland: planløsninger, teknologi, priser og nøkkelferdige løsninger med Kuber.",
  };

  const hreflangMap: Record<Lang, string> = {
    eng: "en",
    rus: "ru",
    est: "et",
    nor: "no",
  };

  // hreflang links for all languages
  const hreflangLinks = supportedLangs.map((code) => ({
    tagName: "link",
    rel: "alternate",
    hrefLang: hreflangMap[code],
    href: `${SITE_URL}/modular-houses-estonia?lang=${code}`,
  }));

  // x-default (main version)
  const xDefaultLink = {
    tagName: "link",
    rel: "alternate",
    hrefLang: "x-default",
    href: `${SITE_URL}/modular-houses-estonia?lang=eng`,
  };

  // Canonical for current language version
  const canonicalLink = {
    tagName: "link",
    rel: "canonical",
    href: `${SITE_URL}/modular-houses-estonia?lang=${lang}`,
  };

  return [
    { title: titles[lang] },
    { name: "description", content: descriptions[lang] },
    canonicalLink,
    ...hreflangLinks,
    xDefaultLink,
  ];
};

// --- LOADER ---

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const urlLangParam = url.searchParams.get("lang") ?? "eng";

  const lang: Lang = supportedLangs.includes(urlLangParam as Lang)
    ? (urlLangParam as Lang)
    : "eng";

  return json({ lang });
};

// --- TRANSLATED CONTENT ---

const content = {
  eng: {
    h1: "Modular Houses in Estonia",
    introSubtitle: "Modern modular homes for comfortable and efficient living.",
    introText:
      "Kuber designs and builds modern modular houses in Estonia – from compact family homes to spacious year-round residences. Our goal is to make the entire process clear, predictable, and comfortable for you.",
    sections: [
      {
        id: "why-modular",
        title: "Why Choose a Modular House in Estonia?",
        text: [
          "Modular houses are assembled from factory-made modules. This means cleaner construction, predictable deadlines, and stable quality.",
          "For the Estonian climate, modular homes are an excellent solution: energy-efficient walls, modern ventilation, and high-quality windows help reduce heating costs and keep the home comfortable all year round.",
        ],
      },
      {
        id: "technology",
        title: "Technology and Construction Quality",
        text: [
          "We use modern construction solutions that meet European standards. Each module is produced in controlled factory conditions, which minimises errors and weather risks.",
          "During the design phase, we take into account the specifics of your plot, wind load, insulation, and technical systems – so that your home is not only beautiful, but also durable and practical.",
        ],
      },
      {
        id: "prices",
        title: "Prices and Budget Planning",
        text: [
          "The final price of a modular house depends on the size, layout, finish level and selected technical solutions. We help you plan your budget transparently: from the base package to additional options.",
          "Contact us and we will prepare a preliminary offer based on your needs – without hidden costs.",
        ],
      },
      {
        id: "process",
        title: "How the Process Works with Kuber",
        text: [
          "1. Initial consultation – we clarify your needs, preferred size, layout and budget.",
          "2. Concept and offer – we propose suitable modular solutions and explain what is included in the price.",
          "3. Detailed project – we fix materials, technical solutions and schedule.",
          "4. Production and installation – modules are manufactured in the factory and installed on site in a short time.",
          "5. Handover – you receive a finished modular house, ready for move-in or final interior works, depending on the chosen package.",
        ],
      },
      {
        id: "kuber",
        title: "Why Kuber?",
        text: [
          "We combine modern design with practical solutions that suit the Estonian climate. Our projects are not just beautiful on pictures – they are comfortable to live in every day.",
          "We work transparently, keep you informed at every stage and help make decisions that are right for you in the long term.",
        ],
      },
    ],
    ctaTitle: "Want to Discuss Your Future Modular Home?",
    ctaText:
      "Send us a message or call – we will answer your questions, suggest options and help you take the next step towards your modular house in Estonia.",
    ctaButton: "View Projects",
    ctaButtonHref: "/?lang=eng#projects",
  },
  rus: {
    h1: "Модульные дома в Эстонии",
    introSubtitle:
      "Современные модульные дома для комфортной и экономичной жизни.",
    introText:
      "Kuber проектирует и строит современные модульные дома в Эстонии – от компактных семейных домов до просторных домов для постоянного проживания. Наша цель – сделать весь процесс понятным, предсказуемым и комфортным для вас.",
    sections: [
      {
        id: "why-modular",
        title: "Почему стоит выбрать модульный дом в Эстонии?",
        text: [
          "Модульные дома собираются из изготовленных на заводе модулей. Это значит более чистый процесс строительства, понятные сроки и стабильное качество.",
          "Для климатических условий Эстонии модульные дома – отличное решение: энергоэффективные стены, современная вентиляция и качественные окна помогают снизить расходы на отопление и поддерживать комфорт в доме круглый год.",
        ],
      },
      {
        id: "technology",
        title: "Технология и качество строительства",
        text: [
          "Мы используем современные строительные решения, соответствующие европейским стандартам. Каждый модуль изготавливается в контролируемых условиях на производстве, что минимизирует ошибки и погодные риски.",
          "На этапе проектирования мы учитываем особенности вашего участка, ветровые нагрузки, утепление и инженерные системы – чтобы дом был не только красивым, но и долговечным и практичным.",
        ],
      },
      {
        id: "prices",
        title: "Цены и планирование бюджета",
        text: [
          "Итоговая стоимость модульного дома зависит от площади, планировки, уровня отделки и выбранных технических решений. Мы помогаем прозрачно спланировать бюджет – от базового пакета до дополнительных опций.",
          "Свяжитесь с нами, и мы подготовим предварительное предложение, исходя из ваших потребностей, без скрытых расходов.",
        ],
      },
      {
        id: "process",
        title: "Как проходит процесс с Kuber",
        text: [
          "1. Первая консультация – уточняем ваши пожелания, размеры, планировку и бюджет.",
          "2. Концепция и предложение – подбираем подходящие модульные решения и подробно объясняем, что входит в стоимость.",
          "3. Детальный проект – фиксируем материалы, инженерные решения и сроки.",
          "4. Производство и монтаж – модули изготавливаются на заводе и устанавливаются на участке в короткие сроки.",
          "5. Передача дома – вы получаете готовый модульный дом, пригодный для заселения или финальных внутренних работ в зависимости от выбранного пакета.",
        ],
      },
      {
        id: "kuber",
        title: "Почему Kuber?",
        text: [
          "Мы совмещаем современный дизайн с практичными решениями, подходящими для климата Эстонии. Наши дома удобны не только на визуализациях, но и в повседневной жизни.",
          "Мы работаем прозрачно, держим вас в курсе на каждом этапе и помогаем принимать решения, которые будут выгодны в долгосрочной перспективе.",
        ],
      },
    ],
    ctaTitle: "Хотите обсудить ваш будущий модульный дом?",
    ctaText:
      "Напишите нам или позвоните – мы ответим на вопросы, предложим варианты и поможем сделать следующий шаг к вашему модульному дому в Эстонии.",
    ctaButton: "Посмотреть проекты",
    ctaButtonHref: "/?lang=rus#projects",
  },
  est: {
    h1: "Moodulmajad Eestis",
    introSubtitle: "Kaasaegsed moodulmajad mugavaks ja energiatõhusaks eluks.",
    introText:
      "Kuber projekteerib ja ehitab kaasaegseid moodulmaju üle Eesti – alates kompaktsetest peremajadest kuni avarate aastaringseks elamiseks mõeldud hooneteni. Meie eesmärk on muuta kogu protsess teie jaoks selgeks, läbipaistvaks ja mugavaks.",
    sections: [
      {
        id: "why-modular",
        title: "Miks valida moodulmaja Eestis?",
        text: [
          "Moodulmajad pannakse kokku tehases valmistatud moodulitest. See tähendab puhtamat ehitust, kindlaid tähtaegu ja ühtlast kvaliteeti.",
          "Eesti kliima jaoks on moodulmajad väga hea lahendus: energiatõhusad konstruktsioonid, tänapäevased tehnosüsteemid ja kvaliteetsed aknad aitavad vähendada küttekulusid ja hoida kodu mugavana aastaringselt.",
        ],
      },
      {
        id: "technology",
        title: "Tehnoloogia ja ehituskvaliteet",
        text: [
          "Kasutame kaasaegseid lahendusi, mis vastavad Euroopa standarditele. Iga moodul valmib kontrollitud tootmistingimustes, mis vähendab vigade ja ilmastikuriskide hulka.",
          "Projekteerimisel arvestame teie krundi eripärasid, tuulekoormusi, soojustust ja tehnosüsteeme – et valmiv maja oleks sama praktiline kui ilus.",
        ],
      },
      {
        id: "prices",
        title: "Hinnad ja eelarve planeerimine",
        text: [
          "Moodulmaja lõplik hind sõltub suurusest, planeeringust, viimistlusest ja tehnilistest lahendustest. Aitame teil eelarve ausalt ja arusaadavalt läbi mõelda – alates baaslahendusest kuni lisavõimalusteni.",
          "Võtke meiega ühendust ja me koostame esialgse pakkumise vastavalt teie soovidele, ilma varjatud kuludeta.",
        ],
      },
      {
        id: "process",
        title: "Kuidas protsess Kuberiga välja näeb?",
        text: [
          "1. Esmane konsultatsioon – selgitame välja teie soovid, suuruse, planeeringu ja eelarve.",
          "2. Kontseptsioon ja pakkumine – pakume sobivaid moodullahendusi ja selgitame detailselt, mis on hinna sees.",
          "3. Detailne projekt – fikseerime materjalid, tehnilised süsteemid ja ajakava.",
          "4. Tootmine ja paigaldus – moodulid valmivad tehases ning paigaldatakse krundile lühikese ajaga.",
          "5. Üleandmine – saate valmis moodulmaja, mis on vastavalt valitud paketile kas kohe sissekolimiseks või lõppviimistluseks valmis.",
        ],
      },
      {
        id: "kuber",
        title: "Miks valida Kuber?",
        text: [
          "Ühendame kaasaegse arhitektuuri praktiliste lahendustega, mis sobivad Eesti kliimasse. Meie majad on mõeldud selleks, et neis oleks mugav elada iga päev.",
          "Hoiame suhtluse selge, anname infot igal etapil ja aitame teha otsuseid, mis on teile kasulikud ka pikemas plaanis.",
        ],
      },
    ],
    ctaTitle: "Soovid arutada oma tulevast moodulmaja?",
    ctaText:
      "Kirjuta meile või helista – vastame küsimustele, pakume lahendusi ja aitame teha järgmise sammu sinu moodulmaja suunas.",
    ctaButton: "Vaata projekte",
    ctaButtonHref: "/?lang=est#projects",
  },
  nor: {
    h1: "Modulhus i Estland",
    introSubtitle:
      "Moderne modulhus for komfortabel og energieffektiv bolig i Estland.",
    introText:
      "Kuber prosjekterer og bygger moderne modulhus i Estland – fra kompakte familiehus til romslige helårsboliger. Målet vårt er å gjøre prosessen tydelig, forutsigbar og behagelig for deg.",
    sections: [
      {
        id: "why-modular",
        title: "Hvorfor velge modulhus i Estland?",
        text: [
          "Modulhus settes sammen av fabrikkproduserte moduler. Det betyr renere byggeplass, forutsigbare tidsrammer og jevn kvalitet.",
          "For klimaet i Estland er modulhus en svært god løsning: energieffektive konstruksjoner, moderne tekniske systemer og gode vinduer reduserer oppvarmingskostnader og gir et behagelig innemiljø året rundt.",
        ],
      },
      {
        id: "technology",
        title: "Teknologi og byggekvalitet",
        text: [
          "Vi bruker moderne løsninger som oppfyller europeiske standarder. Hver modul produseres under kontrollerte forhold, noe som minimerer feil og værrelaterte risikoer.",
          "I prosjekteringsfasen tar vi hensyn til tomtens forhold, vindbelastning, isolasjon og tekniske installasjoner – slik at huset blir like praktisk som det er pent.",
        ],
      },
      {
        id: "prices",
        title: "Priser og budsjettering",
        text: [
          "Den endelige prisen på et modulhus avhenger av størrelse, planløsning, standard og tekniske løsninger. Vi hjelper deg å planlegge budsjettet åpent og tydelig – fra grunnpakke til tilvalg.",
          "Ta kontakt, så lager vi et foreløpig tilbud basert på dine behov – uten skjulte kostnader.",
        ],
      },
      {
        id: "process",
        title: "Hvordan er prosessen med Kuber?",
        text: [
          "1. Første samtale – vi avklarer ønsker, størrelse, planløsning og budsjett.",
          "2. Konsept og tilbud – vi foreslår passende modulhusløsninger og forklarer hva som er inkludert i prisen.",
          "3. Detaljert prosjekt – vi fastsetter materialer, tekniske løsninger og fremdriftsplan.",
          "4. Produksjon og montering – modulene produseres på fabrikk og monteres på tomten i løpet av kort tid.",
          "5. Overlevering – du får et ferdig modulhus, klart til innflytting eller siste innvendige arbeider avhengig av valgt pakke.",
        ],
      },
      {
        id: "kuber",
        title: "Hvorfor Kuber?",
        text: [
          "Vi kombinerer moderne design med praktiske løsninger tilpasset klimaet i Estland. Husene våre er laget for å være gode å bo i – ikke bare fine på bilder.",
          "Vi er åpne i kommunikasjonen, holder deg oppdatert i alle faser og hjelper deg å ta valg som er riktige på lang sikt.",
        ],
      },
    ],
    ctaTitle: "Vil du snakke om ditt fremtidige modulhus?",
    ctaText:
      "Ta kontakt på e-post eller telefon – vi svarer på spørsmål, foreslår løsninger og hjelper deg videre mot et modulhus i Estland.",
    ctaButton: "Se prosjekter",
    ctaButtonHref: "/?lang=nor#projects",
  },
} satisfies Record<Lang, any>;

// --- COMPONENT ---

export default function ModularHousesEstoniaPage() {
  const { lang } = useLoaderData<typeof loader>();
  const t = content[lang];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 space-y-12 md:px-24">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Kuber · {lang === "eng" && "Modular Houses in Estonia"}
          {lang === "rus" && "Модульные дома в Эстонии"}
          {lang === "est" && "Moodulmajad Eestis"}
          {lang === "nor" && "Modulhus i Estland"}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold">{t.h1}</h1>
        <p className="text-lg text-gray-700">{t.introSubtitle}</p>
        <p className="text-gray-700">{t.introText}</p>
      </section>

      <section className="space-y-10">
        {t.sections.map((section: any) => (
          <article key={section.id} className="space-y-3">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            {section.text.map((paragraph: string, idx: number) => (
              <p key={idx} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </section>

      <section className="border border-gray-200 rounded-xl p-6 md:p-8 space-y-4 bg-gray-50">
        <h2 className="text-2xl font-semibold">{t.ctaTitle}</h2>
        <p className="text-gray-700">{t.ctaText}</p>
        <div>
          <Link
            to={t.ctaButtonHref}
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium border border-black hover:bg-black hover:text-white transition-colors"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
