import { create } from "zustand";

interface Store {
  fetcherState: string;
  fetchNextPageProjects: (() => void) | null;
  hasMore: boolean;
  projects:
    | {
        _id: string;
        title: string;
        quickDesc: string;
        fullDesc: string;
        isDiscount: boolean;
        price: number;
        newPrice: number;
        isPopular: boolean;
        imagesFolder: string;
        featuresList: string;
      }[]
    | undefined;

  setFetchNextPageProjects: (fn: () => void) => void;
  setFetcherState: (newState: string) => void;
  setHasMore: (hasMore: boolean) => void;
  setProjects: (
    projects: {
      _id: string;
      title: string;
      quickDesc: string;
      fullDesc: string;
      isDiscount: boolean;
      price: number;
      newPrice: number;
      isPopular: boolean;
      imagesFolder: string;
      featuresList: string;
    }[]
  ) => void;
}

const useClientProjectsStore = create<Store>((set) => ({
  fetcherState: "idle",
  fetchNextPageProjects: null,
  hasMore: false,
  projects: undefined,

  setFetchNextPageProjects: (fn) => set({ fetchNextPageProjects: fn }),
  setFetcherState: (newState) => set({ fetcherState: newState }),
  setHasMore: (hasMore) => set({ hasMore }),
  setProjects: (projects) => set({ projects }),
}));

export default useClientProjectsStore;
