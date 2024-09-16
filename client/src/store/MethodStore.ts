import { colorOptions, NotificationType } from "@/lib/types";
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
  prevPath: string | null;
  setPrevPath: (path: string | null) => void;
  notifications: NotificationType[] | [];
  setNotifications: (notifications: NotificationType[] | []) => void;
  addNotification: (notification: NotificationType) => void;
}

const useMethodStore = create<MethodState>()(
  devtools(
    persist(
      (set) => ({
        isModalOpen: false,
        modalContent: null,
        currentCardColor: "bg-zinc-200",
        prevPath: null,
        notifications: [],
        toggleModal: (value) => set({ isModalOpen: value ?? false }),
        setModalContent: (content) => set({ modalContent: content }),
        setCurrentCardColor: (color) => set({ currentCardColor: color }),
        setPrevPath: (path) => set({ prevPath: path }),
        setNotifications: (notifications) =>
          set({ notifications: notifications }),
        addNotification: (notification) =>
          set((state) => ({
            notifications: [...state.notifications, notification],
          })),
      }),
      {
        name: "methods",
      }
    )
  )
);

export default useMethodStore;
