import React, { useEffect } from "react"
import { useImmer } from "use-immer"
import Axios from "axios"
import Post from "./Post"
import Loading from "./Loading"

function Posts() {
  const [state, setState] = useImmer({
    feed: [],
    reloadCounter: 0,
    isLoading: false
  })
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        setState(draft => {
          draft.isLoading = true
        })
        const response = await Axios.get("/api/post", { cancelToken: ourRequest.token })
        setState(draft => {
          draft.feed = response.data
          draft.isLoading = false
        })
      } catch (e) {
        console.log("there was a problem fetching the data")
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [state.reloadCounter])

  function reload() {
    setState(draft => {
      draft.reloadCounter++
    })
  }

  if (state.isLoading) return <Loading />

  return (
    <div className="main container">
      <div className="forum-content d-flex flex-column">
        <div className="list-group">
          {state.feed.map(post => {
            return <Post post={post} key={post.id} reload={reload} />
          })}
        </div>
      </div>
    </div>
  )
}

export default Posts
