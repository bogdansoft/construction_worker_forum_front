import React, { useContext, useEffect, useState } from "react";
import NotificationContext from "./Notification.context";
import { Badge, Button, List, notification, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons";
import Axios from "axios";
import StateContext from "../../StateContext";

export const NotificationBell = ({ currentUser }) => {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const appState = useContext(StateContext);
  const navigate = useNavigate();

  const url = `https://localhost:444/notification-service/notifications?userId=${currentUser.id}&page=${pageNum}`;

  async function fetchData() {
    Axios.get(url).then((response) => {
      console.log("FETCHING NOTIFICATIONS");
      setInitLoading(false);
      setList((prev) => [...prev, ...response.data]);
      setPageNum((prev) => prev + 1);
      console.log("Notifications:", list);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    fetchData().then(() => setLoading(false));
  };

  const loadMore =
    !initLoading && !loading && notifications.length !== list.length ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>load more...</Button>
      </div>
    ) : null;

  const handleServerEvent = (event) => {
    const jsonNotification = JSON.parse(event.data);
    let newNotificationsArray = new Array({
      senderName: jsonNotification.senderName,
      message: jsonNotification.message,
      redirectTo: jsonNotification.redirectTo,
      isRead: jsonNotification.isRead,
    });

    setNotifications((prev) => newNotificationsArray.concat(prev));
    setList((prev) => newNotificationsArray.concat(prev));

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
      notificationListener.close();
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
    <div
      style={{
        height: 350,
        width: 300,
        overflow: "auto",
      }}
    >
      <List
        loading={initLoading}
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            className="item-not-read mt-2"
            onClick={() => {
              handleItemClick(item);
              navigate(item.redirectTo);
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
