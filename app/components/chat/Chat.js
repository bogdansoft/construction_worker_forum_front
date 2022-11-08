import React, { useMemo } from "react";
import { localStorageService } from "../../services/localStorageService/localStorage.service";

import { ContactList } from "./contactList/ContactList";
import { ChatProvider } from "./Chat.context";
import { ChatWindow } from "./ChatWindow";

function Chat() {
  const currentUser = useMemo(() => localStorageService.getUser(), []);

  return (
    <ChatProvider>
      <div
        id="chat-window"
        className="container chat-window flex-nowrap d-flex align-items-center"
      >
        <div
          id="chat-wrapper"
          className="col-4 chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right"
        >
          <ContactList />
        </div>
        <div
          id="chat-wrapper"
          className="col-8 chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right"
        >
          <ChatWindow currentUser={currentUser} />
        </div>
      </div>
    </ChatProvider>
  );
}

export default Chat;
