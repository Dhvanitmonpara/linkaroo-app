import { colorOptions } from "@/lib/types";
import { ReactNode } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MethodState {
  isModalOpen: boolean;
  toggleModal: (value?: boolean) => void;
  modalContent: string | ReactNode | null;
  setModalContent: (content: string | ReactNode | null) => void;
  currentCardColor: colorOptions;
  setCurrentCardColor: (color: colorOptions) => void;
}

const useMethodStore = create<MethodState>()(
  devtools(
    persist(
      (set) => ({
        isModalOpen: false,
        modalContent: null, 
        currentCardColor: "bg-zinc-200",
        toggleModal: (value) => set({ isModalOpen: value ?? false }),
        setModalContent: (content) => set({ modalContent: content }),
        setCurrentCardColor: (color) => set({currentCardColor: color})
      }),
      {
        name: "methods",
      }
    )
  )
);

export default useMethodStore;
