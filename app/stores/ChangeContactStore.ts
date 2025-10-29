import { create } from "zustand";

interface Store {
  name: string;
  tel: string;
  email: string;
  position: {
    lang: string;
    content: {
      est: string;
      eng: string;
      rus: string;
      nor: string;
    };
  };
  languages: {
    est: boolean;
    eng: boolean;
    rus: boolean;
    nor: boolean;
  };

  setName: (name: string) => void;
  setTel: (tel: string) => void;
  setEmail: (email: string) => void;
  setPoisition: (position: string) => void;
  selectPositionLanguage: (lang: string) => void;
  setInitialPosition: (position: {
    lang: string;
    content: {
      est: string;
      eng: string;
      rus: string;
      nor: string;
    };
  }) => void;
  selectLanguage: (language: string) => void;
  unSelectLanguage: (language: string) => void;
  resetForm: () => void;

  //For setting initial languages obj (When changing contact)
  setInitialLanguages: (languages: {
    est: boolean;
    eng: boolean;
    rus: boolean;
    nor: boolean;
  }) => void;
}

const initialState = {
  name: "",
  tel: "",
  email: "",
  position: {
    lang: "est",
    content: {
      est: "",
      rus: "",
      eng: "",
      nor: "",
    },
  },
  languages: {
    est: false,
    eng: false,
    rus: false,
    nor: false,
  },
};

const useChangeContactStore = create<Store>((set) => ({
  ...initialState,

  setName: (name) => set({ name }),
  setTel: (tel: string) => set({ tel }),
  setEmail: (email: string) => set({ email }),
  setPoisition: (input: string) =>
    set((state) => ({
      ...state,
      position: {
        ...state.position,
        content: {
          ...state.position.content,
          [state.position.lang]: input,
        },
      },
    })),
  setInitialPosition: (position) => set({ position }),
  selectPositionLanguage: (lang) =>
    set((state) => ({
      ...state,
      position: {
        ...state.position,
        lang,
      },
    })),
  selectLanguage: (language) =>
    set((state) => ({
      languages: {
        ...state.languages,
        [language]: true,
      },
    })),
  unSelectLanguage: (language) =>
    set((state) => ({
      languages: {
        ...state.languages,
        [language]: false,
      },
    })),

  setInitialLanguages: (languages) => set({ languages }),

  resetForm: () => set(() => initialState),
}));

export default useChangeContactStore;
