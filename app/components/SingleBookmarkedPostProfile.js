import React from "react"
import {Link} from "react-router-dom"

export const SingleBookmarkedPostProfile = (props) => {
    const date = new Date(props.post.createdAt).toLocaleDateString("utc", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })

    return (
        <>
            <div className="single-item-profile container d-flex mt-3 p-2 align-items-center">
                <div id="topic-name">
                    <Link to={`/post/${props.post.id}`}>{props.post.title}</Link>
                </div>
                <div className="ml-auto mr-3">
                    <span className="ml-3">Created: {date}</span>
                </div>
            </div>
        </>
    )
}
