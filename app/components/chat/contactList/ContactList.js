import React, { useContext } from "react";
import { ContactItem } from "./ContactItem";
import ChatContext from "../Chat.context";

export const ContactList = () => {
  const { contacts } = useContext(ChatContext);

  return (
    <div>
      <div className="chat-title-bar mb-2">Messages</div>
      <div className="d-flex flex-column">
        <ContactItem contact={{ username: "harry potter" }} />
        <ContactItem contact={{ username: "abc" }} />
        {contacts.map((contact) => (
          <ContactItem contact={contact} />
        ))}
      </div>
    </div>
  );
};
