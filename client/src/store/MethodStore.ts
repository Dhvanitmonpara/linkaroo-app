import { colorOptions, NotificationType } from "@/lib/types";
import { ReactNode } from "react";
// import { Socket } from "socket.io-client";
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
  // socket: Socket | null;
  // setSocket: (socket: Socket | null) => void;
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
        // socket: null,
        notifications: [],
        toggleModal: (value) => set({ isModalOpen: value ?? false }),
        setModalContent: (content) => set({ modalContent: content }),
        setCurrentCardColor: (color) => set({ currentCardColor: color }),
        setPrevPath: (path) => set({ prevPath: path }),
        // setSocket: (socket) => set({ socket: socket }),
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
