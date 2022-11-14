import React, { useEffect } from "react"
import NotFound from "./NotFound"

function UnauthorizedAccessView(props) {
  return (
    <div className="mt-3 ml-auto mr-auto form-group">
      <a style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1 className="alert alert-danger liveValidateMessage mt-3" style={{ fontSize: "16px" }}>
          UNAUTHORIZED ACCESS!
        </h1>
        <NotFound noMessage={true} />
      </a>
    </div>
  )
}

export default UnauthorizedAccessView
