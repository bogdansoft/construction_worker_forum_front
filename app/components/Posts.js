import React, { useEffect } from "react"
import { useImmer } from "use-immer"

import Axios from "axios"
import Post from "./Post"
function Posts() {
  const [state, setState] = useImmer({
    feed: []
  })
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.get("http://localhost:8080/api/post", { cancelToken: ourRequest.token })
        setState(draft => {
          draft.feed = response.data
        })
      } catch (e) {
        console.log("there was a problem fetching the data")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [])
  return (
    <div className="main container">
      <div className="forum-content d-flex flex-column">
        <div className="list-group">
          {state.feed.map(post => {
            return <Post post={post} key={post.id} />
          })}
        </div>
      </div>
    </div>
  )
}

export default Posts
