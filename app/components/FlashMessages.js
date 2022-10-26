import React, { useEffect } from "react"

function FlashMessages(props) {
  console.log(props)
  return (
    <div className="floating-alerts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className={"alert text-center floating-alert shadow-sm " + msg.messageType}>
            {msg.value}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessages
