import React from "react";

function Chat() {
    return (
        <div className="container main d-flex flex-column">
            <div className="content d-flex mt-4 flex-column">
                <div className="container flex-column d-flex">
                    <div className="align-self-center font-weight-bold">data</div>
                    <div className="align-self-start recipient mt-2">Hi!</div>
                    <div className="align-self-end sender mt-2">Hello</div>
                    <div className="align-self-end sender mt-2">What's up?</div>
                </div>
                <div className="container chat align-items-center p-2 d-flex mt-4 mr-4">
                    <form id="chatForm" className="container d-flex align-items-center">
                        <div className="container chat-input">
                            <input type="text" size="95" className="no-outline chat-field" id="chatField"
                                   placeholder="Type a message..." autoComplete="off" autoFocus/>
                        </div>
                        <div className="mt-2 ml-auto">
                            <button type="submit" className="material-symbols-outlined">
                                send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;