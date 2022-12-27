import React, { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import { CSSTransition } from "react-transition-group"

function CommentInfoButton(props) {
  const [showInfo, setShowInfo] = useState(false)
  const createDate = props.createdAt
  const updateDate = props.updatedAt

  function prepareDate(date) {
    if (!date) {
      return "N/A"
    } else if (/^\d{2}.\d{2}.\d{4}, \d{2}:\d{2}/gm.test(date)) {
      return date
    }

    return new Date(date).toLocaleDateString("utc", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    })
  }

  function showInfoArea() {
    if (showInfo)
      return (
        <div className="delete-pop liveValidateMessage-delete" style={{ border: "1px solid black", fontSize: "15px", zIndex: 1 }}>
          <div>
            Created: <b>{prepareDate(createDate)}</b>
          </div>
          <a style={{ color: "white" }}>--</a>
          <div>
            Edited: <b>{prepareDate(updateDate)}</b>
          </div>
        </div>
      )
  }

  return (
    <div className="icon-black">
      <span onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)} data-for="info" data-tip="info" className="material-symbols-outlined" style={{ cursor: "default" }}>
        info
        <CSSTransition in={showInfo} timeout={330} classNames="liveValidateMessage" unmountOnExit>
          <div class="delete-absolute">
            <div className="d-flex mt-1">{showInfoArea()}</div>
          </div>
        </CSSTransition>
      </span>
      <ReactTooltip id="info" className="custom-tooltip" />
    </div>
  )
}

export default CommentInfoButton
