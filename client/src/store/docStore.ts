import { cachedDocs, fetchedDocType, fetchedListType } from "@/lib/types";
import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

interface DocState {
  cachedDocs: cachedDocs[] | [];
  setCachedDocs: (lists: cachedDocs[]) => void;
  addCachedDocItem: (item: cachedDocs) => void;
  removeCachedDocItem: (itemId: string) => void;
  docs: fetchedDocType[] | [];
  setDocs: (lists: fetchedDocType[]) => void;
  addDocItem: (item: fetchedDocType) => void;
  removeDocItem: (itemId: string) => void;
  toggleIsChecked: (docId: string, isChecked: boolean) => void;
  currentListItem: fetchedListType | null;
  setCurrentListItem: (listItem: fetchedListType | null) => void;
}

const useDocStore = create<DocState>()(
  devtools(
    persist(
      (set) => ({
        cachedDocs: [],
        setCachedDocs: (lists) => set({ cachedDocs: lists }),
        addCachedDocItem: (list) => {
          set((state) => ({ cachedDocs: [...state.cachedDocs, list] }));
        },
        removeCachedDocItem: (itemId) => {
          set((state) => ({
            cachedDocs: state.cachedDocs.filter(
              (list) => list.listId !== itemId
            ),
          }));
        },
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
        toggleIsChecked: (docId, isChecked) => {
          set((state) => ({
            docs: state.docs.map((existingDoc) =>
              existingDoc._id === docId
                ? { ...existingDoc, isChecked: !isChecked }
                : existingDoc
            ),
          }));
        },
        currentListItem: null,
        setCurrentListItem: (listItem) => set({ currentListItem: listItem }),
      }),
      {
        name: "docs",
      }
    )
  )
);

export default useDocStore;
