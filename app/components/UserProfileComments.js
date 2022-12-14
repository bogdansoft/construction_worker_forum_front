import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams } from "react-router-dom"
import StateContext from "../StateContext"
import SingleCommentProfile from "./SingleCommentProfile"
function UserProfileComments() {
  const [comments, setComments] = useState([])
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [reloadCounter, setReloadCounter] = useState(1)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/api/comment/all_by_username/${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setComments(response.data)
      } catch (e) {
        console.log("There was a problem" + e)
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username, reloadCounter])

  function reload() {
    setReloadCounter((reloadCounter) => (reloadCounter += 1))
  }

  return (
    <section id="content2">
      {comments.map((comment) => {
        return <SingleCommentProfile comment={comment} key={comment.id} reload={reload} />
      })}
    </section>
  )
}

export default UserProfileComments
