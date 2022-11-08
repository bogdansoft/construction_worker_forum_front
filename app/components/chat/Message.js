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
          src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
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
          src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
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
