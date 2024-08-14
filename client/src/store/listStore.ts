import { colorOptions } from "@/lib/types";
import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

type ListType = {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  collaborators: Array<{ _id: string; username: string }>;
  font: string;
  theme: colorOptions;
  tags: Array<{ _id: string; tagname: string }>;
  createdAt: string;
  updatedAt: string;
};

interface ListState {
  lists: ListType[] | [];
  setLists: (lists: ListType[]) => void;
  addListItem: (item: ListType) => void;
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
