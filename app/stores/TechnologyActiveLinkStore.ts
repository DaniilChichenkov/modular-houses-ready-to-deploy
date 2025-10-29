import { create } from "zustand";

interface Store {
  activeLink: string | undefined;
  setActiveLink: (linkId: string) => void;
}

const initialState = {
  activeLink: undefined,
};

const useTechnologyActiveLinkStore = create<Store>((set) => ({
  ...initialState,

  setActiveLink: (id) => set({ activeLink: id }),
}));

export default useTechnologyActiveLinkStore;
