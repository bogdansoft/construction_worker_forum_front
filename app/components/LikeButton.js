import React, { useEffect, useContext } from "react"
import { useState } from "react"
import StateContext from "../StateContext"

function LikeButton(props) {
  const appState = useContext(StateContext)
  const [color, setColor] = useState()
  const [animation, setAnimation] = useState()
  const [animationTrigger, setAnimationTrigger] = useState(0)
  const [buttonSize, setButtonSize] = useState()
  const [counterSize, setCounterSize] = useState()

  function adjustButtonSize() {
    if (appState.isMobileDevice && props.isCommentType) {
      setButtonSize("18px")
    } else {
      setButtonSize("30px")
    }
  }

  function adjustCounterSize() {
    if (appState.isMobileDevice && props.isCommentType) {
      setCounterSize("13px")
    } else {
      setCounterSize("18px")
    }
  }

  useEffect(() => {
    adjustButtonSize()
    adjustCounterSize()
  }, [])

  useEffect(() => {
    props.isLiked ? setColor("blue") : setColor("black")
    props.isLiked ? null : setAnimation("animateLikeButtonClikcMe 4s 1s")
    setAnimationTrigger(animationTrigger + 1)
  }, [props.isLiked])

  useEffect(() => {
    if (animationTrigger > 1) {
      props.isLiked ? setAnimation("animateLikeButton 4s -2s") : setAnimation("animateUnlikeButton 1s")
    }
  }, [animationTrigger])

  if (props.isOwner) {
    return (
      <div className={appState.isMobileDevice ? "" : "d-flex"}>
        <a style={{ fontSize: counterSize }}>{props.likesCount}</a>
        <span type="like" className="material-symbols-outlined mr-3" style={{ color: "gray", cursor: "none", fontSize: buttonSize }}>
          thumb_up
        </span>
      </div>
    )
  }

  return (
    <div className={appState.isMobileDevice ? "" : "d-flex"}>
      <a style={{ fontSize: counterSize }}>{props.likesCount}</a>
      <span type="like" className="material-symbols-outlined mr-3" data-tip="Like post!" data-for="like" style={{ animation: animation, color: color, fontSize: buttonSize }} anim>
        thumb_up
      </span>
    </div>
  )
}

export default LikeButton
