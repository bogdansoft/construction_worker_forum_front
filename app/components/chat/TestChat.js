import React, {useContext, useEffect} from "react";
import StateContext from "../../StateContext";
import {useImmer} from "use-immer";


let stompClient = null;

function TestChat() {
    const currentUser = {
        id: localStorage.getItem("constructionForumUserId"),
        username: localStorage.getItem("constructionForumUsername"),
        token: localStorage.getItem("constructionForumUserToken")
    }
    const appState = useContext(StateContext);
    const [state, setState] = useImmer({
        fieldValue: "",
        chatMessages: []
    });

    useEffect(() => {
        if (currentUser.token === null) {
            console.log("Not logged in!");
        } else {
            console.log("USING LOGGED IN USER TOKEN");
        }
        connect();
    }, []);

    const connect = () => {
        const Stomp = require("stompjs");
        let SockJs = require("sockjs-client");
        SockJs = new SockJs("http://localhost:8080/ws");
        stompClient = Stomp.over(SockJs);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        console.log("connected");
        console.log(currentUser);
        stompClient.subscribe(
            "/user/" + currentUser.id + "/queue/messages"
        );
    };

    const onError = (err) => {
        console.log(err);
    };

    const sendMessage = (msg) => {
        if (msg.trim() !== "") {
            const message = {
                senderId: currentUser.id,
                recipientId: 4,
                senderName: currentUser.username,
                recipientName: "wolf123",
                content: msg,
                timestamp: new Date(),
            };
            stompClient.send("/app/chat", {}, JSON.stringify(message));
        }
    };

    return (
        <div id="chat-wrapper"
             className="container chat-wrapper chat-wrapper--is-visible shadow border-top border-left border-right">
            <div className="chat-title-bar">
                Chat with barksalot
            </div>
            <div id="chat" className="chat-log">
                <div className="chat-self">
                    <div className="chat-message">
                        <div className="chat-message-inner">Hey, how are you?</div>
                    </div>
                    <img className="chat-avatar avatar-tiny"
                         src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"/>
                </div>

                <div className="chat-other">
                    <a href="#">
                        <img className="avatar-tiny"
                             src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"/>
                    </a>
                    <div className="chat-message">
                        <div className="chat-message-inner">
                            <a href="#">
                                <strong>wolf123: </strong>
                            </a>
                            Hey, I am good, how about you?
                        </div>
                    </div>
                </div>
            </div>
            <form id="chatForm" className="chat-form-inline">
                <input type="text" placeholder="Type a message…" autoComplete="off" autoFocus/>
                <button type="submit" className="material-symbols-outlined no-outline">
                    send
                </button>
            </form>
        </div>
    );
}

export default TestChat;