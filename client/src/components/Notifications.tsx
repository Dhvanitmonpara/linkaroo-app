import NotificationCard from "./NotificationCard";

const Notifications = () => {
  return (
    <div className="md:p-2 p-4">
      <NotificationCard
        buttonMethods={{ onAccept: () => {}, onDismiss: () => {} }}
        notification={{
          title: "Connection req",
          description: "@tanishka sent you conection req",
          time: "27 sep saturday",
        }}
      />
    </div>
  );
};

export default Notifications;
