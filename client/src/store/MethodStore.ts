import { create } from "zustand";

import { devtools, persist } from "zustand/middleware";

interface MethodState {
  isModalOpen: boolean;
  toggleModal: (value?: boolean) => void;
}

const useMethodStore = create<MethodState>()(
  devtools(
    persist(
      (set) => ({
        isModalOpen: false,
        toggleModal: (value) => set({ isModalOpen: value }),
      }),
      {
        name: "methods",
      }
    )
  )
);

export default useMethodStore;
