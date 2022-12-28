import React, { useEffect, useContext } from "react"
import { useState } from "react"
import ReactTooltip from "react-tooltip"
import StateContext from "../StateContext"

function RefreshButton(props) {
  const appState = useContext(StateContext)
  const [isDisabled, setIsDisabled] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [buttonSize, setButtonSize] = useState()

  function makeButtonUnavailableFor30seconds() {
    setIsDisabled(true)
    setOpacity(0.5)

    setTimeout(() => {
      setIsDisabled(false)
      setOpacity(1)
    }, 10000)
  }

  useEffect(() => {
    if (appState.isMobileDevice) {
      setButtonSize("25px")
    }
  }, [])

  return (
    <div className="refresh-button-div">
      <button
        onClick={() => {
          props.handleRefreshContent(true)
          makeButtonUnavailableFor30seconds()
        }}
        className="refresh-button-itself material-symbols-outlined"
        data-for="refresh"
        data-tip="refresh content"
        disabled={isDisabled}
        style={{ opacity: opacity, fontSize: buttonSize }}
      >
        refresh
      </button>
      <ReactTooltip id="refresh" className="custom-tooltip" />
    </div>
  )
}

export default RefreshButton
