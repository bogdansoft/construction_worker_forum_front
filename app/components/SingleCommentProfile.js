import React, { useEffect } from "react"

function SingleCommentProfile(props) {
  const date = new Date(props.comment.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  return (
    <div className="single-item-profile container d-flex mt-3 ml-3 p-2 align-items-center">
      <div id="topic-name">{props.comment.content}</div>
      <div className="ml-auto mr-3">
        <span className="ml-3">Created: {date}</span>
      </div>
      <div className="icon-black">
        <span className="material-symbols-outlined"> edit </span>
        <span className="material-symbols-outlined"> delete </span>
      </div>
    </div>
  )
}

export default SingleCommentProfile
