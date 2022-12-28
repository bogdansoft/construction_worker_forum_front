import React, { useContext } from "react";
import ChatContext from "../Chat.context";

export const ContactItem = ({ contact }) => {
  const { setActiveContact } = useContext(ChatContext);

  return (
    <div
      onClick={() => setActiveContact(contact)}
      className="chat-single-contact ml-auto mr-auto d-flex"
    >
      <img
        className="chat-avatar avatar-tiny"
        src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png"
        alt=""
      />
      <div className="align-self-center">{contact.username}</div>
    </div>
  );
};
