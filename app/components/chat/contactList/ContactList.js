import React, { useContext } from "react";
import { ContactItem } from "./ContactItem";
import ChatContext from "../Chat.context";

export const ContactList = () => {
  const { contacts } = useContext(ChatContext);

  return (
    <div>
      <div className="chat-title-bar mb-2">Messages</div>
      <div className="d-flex flex-column">
        {contacts.map((contact) => (
          <ContactItem contact={contact} />
        ))}
      </div>
    </div>
  );
};
