import { create } from "zustand";

interface Store {
  open: boolean;
  innerContent: React.ReactNode | null;

  setOpen: (newState: boolean) => void;
  setInnerContent: (newInnerContent: React.ReactNode) => void;
}

const useBetterModalStore = create<Store>((set) => ({
  open: false,
  innerContent: null,

  setOpen: (newState) => set({ open: newState }),
  setInnerContent: (newInnerContent) => set({ innerContent: newInnerContent }),
}));

export default useBetterModalStore;
