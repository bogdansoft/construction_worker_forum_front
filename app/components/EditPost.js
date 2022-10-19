import React, { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"

function EditPost() {
  const originalState = {
    title: "",
    content: "",
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title = action.value.title
        draft.content = action.value.content
        draft.isFetching = false
        return
      case "titleChange":
        draft.title = action.value
        return
      case "contentChange":
        draft.content = action.value
        return
      case "submitRequest":
        draft.sendCount++
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`http://localhost:8080/api/post/${state.id}`, { cancelToken: ourRequest.token })
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (e) {
        console.log("There was a problem or the request was cancelled.")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const ourRequest = Axios.CancelToken.source()

      async function fetchPost() {
        try {
          console.log(state)
          const response = await Axios.post(`http://localhost:8080/api/post/${state.id}`, { title: state.title, content: state.content }, { cancelToken: ourRequest.token })
          console.log(response)
          dispatch({ type: "saveRequestFinished" })
        } catch (e) {
          console.log("There was a problem or the request was cancelled.")
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  return (
    <div className="container">
      <Link className="medium font-weight-bold" to={`/post`}>
        &laquo; Back to post permalink
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="">
          <div className="form-group container mt-4 row justify-content-center ">
            <div className="col-6 p-2">
              <span className="col-3">Title: </span> <input onChange={(e) => dispatch({ type: "titleChange", value: e.target.value })} value={state.title} type="text" className="col-9" placeholder="title" />
            </div>
            <div className=" col-10 mt-4 post-body ">
              <textarea onChange={(e) => dispatch({ type: "contentChange", value: e.target.value })} id="post-text-area" cols="100" rows="10" type="text" className="" placeholder="" value={state.content} />
            </div>
            <button className="col-3 mt-4 btn btn-primary" type="submit">
              Edit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditPost
