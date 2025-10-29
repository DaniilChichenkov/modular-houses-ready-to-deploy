import { create } from "zustand";

interface Store {
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
  mainImage: {
    previewUrl: string | null;
    file: File | null;
  };
  carouselImages: {
    previewUrl: string;
    file: File | null;
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
  isPopular: boolean | null;
  isDiscount: boolean | null;
  newPrice: number | null;

  //Actions
  setPrice: (priceInputValue: number) => void;
  setTitle: (titleInputValue: string) => void;
  setNumberOfRooms: (numberOfRoomsInputValue: number) => void;
  setArea: (area: number) => void;
  setFloors: (floors: number) => void;

  selectQuickDescriptionLanguage: (lang: string) => void;
  setQuickDescription: (quickDescriptionInputValue: string) => void;
  setInitialQuickDesc: (data: {
    selectedLang: string;
    content: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
  }) => void;

  setInitialMainImage: (file: File) => void;
  setMainImage: (params: { previewUrl: string; file: File }) => void;

  selectFullDescriptionLanguage: (lang: string) => void;
  setFullDescription: (fullDescriptionInputValue: string) => void;
  setInitialFullDesc: (data: {
    selectedLang: string;
    content: {
      eng: string | null;
      rus: string | null;
      est: string | null;
      nor: string | null;
    };
  }) => void;

  //Carousel Images
  setInitialCarouselImages: (files: File[]) => void;
  uploadCarouselImages: (
    files: {
      previewUrl: string;
      file: File;
      uuid: string;
    }[]
  ) => void;
  clearCarouselImagesPreviewUrls: () => void;
  removeCarouselImage: (id: string) => void;
  changeCarouselImage: (idOfImageToChange: string, newImage: File) => void;

  //Features List
  setInitialFeaturesList: (
    list: {
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
    }[]
  ) => void;

  addFeaturesList: () => void;
  deleteFeaturesList: (listUUid: string) => void;
  setFeaturesListTitle: (titleInputContent: string, uuid: string) => void;
  selectFeaturesListLang: (lang: string, uuid: string) => void;
  addFeaturesListItem: (parentListUUid: string) => void;
  deleteFeaturesListItem: (
    parentListUUid: string,
    listItemUUid: string
  ) => void;
  setFeaturesListItemInput: (
    inputContent: string,
    uuid: string,
    parentUUid: string
  ) => void;

  //Promotion
  setInitialPromotionData: (data: {
    isDiscount: boolean;
    newPrice: number | null;
    isPopular: boolean;
  }) => void;

  setIsPopular: (isPopular: boolean) => void;
  setNewPrice: (newPrice: number) => void;
  setIsDiscount: (isDiscount: boolean) => void;

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

  mainImage: {
    previewUrl: null,
    file: null,
  },

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

  isDiscount: false,
  isPopular: false,
  newPrice: null,

  featuresList: [],
};

const useChangeProjectStore = create<Store>((set, get) => ({
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
  setInitialQuickDesc: (content) => set({ quickDesc: content }),

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
  setInitialFullDesc: (content) => set({ fullDesc: content }),

  setInitialMainImage: (file) =>
    set((state) => {
      //Revoke previous image url
      if (state.mainImage.previewUrl) {
        URL.revokeObjectURL(state.mainImage.previewUrl!);
      }

      //Set new image url
      return {
        mainImage: {
          ...state.mainImage,
          file,
          previewUrl: URL.createObjectURL(file),
        },
      };
    }),
  setMainImage: (params) => set({ mainImage: { ...params } }),

  setInitialCarouselImages: (files) =>
    set({
      carouselImages: files.map((item) => ({
        file: item,
        previewUrl: URL.createObjectURL(item),
        uuid: crypto.randomUUID(),
      })),
    }),

  uploadCarouselImages: (files) =>
    set((state) => ({ carouselImages: [...state.carouselImages, ...files] })),
  clearCarouselImagesPreviewUrls: () => {
    get().carouselImages.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
    });
  },
  removeCarouselImage: (id) =>
    set((state) => ({
      carouselImages: state.carouselImages.filter((item) => item.uuid !== id),
    })),
  changeCarouselImage: (id, file) =>
    set((state) => ({
      carouselImages: state.carouselImages.map((img) => {
        if (img.uuid === id) {
          //Revoke url of old image
          URL.revokeObjectURL(img.previewUrl);

          return {
            uuid: crypto.randomUUID(),
            file,
            previewUrl: URL.createObjectURL(file),
          };
        }
        return img;
      }),
    })),

  setInitialFeaturesList: (list) =>
    set({
      featuresList: list.map((item) => ({ ...item, selectedLang: "est" })),
    }),

  addFeaturesList: () =>
    set((state) => ({
      featuresList: [
        ...state.featuresList,
        {
          uuid: crypto.randomUUID(),
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

  setFeaturesListTitle: (content, uuid) =>
    set((state) => ({
      featuresList: state.featuresList.map((list) =>
        list.uuid === uuid
          ? { ...list, title: { ...list.title, [list.selectedLang]: content } }
          : list
      ),
    })),

  selectFeaturesListLang: (lang, uuid) =>
    set((state) => ({
      featuresList: state.featuresList.map((list) =>
        list.uuid === uuid ? { ...list, selectedLang: lang } : list
      ),
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
                  uuid: crypto.randomUUID(),
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

  setInitialPromotionData: (data) =>
    set({
      isDiscount: data.isDiscount,
      newPrice: data.newPrice,
      isPopular: data.isPopular,
    }),

  setIsDiscount: (value) => set({ isDiscount: value }),
  setIsPopular: (value) => set({ isPopular: value }),
  setNewPrice: (newPrice) => set({ newPrice }),

  resetState: () => set(() => initialState),
}));

export default useChangeProjectStore;
