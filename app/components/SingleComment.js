import React, { useEffect } from "react"

function SingleComment(props) {
  const date = new Date(props.comment.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  return (
    <div className="comment mt-5 d-flex flex-row align-items-start ml-auto mr-auto">
      <div className="mr-3 col-2 text-center">
        <img src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
        <p className="font-weight-bold mt-2">{props.comment.user.username}</p>
      </div>
      <div className="comment-body mt-2 col-8">
        <p>{props.comment.content}</p>
      </div>
      <div className="ml-auto d-flex flex-column align-self-start">
        <div className="align-items-start comment-date">{date}</div>
        <div className="align-self-end mt-4">
          <span className="material-symbols-outlined"> edit </span>
          <span className="material-symbols-outlined"> delete </span>
        </div>
      </div>
    </div>
  )
}

export default SingleComment
