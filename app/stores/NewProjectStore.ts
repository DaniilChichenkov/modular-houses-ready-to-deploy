import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface Store {
  //State
  price: number | null;
  title: string | null;
  quickDesc: {
    selectedLang: string;
    content: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
  };
  numberOfRooms: number | null;
  area: number | null;
  floors: number | null;
  mainImage: File | null;
  carouselImages: {
    previewUrl: string;
    file: File;
    uuid: string;
  }[];
  fullDesc: {
    selectedLang: string;
    content: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
  };
  featuresList: {
    uuid: string;
    selectedLang: string;
    title: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
    listItems: {
      uuid: string;
      content: {
        eng: string | null;
        rus: string | null;
        est: string | null;
        nor: string | null;
      };
    }[];
  }[];

  //Actions
  setPrice: (priceInputValue: number) => void;
  setTitle: (titleInputValue: string) => void;
  setNumberOfRooms: (numberOfRoomsInputValue: number) => void;
  setArea: (area: number) => void;
  setFloors: (floors: number) => void;

  selectQuickDescriptionLanguage: (lang: string) => void;
  setQuickDescription: (quickDescriptionInputValue: string) => void;

  setMainImage: (file: File | null) => void;

  selectFullDescriptionLanguage: (lang: string) => void;
  setFullDescription: (fullDescriptionInputValue: string) => void;

  uploadCarouselImages: (
    files: {
      previewUrl: string;
      file: File;
      uuid: string;
    }[]
  ) => void;

  changeCarouselImage: (
    newImage: {
      previewUrl: string;
      file: File;
      uuid: string;
    },
    selectedImageUUid: string
  ) => void;

  deleteCarouselImage: (selectedImageUUID: string) => void;

  //Handle add / remove lists and its items
  addFeaturesList: () => void;
  deleteFeaturesList: (listUUid: string) => void;
  addFeaturesListItem: (parentListUUid: string) => void;
  deleteFeaturesListItem: (
    parentListUUid: string,
    listItemUUid: string
  ) => void;

  //Handle features list language selection
  selectFeaturesListLang: (lang: string, uuid: string) => void;

  //Handle title input
  setFeaturesListTitle: (titleInputContent: string, uuid: string) => void;

  //Handle list item input
  setFeaturesListItemInput: (
    inputContent: string,
    uuid: string,
    parentUUid: string
  ) => void;

  //Handle state reset (For example after admin successfully added item)
  resetState: () => void;
}

const initialState = {
  price: null,
  title: null,
  numberOfRooms: null,
  floors: null,
  area: null,

  quickDesc: {
    selectedLang: "est",
    content: {
      eng: null,
      rus: null,
      est: null,
      nor: null,
    },
  },

  mainImage: null,

  carouselImages: [],
  fullDesc: {
    selectedLang: "est",
    content: {
      eng: null,
      rus: null,
      est: null,
      nor: null,
    },
  },

  featuresList: [],
};

const useNewProjectStore = create<Store>((set) => ({
  ...initialState,

  //Actions
  setPrice: (inputValue) => set({ price: inputValue }),
  setTitle: (inputValue) => set({ title: inputValue }),
  setNumberOfRooms: (inputValue) => set({ numberOfRooms: inputValue }),
  setArea: (inputValue) => set({ area: inputValue }),
  setFloors: (inputValue) => set({ floors: inputValue }),

  selectQuickDescriptionLanguage: (lang) =>
    set((state) => ({ quickDesc: { ...state.quickDesc, selectedLang: lang } })),
  setQuickDescription: (inputValue) =>
    set((state) => ({
      quickDesc: {
        ...state.quickDesc,
        content: {
          ...state.quickDesc.content,
          [state.quickDesc.selectedLang]: inputValue,
        },
      },
    })),

  setMainImage: (file) => set({ mainImage: file }),

  selectFullDescriptionLanguage: (lang) =>
    set((state) => ({ fullDesc: { ...state.fullDesc, selectedLang: lang } })),
  setFullDescription: (inputValue) =>
    set((state) => ({
      fullDesc: {
        ...state.fullDesc,
        content: {
          ...state.fullDesc.content,
          [state.fullDesc.selectedLang]: inputValue,
        },
      },
    })),

  uploadCarouselImages: (files) =>
    set((state) => ({ carouselImages: [...state.carouselImages, ...files] })),
  changeCarouselImage: (newImage, selectedImageUUid) =>
    set((state) => ({
      carouselImages: state.carouselImages.map((item) => {
        if (item.uuid === selectedImageUUid) {
          URL.revokeObjectURL(item.previewUrl);
          return newImage;
        }
        return item;
      }),
    })),
  deleteCarouselImage: (uuid) =>
    set((state) => ({
      carouselImages: state.carouselImages.filter((item) => {
        if (item.uuid === uuid) {
          URL.revokeObjectURL(item.previewUrl);
          return false;
        }
        return true;
      }),
    })),

  addFeaturesList: () =>
    set((state) => ({
      featuresList: [
        ...state.featuresList,
        {
          uuid: uuidv4(),
          selectedLang: "est",
          title: {
            eng: null,
            rus: null,
            est: null,
            nor: null,
          },
          listItems: [],
        },
      ],
    })),

  deleteFeaturesList: (listUUid) =>
    set((state) => ({
      featuresList: state.featuresList.filter((item) => item.uuid !== listUUid),
    })),

  addFeaturesListItem: (uuid) =>
    set((state) => ({
      featuresList: state.featuresList.map((parent) =>
        parent.uuid === uuid
          ? {
              ...parent,
              listItems: [
                ...parent.listItems,
                {
                  uuid: uuidv4(),
                  content: { eng: null, est: null, rus: null, nor: null },
                },
              ],
            }
          : parent
      ),
    })),

  deleteFeaturesListItem: (parentListUUid, listItemUUid) =>
    set((state) => ({
      featuresList: state.featuresList.map((parent) =>
        parent.uuid === parentListUUid
          ? {
              ...parent,
              listItems: parent.listItems.filter(
                (listItem) => listItem.uuid !== listItemUUid
              ),
            }
          : parent
      ),
    })),

  selectFeaturesListLang: (lang, uuid) =>
    set((state) => ({
      featuresList: state.featuresList.map((list) =>
        list.uuid === uuid ? { ...list, selectedLang: lang } : list
      ),
    })),

  setFeaturesListTitle: (content, uuid) =>
    set((state) => ({
      featuresList: state.featuresList.map((list) =>
        list.uuid === uuid
          ? { ...list, title: { ...list.title, [list.selectedLang]: content } }
          : list
      ),
    })),

  setFeaturesListItemInput: (inputContent, uuid, parentUUid) =>
    set((state) => ({
      featuresList: state.featuresList.map((list) =>
        list.uuid === parentUUid
          ? {
              ...list,
              listItems: list.listItems.map((item) =>
                item.uuid === uuid
                  ? {
                      ...item,
                      content: {
                        ...item.content,
                        [list.selectedLang]: inputContent,
                      },
                    }
                  : item
              ),
            }
          : list
      ),
    })),

  resetState: () => set(() => initialState),
}));

export default useNewProjectStore;
