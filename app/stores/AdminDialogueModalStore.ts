import { create } from "zustand";

interface Store {
  isModalOpen: boolean;
  modalTitleContent: string | null;
  modalDescriptionContent: string | null;
  callback: (() => void) | null;

  toggleModal: () => void;
  closeModal: () => void;
  setModalTitleContent: (content: string) => void;
  setModalDescriptionContent: (content: string) => void;
  setCallback: (callback: (() => void) | null) => void;
}

const useAdminDialogueModalStore = create<Store>((set) => ({
  isModalOpen: false,
  modalTitleContent: null,
  modalDescriptionContent: null,
  callback: null,

  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  closeModal: () => set({ isModalOpen: false }),
  setModalTitleContent: (content) => set({ modalTitleContent: content }),
  setModalDescriptionContent: (content) =>
    set({ modalDescriptionContent: content }),
  setCallback: (callback) => set({ callback }),
}));

export default useAdminDialogueModalStore;
