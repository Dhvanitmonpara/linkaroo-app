import { fetchedDocType, fetchedListType } from "@/lib/types";
import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

interface ListState {
  lists: fetchedListType[] | [];
  setLists: (lists: fetchedListType[]) => void;
  addListItem: (item: fetchedListType) => void;
  removeListItem: (listId: string) => void;
  updateListItem: (list: fetchedListType) => void;
  updateListTags: (list: fetchedListType) => void;
  toggleIsPublic: (list: fetchedListType) => void;
  inbox: fetchedListType | null;
  inboxDocs: fetchedDocType[] | []
  setInbox: (inbox: fetchedListType | null) => void;
  setInboxDocs: (docs: fetchedDocType[] | []) => void
  addInboxDocItem: (doc: fetchedDocType) => void;
  removeInboxDocItem: (docId: string) => void
}

const useListStore = create<ListState>()(
  devtools(
    persist(
      (set) => ({
        lists: [],
        setLists: (lists) => set({ lists }),
        addListItem: (list) => {
          set((state) => ({ lists: [...state.lists, list] }));
        },
        removeListItem: (listId) => {
          set((state) => ({
            lists: state.lists.filter((list) => list._id !== listId),
          }));
        },
        updateListItem: (list) => {
          set((state) => ({
            lists: state.lists.map((existingList) =>
              existingList._id === list._id
                ? { ...existingList, ...list }
                : existingList
            ),
          }));
        },
        updateListTags: (list) => {
          set((state) => {
            const existingListIndex = state.lists.findIndex(
              (existingList) => existingList._id === list._id
            );

            if (existingListIndex !== -1) {
              const updatedLists = [...state.lists];
              const updatedList = { ...updatedLists[existingListIndex] };

              updatedList.tags = [...list.tags];

              updatedLists[existingListIndex] = updatedList;

              return { ...state, lists: updatedLists };
            }

            return state;
          });
        },
        toggleIsPublic: (list) => {
          set((state) => ({
            lists: state.lists.map((existingList) =>
              existingList._id === list._id
                ? { ...existingList, isPublic: !list.isPublic }
                : existingList
            ),
          }));
        },
        inbox: null,
        inboxDocs: [],
        setInbox: (inbox) => set({ inbox }),
        setInboxDocs: (docs) => set({ inboxDocs: docs }),
        addInboxDocItem: (doc) => {
          set((state) => ({ inboxDocs: [...state.inboxDocs, doc] }));
        },
        removeInboxDocItem: (docId) => {
          set((state) => ({
            inboxDocs: state.inboxDocs.filter((doc) => doc._id !== docId),
          }));
        }
      }),
      {
        name: "lists",
      }
    )
  )
);

export default useListStore;

// usage

// import useListStore from "./listStore"

// const addListItem = useListStore((state) => state.addListItem)

// const { addListItem, removeListItem } = useListStore(state => photo me dekhle)
