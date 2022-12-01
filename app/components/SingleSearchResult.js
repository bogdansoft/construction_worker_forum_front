import React, { useEffect } from "react"
import { Link } from "react-router-dom"
function SingleSearchResult(props) {
  const date = new Date(props.result.createdAt).toLocaleDateString("utc", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
  if (props.result.name) {
    return (
      <div className="search-result mt-2 d-flex">
        <Link to={`/topic/${props.result.id}`}>{props.result.name}</Link>
        <span className=" ml-auto">
          Created: {date}
          <div className="mobile-toggle-inverse">
            <div className="container"></div>
          </div>
          By {props.result.user.username}{" "}
        </span>
      </div>
    )
  } else {
    return (
      <div className="search-result mt-2 d-flex">
        <Link to={`/post/${props.result.id}`}> {props.result.title}</Link>
        <span className=" ml-auto ">
          Created: {date}
          <div className="mobile-toggle-inverse">
            <div className="container"></div>
          </div>
          By {props.result.user.username}{" "}
        </span>
      </div>
    )
  }
}

export default SingleSearchResult
