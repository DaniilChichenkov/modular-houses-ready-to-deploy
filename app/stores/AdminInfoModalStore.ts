import { create } from "zustand";

interface Store {
  isOpen: boolean;
  title: string;
  content: string;
  detailedContent: { msg: string }[];

  //Actions
  toggleModal: () => void;
  openModal: () => void;
  closeModal: () => void;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setDetailedContent: (content: { msg: string }[]) => void;
}

const useAdminInfoModalStore = create<Store>((set) => ({
  isOpen: false,
  title: "",
  content: "",
  detailedContent: [],

  toggleModal: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  openModal: () => set({ isOpen: true }),

  closeModal: () => set({ isOpen: false }),

  setTitle: (title) => set({ title }),

  setContent: (content) => set({ content }),

  setDetailedContent: (contentArr) => console.log("a"),
}));

export default useAdminInfoModalStore;
