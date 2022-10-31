import React, {useEffect, useState} from "react";
import {message} from "antd";
import {useRecoilState, useRecoilValue} from "recoil";
import {chatActiveContact, chatMessages, loggedInUser} from "../atom/GlobalState";
import {findChatMessage} from "../util/ApiUtil";

let stompClient = null;
const TestChat = (props) => {
    const currentUser = useRecoilValue(loggedInUser);
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
    const [messages, setMessages] = useRecoilState(chatMessages);

    useEffect(() => {
        if (localStorage.getItem("accessToken") === null) {
            props.history.push("/login");
        }
        connect();
        loadContacts();
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
            "/user/" + currentUser.id + "/queue/messages",
            onMessageReceived
        );
    };

    const onError = (err) => {
        console.log(err);
    };

    const onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        const active = JSON.parse(sessionStorage.getItem("recoil-persist")).chatActiveContact;

        if (active.id === notification.senderId) {
            findChatMessage(notification.id).then((message) => {
                const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist"))
                    .chatMessages;
                newMessages.push(message);
                setMessages(newMessages);
            });
        } else {
            message.info("Received a new message from " + notification.senderName);
        }
        loadContacts();
    };

    return (
        <>

        </>
    );
}

export default TestChat;