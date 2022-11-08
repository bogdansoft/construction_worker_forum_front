import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import StateContext from "../../StateContext";

const ChatContext = React.createContext();

export const ChatProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState();
  const appState = useContext(StateContext);

  useEffect(() => {
    Axios.get("/users/summaries", {
      headers: { Authorization: `Bearer ${appState.user.token}` },
    }).then((response) => {
      setContacts(response.data);
    });
  }, []);

  return (
    <ChatContext.Provider value={{ contacts, activeContact, setActiveContact }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
