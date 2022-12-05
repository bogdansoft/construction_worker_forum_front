import React, { useContext, useMemo } from "react";
import { ContactItem } from "./ContactItem";
import ChatContext from "../Chat.context";
import { localStorageService } from "../../../services/localStorageService/localStorage.service";

export const ContactList = () => {
  const { contacts } = useContext(ChatContext);
  const currentUserId = useMemo(() => localStorageService.getUser().id, []);

  return (
    <div>
      <div className="chat-title-bar mb-2">Messages</div>
      <div className="d-flex flex-column">
        {contacts
          .filter((c) => c.id.toString() !== currentUserId)
          .map((contact) => (
            <ContactItem contact={contact} />
          ))}
      </div>
    </div>
  );
};
