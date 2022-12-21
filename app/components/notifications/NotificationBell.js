import React, { useContext, useEffect } from "react";
import NotificationContext from "./Notification.context";
import { Badge, List, notification, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons";

export const NotificationBell = ({ currentUser }) => {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleServerEvent = (event) => {
    const jsonNotification = JSON.parse(event.data);
    let newNotificationsArray = notifications;

    //TODO tutaj coś nie bangla z tym unshiftem
    newNotificationsArray.unshift({
      senderName: jsonNotification.senderName,
      message: jsonNotification.message,
      redirectTo: jsonNotification.redirectTo,
      isRead: jsonNotification.isRead,
    });

    setNotifications(newNotificationsArray);

    notification.open({
      message: (
        <div>
          <b>{jsonNotification.senderName}</b> {jsonNotification.message}
        </div>
      ),
      placement: "topLeft",
      duration: 5,
      onClick: () => {
        navigate(jsonNotification.redirectTo);
      },
    });
  };

  const connectEventListener = () => {
    let notificationListener = new EventSource(
      `https://localhost:444/notification-service/stream/${currentUser.id}`
    );

    notificationListener.onopen = (e) => console.log("OPEN", e);
    notificationListener.onerror = (e) => {
      e.readyState === EventSource.CLOSED.valueOf()
        ? console.log("ERROR")
        : console.log(e);
      connectEventListener();
    };

    notificationListener.onmessage = (event) => {
      handleServerEvent(event);
    };
  };

  useEffect(() => {
    connectEventListener();
  }, []);

  const rendererBadge = () => {
    return (
      <Badge offset={[-4, 6]} count={notifications.length}>
        <BellOutlined style={{ fontSize: "34px", color: "" }} />
      </Badge>
    );
  };

  const handleItemClick = (notification) => {
    notification.isRead = true;
  };

  const notificationTitle = (
    <span>
      <b>Notifications</b>
    </span>
  );

  const notificationList = (
    <div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            className="item-not-read mt-2"
            onClick={(e) => {
              handleItemClick(item);
              if (item.isRead) e.currentTarget.style.backgroundColor = "white";
            }}
          >
            <b>{item.senderName}</b> {item.message}
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <>
      <Popover
        placement="bottomRight"
        title={notificationTitle}
        content={notificationList}
        trigger="click"
      >
        {rendererBadge()}
      </Popover>
    </>
  );
};
