import { create } from "zustand";

interface Store {
  title: {
    selectedLang: string;
    content: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
  };

  images: {
    file: File;
    uuid: string;
    previewUrl: string;
  }[];

  selectTitleLanguage: (lang: string) => void;
  setTitle: (titleInputValue: string) => void;
  setInitialTitle: (title: {
    selectedLang: string;
    content: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
  }) => void;

  addImages: (
    images: {
      file: File;
      uuid: string;
      previewUrl: string;
    }[]
  ) => void;

  deleteImage: (imageUUid: string) => void;

  changeImage: (
    imageUUid: string,
    newImage: {
      file: File;
      uuid: string;
      previewUrl: string;
    }
  ) => void;

  resetState: () => void;
}

const initialState = {
  title: {
    selectedLang: "est",
    content: {
      eng: "",
      rus: "",
      est: "",
      nor: "",
    },
  },

  images: [],
};

const useChangeGalleryStore = create<Store>((set) => ({
  ...initialState,

  selectTitleLanguage: (lang) =>
    set((state) => ({
      title: {
        ...state.title,
        selectedLang: lang,
      },
    })),

  setTitle: (content) =>
    set((state) => ({
      title: {
        ...state.title,
        content: {
          ...state.title.content,
          [state.title.selectedLang]: content,
        },
      },
    })),

  setInitialTitle: (title) => set({ title }),

  addImages: (images) =>
    set((state) => ({
      images: [...state.images, ...images],
    })),

  deleteImage: (imageUUid) =>
    set((state) => ({
      images: state.images.filter((item) => item.uuid !== imageUUid),
    })),

  changeImage: (imageUUid, newImage) =>
    set((state) => ({
      images: state.images.map((item) =>
        item.uuid === imageUUid
          ? {
              ...item,
              ...newImage,
            }
          : item
      ),
    })),

  resetState: () => set(() => initialState),
}));

export default useChangeGalleryStore;
