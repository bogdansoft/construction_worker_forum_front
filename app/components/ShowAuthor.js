import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import StateContext from "../StateContext"

function ShowAuthor(props) {
  const appState = useContext(StateContext)

  if ((props.onlyForAdmin == true && !appState.user.isAdmin) || (props.onlyForSuppAndAdmin == true && appState.user.isUser)) return null

  return (
    <span>
      <span className="ml-5 p-1" style={{ font: "small-caps bold 14px/30px Georgia, serif" }}>
        AUTHOR:
      </span>
      <Link className="text-primary medium font-weight-bold mb-3" to={`/profile/${props.contentAuthor.username}`}>
        {props.contentAuthor.id == appState.user.id ? "YOU" : props.contentAuthor.username}
      </Link>
    </span>
  )
}

export default ShowAuthor
