import { fetchedDocType, fetchedListType } from "@/lib/types";
import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

interface DocState {
  docs: fetchedDocType[] | [];
  setDocs: (lists: fetchedDocType[]) => void;
  addDocItem: (item: fetchedDocType) => void;
  removeDocItem: (itemId: string) => void;
  currentListItem: fetchedListType | null;
  setCurrentListItem: (listItem: fetchedListType) => void;
}

const useDocStore = create<DocState>()(
  devtools(
    persist(
      (set) => ({
        docs: [],
        setDocs: (docs) => set({ docs }),
        addDocItem: (list) => {
          set((state) => ({ docs: [...state.docs, list] }));
        },
        removeDocItem: (docId) => {
          set((state) => ({
            docs: state.docs.filter((doc) => doc._id !== docId),
          }));
        },
        currentListItem: null,
        setCurrentListItem: (listItem) => set(({ currentListItem: listItem })),
      }),
      {
        name: "lists",
      }
    )
  )
);

export default useDocStore;