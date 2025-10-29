/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { X } from "lucide-react";

import useAdminInfoModalStore from "~/stores/AdminInfoModalStore";

const InfoModal = () => {
  const isOpen = useAdminInfoModalStore((state) => state.isOpen);
  const title = useAdminInfoModalStore((state) => state.title);
  const content = useAdminInfoModalStore((state) => state.content);
  const closeModal = useAdminInfoModalStore((state) => state.closeModal);

  return (
    <div
      className={`${
        !isOpen && "hidden"
      } fixed inset-0 z-50 grid place-content-center p-4`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      {/* Background */}
      <div
        onClick={closeModal}
        className="bg-black/50 absolute inset-0 z-0 cursor-pointer"
      ></div>

      {/* Content */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg relative z-10">
        <div className="flex items-start justify-between gap-x-5">
          <h2
            id="modalTitle"
            className="text-xl font-bold text-gray-900 sm:text-2xl"
          >
            {title}
          </h2>

          <button
            onClick={closeModal}
            type="button"
            className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-pretty text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
