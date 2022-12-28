import React, { useContext } from "react";
import { NotificationProvider } from "./Notification.context";
import { NotificationBell } from "./NotificationBell";
import StateContext from "../../StateContext";

function Notifications() {
  const appState = useContext(StateContext);
  const currentUser = appState.user;

  return (
    <NotificationProvider>
      <NotificationBell currentUser={currentUser} />
    </NotificationProvider>
  );
}

export default Notifications;
