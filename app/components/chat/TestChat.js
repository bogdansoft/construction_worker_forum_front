import React, {useEffect, useState} from "react";
import {message} from "antd";
import {useRecoilState} from "recoil";
import {chatActiveContact, chatMessages} from "../../atom/GlobalState";
import {countNewMessages, findChatMessage, getUsers} from "../../util/ApiUtil";

let stompClient = null;

function TestChat() {
    const currentUser = {
        id: localStorage.getItem("constructionForumUserId"),
        username: localStorage.getItem("constructionForumUsername"),
        token: localStorage.getItem("constructionForumUserToken")
    }
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
    const [messages, setMessages] = useRecoilState(chatMessages);

    useEffect(() => {
        if (localStorage.getItem("accessToken") === null) {
            console.log("Not logged in!");
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
                const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist")).chatMessages;
                newMessages.push(message);
                setMessages(newMessages);
            });
        } else {
            message.info("Received a new message from " + notification.senderName)
        }
        loadContacts();
    };

    const sendMessage = (msg) => {
        if (msg.trim() !== "") {
            const message = {
                senderId: currentUser.id,
                recipientId: activeContact.id,
                senderName: currentUser.username,
                recipientName: activeContact.username,
                content: msg,
                timestamp: new Date(),
            };
            stompClient.send("/app/chat", {}, JSON.stringify(message));

            const newMessages = [...messages];
            newMessages.push(message);
            setMessages(newMessages);
        }
    };

    const loadContacts = () => {
        const promise = getUsers().then((users) =>
            users.map((contact) =>
                countNewMessages(contact.id, currentUser.id).then((count) => {
                    contact.newMessages = count;
                    return contact;
                })
            )
        );

        promise.then((promises) =>
            Promise.all(promises).then((users) => {
                setContacts(users);
                if (activeContact === undefined && users.length > 0) {
                    setActiveContact(users[0]);
                }
            })
        );
    };

    return (
        <div>
            <div>
                <div>
                    <div>
                        <p>hello!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestChat;