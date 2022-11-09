import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import Post from "./Post"
import { useParams, Link } from "react-router-dom"
import StateContext from "../StateContext"

function UserProfileComments() {
  const [comments, setComments] = useState([])
  const { username } = useParams()
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/api/comment/all_by_username${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setComments(response.data)
      } catch (e) {
        console.log("There was a problem" + e)
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username])

  return (
    <section id="content2">
      {comments.map(comment => {
        return <SingleCommentProfile comment={comment} key={comment.id} />
      })}
    </section>
  )
}

export default UserProfileComments
