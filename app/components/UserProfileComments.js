import React, { useEffect, useState } from "react"
import Axios from "axios"
import Post from "./Post"
import { useParams, Link } from "react-router-dom"

function UserProfileComments() {
  const [comments, setComments] = useState([])
  const { username } = useParams()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/api/${username}/comments`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setComments(response.data)
      } catch {
        console.log("There was a problem")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  return (
    <div className="list-group">
      {/* {comments.map(comment => {
        return <Comment comment={comment} key={comment.id} />
      })} */}
    </div>
  )
}

export default UserProfileComments
