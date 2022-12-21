import React, { useMemo } from "react";
import { localStorageService } from "../../services/localStorageService/localStorage.service";
import { NotificationProvider } from "./Notification.context";
import { NotificationBell } from "./NotificationBell";

function Notifications() {
  const currentUser = useMemo(() => localStorageService.getUser(), []);

  return (
    <NotificationProvider>
      <NotificationBell currentUser={currentUser} />
    </NotificationProvider>
  );
}

export default Notifications;
