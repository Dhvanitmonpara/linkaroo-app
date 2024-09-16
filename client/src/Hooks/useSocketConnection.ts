import { NotificationType } from "@/lib/types";
import { io } from "socket.io-client";
// import { io, Socket } from "socket.io-client";

type socketConnectionProps = {
  userId: string;
  setNotifications: (notifications: NotificationType[] | []) => void;
  // setSocket: (socket: Socket | null) => void;
  notifications: NotificationType[] | [];
};

function socketConnection({
  userId,
  setNotifications,
  // setSocket,
  notifications,
}: socketConnectionProps) {
  const newSocket = io("http://localhost:8000", {
    query: { userId },
    transports: ["websocket"],
  });

  newSocket.on("pendingNotifications", (newNotifications) => {
    setNotifications([...notifications, ...newNotifications]);
  });

  newSocket.on("userDisconnected", (data) => {
    console.log(`User ${data.userId} is offline`);
  });

  // setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}

export default socketConnection;
