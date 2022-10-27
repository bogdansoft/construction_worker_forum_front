import React from "react";

function SingleChat() {
    return (
        <div className="container main d-flex flex-column">
            <div className="content d-flex mt-4 flex-column">
                <div className="container flex-column d-flex">
                    <div className="align-self-center font-weight-bold">data</div>
                    <div className="align-self-start recipient mt-2">Hi!</div>
                    <div className="align-self-end sender mt-2">Hello</div>
                    <div className="align-self-end sender mt-2">What's up?</div>
                </div>
                <div className="container chat d-flex align-items-center mt-4">
                    <form id="chatForm" className="container p-2 chat-input mr-4">
                        <input type="text" size="95" className="no-outline chat-field" id="chatField"
                               placeholder="Type a message..." autoComplete="off"/>
                    </form>
                    <div className="mt-2 ml-auto">
                        <button className="material-symbols-outlined">
                            send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleChat;