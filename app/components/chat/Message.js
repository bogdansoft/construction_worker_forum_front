import React from 'react'

export const Message = ({message, isSenderMessage}) => {
    if (isSenderMessage) {
        return (
            <div className="chat-self">
                <div className="chat-message">
                    <div className="chat-message-inner">{message}</div>
                </div>
                <img className="chat-avatar avatar-tiny"
                     src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" alt=""/>
            </div>
        )
    }
    return (
        <div className="chat-other">
            <a href="#">
                <img className="avatar-tiny"
                     src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" alt=""/>
            </a>
            <div className="chat-message">
                <div className="chat-message-inner">
                    <a href="#">
                        <strong>wolf123: </strong>
                    </a>
                    {message}
                </div>
            </div>
        </div>
    );
}