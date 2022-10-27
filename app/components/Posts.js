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
    <div className="main container d-flex flex-column">
      <div className="mt-5">
        <h3 className="font-weight-bold text-center">Welcome to the forum about every aspect of construction working !</h3>
      </div>
      <div className="content container d-flex flex-column mt-4">
        <div className="d-flex flex-row">
          <div className="ml-4">
            <h4 className="font-weight-bold">Posts</h4>
          </div>
          <div className="ml-auto d-flex flex-row align-items-center">
            <select className="mr-3" name="Pagination" id="pagination">
              <option>Pagination</option>
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
            </select>
            <select className="mr-3" name="Sorting" id="sorting">
              <option>Sorting</option>
              <option>Alphabetically</option>
              <option>Most popular</option>
              <option>Newest</option>
              <option>Last updated</option>
            </select>
            <div className="mr-4">
              <span className="material-symbols-outlined"> tune </span>
            </div>
          </div>
        </div>
        {state.feed.map(post => {
          return <Post post={post} key={post.id} author={post.user} reload={reload} />
        })}
      </div>
    </div>
  )
}

export default Posts
