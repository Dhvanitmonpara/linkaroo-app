import { create } from "zustand"

import { devtools, persist } from "zustand/middleware"

const listStore = (set) => ({
    list: [],
    setLists: (lists) => set(state => (state.list = lists)),
    addListItem: (item) => {
        set(state => ({ list: [...state.list, item] }))
    },
    removeListItem: (itemId) => {
        set(state => ({ list: state.list.filter(item => item._id !== itemId) }))
    },
})

const useListStore = create(
    devtools(
        persist(listStore, {
            name: "lists"
        })
    )
)

export default useListStore;

// usage

// import useListStore from "./listStore"

// const addListItem = useListStore((state) => state.addListItem)

// const { addListItem, removeListItem } = useListStore(state => photo me dekhle)