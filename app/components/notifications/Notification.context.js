import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import StateContext from "../../StateContext";

const NotificationContext = React.createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const appState = useContext(StateContext);
  const currentUserId = appState.user.id;

  useEffect(() => {
    Axios.get(
      `https://localhost:444/notification-service/all?userId=${currentUserId}`
    ).then((response) => setNotifications(response.data));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
