import React, { useState } from "react"
import Axios from "axios"

function EditComment(props) {
  const [content, setContent] = useState(props.content)

  async function handleSubmit() {
    console.log(content)
    const ourRequest = Axios.CancelToken.source()
    try {
      const response = await Axios.put(
        `/api/comment/${props.id}`,
        {
          userId: props.userId,
          content,
          postId: props.postId
        },
        { headers: { Authorization: `Bearer ${token}` } },
        { cancelToken: ourRequest.token }
      )
    } catch (e) {
      console.log("There was a problem or the request was cancelled.")
    }
    return () => {
      ourRequest.cancel()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="col-6 d-flex flex-column comment-box">
        <div className="d-flex flex-row">
          <div>
            <textarea value={content} rows="4" cols="50" className="no-resize" onChange={e => setContent(e.currentTarget.value)}></textarea>
          </div>
        </div>
        <div className="align-self-end mt-2">
          <button className="btn btn-primary" type="submit">
            {" "}
            Edit comment
          </button>
        </div>
      </div>
    </form>
  )
}

export default EditComment
