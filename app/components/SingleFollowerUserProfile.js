import React from "react"
import { Link } from "react-router-dom"

function SingleFollowerUserProfile(props) {
  return (
    <>
      <div className="single-item-profile container d-flex mt-3 p-2 align-items-center">
        <div id="topic-name" className="ml-3">
          <Link to={`/profile/${props.follower.username}`}>{props.follower.username}</Link>
        </div>
      </div>
    </>
  )
}

export default SingleFollowerUserProfile
