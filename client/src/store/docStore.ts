import { cachedDocs, fetchedDocType, fetchedListType } from "@/lib/types";
import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

interface DocState {
  cachedDocs: cachedDocs[] | [];
  setCachedDocs: (lists: cachedDocs[]) => void;
  addCachedDocList: (item: cachedDocs) => void;
  removeCachedDocList: (itemId: string) => void;
  replaceCachedDocList: (doc: cachedDocs) => void;
  addCachedDocItem: (listId: string, item: fetchedDocType) => void;
  removeCachedDocItem: (listId: string, docId: string) => void;
  replaceCachedDocItem: (listId: string, item: fetchedDocType) => void;
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
        addCachedDocList: (list) => {
          set((state) => ({ cachedDocs: [...state.cachedDocs, list] }));
        },
        removeCachedDocList: (listId) => {
          set((state) => ({
            cachedDocs: state.cachedDocs.filter(
              (list) => list.listId !== listId
            ),
          }));
        },
        replaceCachedDocList: (newList) => {
          set((state) => ({
            cachedDocs: state.cachedDocs.map((list) =>
              list.listId === newList.listId ? newList : list
            ),
          }));
        },
        addCachedDocItem: (listId, item) => {
          set((state) => ({
            cachedDocs: state.cachedDocs.map((list) =>
              list.listId === listId
                ? { ...list, docs: [...list.docs, item] }
                : list
            ),
          }));
        },
        removeCachedDocItem: (listId, docId) => {
          set((state) => ({
            cachedDocs: state.cachedDocs.map((list) =>
              list.listId === listId
                ? {
                    ...list,
                    docs: list.docs.filter((doc) => doc._id !== docId),
                  }
                : list
            ),
          }));
        },
        replaceCachedDocItem: (listId, item) => {
          set((state) => ({
            cachedDocs: state.cachedDocs.map((list) =>
              list.listId === listId
                ? { ...list, docs: [...list.docs, item] }
                : list
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
