import NotificationCard from "./NotificationCard";
import useMethodStore from "@/store/MethodStore";

// Define Props for NotificationCard component if needed
// interface NotificationCardProps {
//   notification: Notification;
//   buttonMethods: {
//     onAccept: () => void;
//     onDismiss: () => void;
//   };
// }

const Notifications: React.FC = () => {
  // const { socket, notifications } = useMethodStore();
  const { notifications } = useMethodStore();

  const markAsRead = (notificationId: string) => {
    // if (socket) {
    //   socket.emit("markNotificationRead", notificationId);
    // }
    console.log(notificationId)
  };

  return (
    <div className="md:p-2 p-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          buttonMethods={{
            onAccept: () => markAsRead(notification.id), // Use markAsRead when accepting
            onDismiss: () => markAsRead(notification.id), // Use markAsRead when dismissing
          }}
          notification={notification}
        />
      ))}
    </div>
  );
};

export default Notifications;
