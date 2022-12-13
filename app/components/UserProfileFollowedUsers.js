import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import StateContext from "../StateContext"

function UserProfileFollowedUsers() {
  const [reloadCounter, setReloadCounter] = useState()
  const [followedUsers, setFollowedUsers] = useState()
  const appState = useContext(StateContext)

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchFollowedUsers() {
      try {
        const response = await Axios.get(`/api/comment/all_by_username/${username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
      } catch (e) {
        console.log("There was a problem" + e)
      }
    }
    fetchFollowedUsers()
    return () => {
      ourRequest.cancel()
    }
  }, [username, reloadCounter])

  return (
    <section id="content3">
      {posts.map((post) => {
        return <SinglePostProfile post={post} key={post.id} comments={post.comments.length} reload={reload} />
      })}
    </section>
  )
}

export default UserProfileFollowedUsers
