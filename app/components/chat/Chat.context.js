import React, { useEffect, useState } from "react";
import Axios from "axios";

const ChatContext = React.createContext();

export const ChatProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState();

  useEffect(() => {
    Axios.get("/users/summaries").then((response) => {
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
