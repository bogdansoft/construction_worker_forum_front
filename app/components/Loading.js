import React, { useEffect } from "react"

function Loading() {
  return (
    <div className="container main">
      <div className="posts p-3 ml-5 mr-3">
        <div className="lds-default ">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default Loading
