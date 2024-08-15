import { ReactNode } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface MethodState {
  isModalOpen: boolean;
  toggleModal: (value?: boolean) => void;
  modalContent: string | ReactNode;
  setModalContent: (content: string | ReactNode) => void;
}

const useMethodStore = create<MethodState>()(
  devtools(
    persist(
      (set) => ({
        isModalOpen: false,
        modalContent: "",
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
