import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

type ArrayItem = {
  id: string;
  value: string;
};

interface Store {
  businessTitle: string | null;
  businessEmailsArray: ArrayItem[];
  businessPhysicalAddressesArray: ArrayItem[];
  businessPhoneNumbersArray: ArrayItem[];
  businessAddressToDisplayInFrame: {
    country: string;
    city: string;
    street: string;
    houseNumber: string;
  };

  //Actions
  setBusinessTitle: (titleInputValue: string) => void;
  appendToArray: (arr: string) => void;
  removeFromArray: (arr: string, id: string) => void;
  changeArrayItemValue: (value: string, id: string, array: string) => void;
  setAddressToDisplay: (value: string, fieldName: string) => void;

  //Function to set initial data to store (Get from db)
  setDataFromDB: (data: {
    title: string;
    emailsArr: ArrayItem[];
    addressesArr: ArrayItem[];
    phonesNumbers: ArrayItem[];
    addressToDisplay: {
      country: string;
      city: string;
      street: string;
      houseNumber: string;
    };
  }) => void;
}

const useAdminBusinessInfoStore = create<Store>((set) => ({
  businessTitle: null,
  businessEmailsArray: [],
  businessPhysicalAddressesArray: [],
  businessPhoneNumbersArray: [],
  businessAddressToDisplayInFrame: {
    country: "",
    city: "",
    street: "",
    houseNumber: "",
  },

  setBusinessTitle: (value) => set({ businessTitle: value }),
  changeArrayItemValue: (value, id, array) => {
    switch (array) {
      case "emails":
        set((state) => ({
          businessEmailsArray: state.businessEmailsArray.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                value,
              };
            } else {
              return item;
            }
          }),
        }));
        break;

      case "address":
        set((state) => ({
          businessPhysicalAddressesArray:
            state.businessPhysicalAddressesArray.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  value,
                };
              } else {
                return item;
              }
            }),
        }));
        break;

      case "phones":
        set((state) => ({
          businessPhoneNumbersArray: state.businessPhoneNumbersArray.map(
            (item) => {
              if (item.id === id) {
                return {
                  ...item,
                  value,
                };
              } else {
                return item;
              }
            }
          ),
        }));
        break;
    }
  },
  appendToArray: (arr) => {
    switch (arr) {
      case "address":
        set((state) => ({
          businessPhysicalAddressesArray: [
            ...state.businessPhysicalAddressesArray,
            { id: uuidv4(), value: "" },
          ],
        }));
        break;

      case "emails":
        set((state) => ({
          businessEmailsArray: [
            ...state.businessEmailsArray,
            { id: uuidv4(), value: "" },
          ],
        }));
        break;

      case "phones":
        set((state) => ({
          businessPhoneNumbersArray: [
            ...state.businessPhoneNumbersArray,
            { id: uuidv4(), value: "" },
          ],
        }));
        break;
    }
  },
  removeFromArray: (arr, id) => {
    switch (arr) {
      case "address":
        set((state) => ({
          businessPhysicalAddressesArray:
            state.businessPhysicalAddressesArray.filter(
              (item) => item.id !== id
            ),
        }));
        break;

      case "emails":
        set((state) => ({
          businessEmailsArray: state.businessEmailsArray.filter(
            (item) => item.id !== id
          ),
        }));
        break;

      case "phones":
        set((state) => ({
          businessPhoneNumbersArray: state.businessPhoneNumbersArray.filter(
            (item) => item.id !== id
          ),
        }));
        break;
    }
  },
  setAddressToDisplay: (value, fieldName) =>
    set((state) => ({
      businessAddressToDisplayInFrame: {
        ...state.businessAddressToDisplayInFrame,
        [fieldName]: value,
      },
    })),

  setDataFromDB: ({
    title,
    emailsArr,
    addressesArr,
    phonesNumbers,
    addressToDisplay,
  }) =>
    set({
      businessTitle: title,
      businessEmailsArray: emailsArr,
      businessPhysicalAddressesArray: addressesArr,
      businessPhoneNumbersArray: phonesNumbers,
      businessAddressToDisplayInFrame: addressToDisplay,
    }),
}));

export default useAdminBusinessInfoStore;
