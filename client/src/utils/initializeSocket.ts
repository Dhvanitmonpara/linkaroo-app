import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_ORIGIN, {
      query: { userId },
      transports: ["websocket"],
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;
