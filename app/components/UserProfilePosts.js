import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams } from "react-router-dom"
import SinglePostProfile from "./SinglePostProfile"
import StateContext from "../StateContext"

function UserProfilePosts() {
  const [posts, setPosts] = useState([])
  const { username } = useParams()
  const appState = useContext(StateContext)
  const [reloadCounter, setReloadCounter] = useState(1)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/api/post/all_by_username/${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        setPosts(response.data)
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
    <section id="content1">
      {posts.map((post) => {
        return <SinglePostProfile post={post} key={post.id} comments={post.comments.length} reload={reload} />
      })}
    </section>
  )
}

export default UserProfilePosts
