import React from "react";
import { Link } from "react-router-dom";

export const Message = ({ message, isSenderMessage, sender }) => {
  if (isSenderMessage) {
    return (
      <div className="chat-self">
        <div className="chat-message">
          <div className="chat-message-inner">{message}</div>
        </div>
        <img
          className="chat-avatar avatar-tiny"
          src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png"
          alt=""
        />
      </div>
    );
  }
  return (
    <div className="chat-other">
      <Link to={`/profile/${sender}`}>
        <img
          className="avatar-tiny"
          src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png"
          alt=""
        />
      </Link>
      <div className="chat-message">
        <div className="chat-message-inner">
          <Link to={`/profile/${sender}`}>
            <strong>{sender}: </strong>
          </Link>
          {message}
        </div>
      </div>
    </div>
  );
};
