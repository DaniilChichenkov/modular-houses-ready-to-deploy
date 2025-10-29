import { create } from "zustand";

interface Store {
  title: {
    selectedLang: string;
    content: {
      est: string | null;
      eng: string | null;
      rus: string | null;
      nor: string | null;
    };
  };

  content: {
    type: string;
    linkAnnotation?: {
      selectedLang?: string;
      content: {
        est: string;
        eng: string;
        rus: string;
        nor: string;
      };
    };
    linkRoute?: string | null;
    selectedLang: string;
    content: {
      est: string;
      eng: string;
      rus: string;
      nor: string;
    };
    children?: {
      linkRoute?: string;
      type?: string;
      uuid: string;
      content?: {
        est: string;
        eng: string;
        rus: string;
        nor: string;
      };
      file?: File;
      previewUrl?: string;
    }[];
    uuid: string;
    parentUUID: string | null;
    listTitle?: {
      content: {
        est: string;
        eng: string;
        rus: string;
        nor: string;
      };
    };
  }[];

  //Actions

  //Title
  setTitle: (content: string) => void;
  setTitleLang: (lang: string) => void;
  setInitialTitle: (title: {
    selectedLang: string;
    content: {
      est: string | null;
      eng: string | null;
      rus: string | null;
      nor: string | null;
    };
  }) => void;

  //Add content item
  addContentItem: (item: {
    type: string;
    linkAnnotation?: {
      selectedLang: string;
      content: {
        est: string;
        eng: string;
        rus: string;
        nor: string;
      };
    };
    linkRoute?: string | null;
    selectedLang?: string;
    content?: {
      est: string;
      eng: string;
      rus: string;
      nor: string;
    };
    children?: {
      type?: string;
      linkRoute?: string;
      uuid: string;
      content?: {
        est: string;
        eng: string;
        rus: string;
        nor: string;
      };
      previewUrl?: string;
      file?: File;
    }[];
    uuid: string;
    parentUUID: string | null;
    listTitle?: {
      content: {
        est: string;
        eng: string;
        rus: string;
        nor: string;
      };
    };
  }) => void;

  //Remove content item
  deleteContentItem: (uuid: string) => void;

  //Set content item language
  selectContentItemLang: (uuid: string, lang: string) => void;

  //Set item content
  setItemContent: (uuid: string, content: string) => void;

  //Set link route
  setLinkRoute: (uuid: string, route: string) => void;

  //Set link annotation language
  setLinkAnnotationLang: (uuid: string, lang: string) => void;

  //Set link annotation content
  setLinkAnnotationContent: (uuid: string, content: string) => void;

  //Set list langguage
  setListLanguage: (uuid: string, lang: string) => void;

  //Set list title content
  setListTitleContent: (uuid: string, content: string) => void;

  //Add new item to the list
  addListItem: (
    listUUid: string,
    item: {
      linkRoute?: string;
      type?: string;
      uuid: string;
      content: {
        est: string;
        rus: string;
        eng: string;
        nor: string;
      };
    }
  ) => void;

  //Remove an item from the list
  deleteListItem: (parentUUid: string, uuid: string) => void;

  //Handle list item input
  setListItemContent: (
    parentUUid: string,
    uuid: string,
    content: string
  ) => void;

  //Handle list item route input (If item = link)
  setListItemLinkRoute: (
    parentUUid: string,
    uuid: string,
    route: string
  ) => void;

  //Add files to images collection
  addFilesToImagesCollection: (
    collectionUUid: string,
    files: {
      file: File;
      previewUrl: string;
      uuid: string;
    }[]
  ) => void;

  //Delete file from images collection
  deleteFileFromImagesCollection: (
    collectionUUid: string,
    fileUUid: string
  ) => void;

  //Change file in images collection
  replaceImagesCollectionFile: (
    collectionUUid: string,
    fileUUid: string,
    fileData: {
      file: File;
      previewUrl: string;
    }
  ) => void;

  //Reset state
  resetForm: () => void;
}

const initialState = {
  title: {
    selectedLang: "est",
    content: {
      est: "",
      eng: "",
      rus: "",
      nor: "",
    },
  },
  content: [],
};

const useChangeTechnologyItemStore = create<Store>((set) => ({
  ...initialState,

  //Actions
  //Title actions
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
  setTitleLang: (lang) =>
    set((state) => ({
      title: { ...state.title, selectedLang: lang },
    })),
  setInitialTitle: (title) => set({ title }),

  //Content actions
  addContentItem: (item) =>
    set((state) => ({
      content: [...state.content, item],
    })),
  deleteContentItem: (uuid) =>
    set((state) => ({
      content: state.content.filter((item) => item.uuid !== uuid),
    })),
  selectContentItemLang: (uuid, lang) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === uuid ? { ...item, selectedLang: lang } : item
      ),
    })),
  setItemContent: (uuid, inputContent) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === uuid
          ? {
              ...item,
              content: { ...item.content, [item.selectedLang]: inputContent },
            }
          : item
      ),
    })),

  //Links content actions (A little modified)
  setLinkRoute: (uuid, route) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === uuid
          ? {
              ...item,
              linkRoute: route,
            }
          : item
      ),
    })),

  setLinkAnnotationLang: (uuid, lang) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === uuid
          ? {
              ...item,
              linkAnnotation: {
                ...item.linkAnnotation!,
                selectedLang: lang,
              },
            }
          : item
      ),
    })),

  setLinkAnnotationContent: (uuid, content) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === uuid
          ? {
              ...item,
              linkAnnotation: {
                ...item.linkAnnotation!,
                content: {
                  ...item.linkAnnotation!.content,
                  [item.selectedLang!]: content,
                },
              },
            }
          : item
      ),
    })),

  setListTitleContent: (uuid, content) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === uuid
          ? {
              ...item,
              listTitle: {
                ...item.listTitle!,
                content: {
                  ...item.listTitle!.content,
                  [item.selectedLang]: content,
                },
              },
            }
          : item
      ),
    })),

  setListLanguage: (uuid, lang) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === uuid
          ? {
              ...item,
              selectedLang: lang,
            }
          : item
      ),
    })),

  addListItem: (listUUid, newItem) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === listUUid
          ? {
              ...item,
              children: [...item.children!, newItem],
            }
          : item
      ),
    })),

  deleteListItem: (parentUUid, uuid) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === parentUUid
          ? {
              ...item,
              children: item.children!.filter(
                (listItem) => listItem.uuid !== uuid
              ),
            }
          : item
      ),
    })),

  setListItemContent: (parentUUid, uuid, content) =>
    set((state) => ({
      content: state.content.map((list) =>
        list.uuid === parentUUid
          ? {
              ...list,
              children: list.children!.map((listItem) =>
                listItem.uuid === uuid
                  ? {
                      ...listItem,
                      content: {
                        ...listItem.content!,
                        [list.selectedLang]: content,
                      },
                    }
                  : listItem
              ),
            }
          : list
      ),
    })),

  setListItemLinkRoute: (parentUUid, uuid, route) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === parentUUid
          ? {
              ...item,
              children: item.children!.map((child) =>
                child.uuid === uuid
                  ? {
                      ...child,
                      linkRoute: route,
                    }
                  : child
              ),
            }
          : item
      ),
    })),

  addFilesToImagesCollection: (collectionUUid, files) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === collectionUUid
          ? {
              ...item,
              children: [...item.children!, ...files],
            }
          : item
      ),
    })),

  deleteFileFromImagesCollection: (collectionUUid, fileUUid) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === collectionUUid
          ? {
              ...item,
              children: item.children!.filter(
                (child) => child.uuid !== fileUUid
              ),
            }
          : item
      ),
    })),

  replaceImagesCollectionFile: (collectionUUid, fileUUid, fileData) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.uuid === collectionUUid
          ? {
              ...item,
              children: item.children!.map((child) =>
                child.uuid === fileUUid
                  ? {
                      ...child,
                      ...fileData,
                    }
                  : child
              ),
            }
          : item
      ),
    })),

  resetForm: () => set(() => initialState),
}));

export default useChangeTechnologyItemStore;
