import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {chatActiveContact, chatMessages, loggedInUser} from "../atom/GlobalState";

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
        // connect();
        // loadContacts();
    }, []);


    return (
        <>

        </>
    );
}

export default TestChat;