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
        src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
        alt=""
      />
      <div className="align-self-center">{contact.username}</div>
    </div>
  );
};
