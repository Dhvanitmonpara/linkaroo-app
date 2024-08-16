import { ReactNode } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MethodState {
  isModalOpen: boolean;
  toggleModal: (value?: boolean) => void;
  modalContent: string | ReactNode | null;
  setModalContent: (content: string | ReactNode | null) => void;
}

const useMethodStore = create<MethodState>()(
  devtools(
    persist(
      (set) => ({
        isModalOpen: false,
        modalContent: null, 
        toggleModal: (value) => set({ isModalOpen: value ?? false }),
        setModalContent: (content) => set({ modalContent: content }),
      }),
      {
        name: "methods",
      }
    )
  )
);

export default useMethodStore;
