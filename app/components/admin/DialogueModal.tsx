/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useParams } from "@remix-run/react";

import useAdminDialogueModalStore from "~/stores/AdminDialogueModalStore";

const translations = {
  yes: {
    eng: "Yes",
    rus: "Да",
    est: "Jah",
    nor: "Ja",
  },
  cancel: {
    eng: "Cancel",
    rus: "Отмена",
    est: "Tühista",
    nor: "Avbryt",
  },
};

const DialogueModal = () => {
  //Languages
  type SupportedLanguages = "eng" | "rus" | "est" | "nor";
  const { lang } = useParams<{ lang: SupportedLanguages }>();

  const isModalOpen = useAdminDialogueModalStore((state) => state.isModalOpen);
  const closeModal = useAdminDialogueModalStore((state) => state.closeModal);
  const modalTitleContent = useAdminDialogueModalStore(
    (state) => state.modalTitleContent
  );
  const modalDescriptionContent = useAdminDialogueModalStore(
    (state) => state.modalDescriptionContent
  );
  const callback = useAdminDialogueModalStore((state) => state.callback);
  const setCallback = useAdminDialogueModalStore((state) => state.setCallback);

  return (
    <>
      <div
        className={`${
          !isModalOpen && "hidden"
        } fixed inset-0 z-[60] grid place-content-center bg-black/50 p-4 cursor-pointer`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={() => {
          closeModal();
          setCallback(null);
        }}
      ></div>
      <div
        className={`${
          !isModalOpen && "hidden"
        } w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg z-[90] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
      >
        <h2
          id="modalTitle"
          className="text-xl font-bold text-gray-900 sm:text-2xl text-center"
        >
          {modalTitleContent}
        </h2>

        <div className="mt-4">
          <p className="text-pretty text-gray-700 text-center">
            {modalDescriptionContent}
          </p>
        </div>

        {/* Option buttons */}
        <div className="w-full h-auto grid grid-cols-1 md:grid-cols-2 md:gap-x-5 gap-y-5 mt-10">
          <button
            onClick={() => {
              callback ? callback() : null;
              closeModal();
            }}
            className="inline-block rounded-sm border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600 focus:ring-3 focus:outline-hidden"
          >
            {translations.yes[lang!]}
          </button>
          <button
            onClick={() => {
              setCallback(null);
              closeModal();
            }}
            className="inline-block rounded-sm border border-gray-600 bg-gray-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-gray-600 focus:ring-3 focus:outline-hidden"
          >
            {translations.cancel[lang!]}
          </button>
        </div>
      </div>
    </>
  );
};

export default DialogueModal;
