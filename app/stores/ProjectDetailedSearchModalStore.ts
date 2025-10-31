import { create } from "zustand";

interface Store {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const initialState = {
  open: false,
};

const useProjectDetailedSearchModalStore = create<Store>((set) => ({
  ...initialState,

  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));

export default useProjectDetailedSearchModalStore;
