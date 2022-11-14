import React, { useEffect } from "react"

function NotFound(props) {
  function showNotFoundMessage() {
    if (props && props.noMessage == true) {
      return
    }
    return (
      <div className="mt-3 ml-auto mr-auto form-group">
        <a style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h1 className="alert alert-danger liveValidateMessage mt-3" style={{ fontSize: "16px" }}>
            DATA NOT FOUND!
          </h1>
        </a>
      </div>
    )
  }

  return (
    <>
      {showNotFoundMessage()}
      <div className=" mt-3">
        <div className="container d-flex flex-row p-4">
          <div className="notfound-content" style={{ border: "1px", borderRadius: "5px" }}>
            <img src="https://i.imgur.com/e1IneGq.jpg" />
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
