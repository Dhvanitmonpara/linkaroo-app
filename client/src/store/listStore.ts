import { fetchedListType } from "@/lib/types";
import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

interface ListState {
  lists: fetchedListType[] | [];
  setLists: (lists: fetchedListType[]) => void;
  addListItem: (item: fetchedListType) => void;
  removeListItem: (itemId: string) => void;
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
