import React, { useEffect } from "react"
import { Link } from "react-router-dom"
function SingleSearchResult(props) {
  const date = new Date(props.result.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  return (
    <div className="search-result mt-2 d-flex">
      <Link to={`/post/${props.result.id}`}>{props.result.title}</Link>
      <span className=" ml-auto mr-3">
        Created: {date} By {props.result.user.username}{" "}
      </span>
    </div>
  )
}

export default SingleSearchResult
