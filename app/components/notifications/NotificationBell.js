import React, { useContext, useEffect, useState } from "react";
import NotificationContext from "./Notification.context";
import { Badge, Divider, List, notification, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { BellOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

export const NotificationBell = ({ currentUser }) => {
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pageCounter, setPageCounter] = useState(0);
  const navigate = useNavigate();

  const loadMoreData = () => {
    if (loading) return;

    setLoading(true);
    fetch(
      `https://localhost:444/notification-service/notifications?userId=
      ${currentUser.id}&page=${pageCounter + 1}`
    )
      .then((response) => response.json())
      .then((body) => {
        setData((prevState) => prevState.concat(body));
        setLoading(false);
        setPageCounter((prevState) => prevState + 1);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const handleServerEvent = (event) => {
    const jsonNotification = JSON.parse(event.data);
    let newNotificationsArray = new Array({
      senderName: jsonNotification.senderName,
      message: jsonNotification.message,
      redirectTo: jsonNotification.redirectTo,
      isRead: jsonNotification.isRead,
    });

    setNotifications((prev) => newNotificationsArray.concat(prev));

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
    <div
      id="scrollableDiv"
      style={{
        height: 200,
        overflow: "auto",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        next={loadMoreData}
        hasMore={data.length <= notifications.length}
        loader={<i>Loading...</i>}
        dataLength={data.length}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              className="item-not-read mt-2"
              onClick={(e) => {
                handleItemClick(item);
                if (item.isRead)
                  e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <b>{item.senderName}</b> {item.message}
            </List.Item>
          )}
        />
      </InfiniteScroll>
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
