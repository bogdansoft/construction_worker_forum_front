import React, { useEffect, useMemo, useState } from "react";
import { localStorageService } from "../../services/localStorageService/localStorage.service";
import { Message } from "./Message";

let stompClient = null;

function TestChat() {
  const currentUser = useMemo(() => localStorageService.getUser(), []);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    if (currentUser.token === null) {
      console.log("Not logged in!");
    }
    connect();
  }, []);

  const connect = () => {
    const Stomp = require("stompjs");
    let SockJs = require("sockjs-client");
    SockJs = new SockJs("http://localhost:8080/ws");
    stompClient = Stomp.over(SockJs);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log("connected");
    console.log(currentUser);
    stompClient.subscribe(
      "/user/" + currentUser.id + "/queue/messages",
      (message) => {
        setMessages((messages) => [...messages, JSON.parse(message.body)]);
      }
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: currentUser.id,
        recipientId: currentUser.id,
        senderName: currentUser.username,
        recipientName: currentUser.username,
        content: msg,
        timestamp: new Date(),
      };
      stompClient.send("/app/chat", {}, JSON.stringify(message));
      setMessages([...messages, message]);
    }
  };

  return (
    <div
      id="chat-window"
      className="container chat-window flex-nowrap d-flex align-items-center"
    >
      <div
        id="chat-wrapper"
        className="col-4 chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right"
      >
        <div className="chat-title-bar mb-2">Messages</div>
        <div className="d-flex flex-column">
          <div className="chat-single-contact ml-auto mr-auto d-flex">
            <img
              className="chat-avatar avatar-tiny"
              src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
              alt=""
            />
            <div className="align-self-center">Denny</div>
          </div>
          <div className="chat-single-contact ml-auto mr-auto d-flex">
            <img
              className="chat-avatar avatar-tiny"
              src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
              alt=""
            />
            <div className="align-self-center">Wolf123</div>
          </div>
          <div className="chat-single-contact ml-auto mr-auto d-flex">
            <img
              className="chat-avatar avatar-tiny"
              src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
              alt=""
            />
            <div className="align-self-center">Jake123</div>
          </div>
        </div>
      </div>
      <div
        id="chat-wrapper"
        className="col-8 chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right"
      >
        <div className="chat-title-bar">Chat with ...</div>
        <div id="chat" className="chat-log">
          <Message message={"hello"} isSenderMessage={true} />
          <Message message={"hello hello"} isSenderMessage={false} />
          {messages.map((value, index) => (
            <Message
              key={index}
              message={value.content}
              isSenderMessage={value.senderId === currentUser.id}
            />
          ))}
        </div>
        <div id="chatForm" className="chat-form-inline">
          <input
            type="text"
            onChange={(e) => setMessageContent(e.target.value)}
            value={messageContent}
            placeholder="Type a message…"
            autoComplete="off"
            autoFocus
          />
          <button
            className="material-symbols-outlined no-outline"
            onClick={() => {
              if (!messageContent) return;
              sendMessage(messageContent);
              setMessageContent("");
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestChat;
