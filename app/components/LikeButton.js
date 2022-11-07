import React, { useEffect } from "react"
import { useState } from "react"

function LikeButton(props) {
  const [color, setColor] = useState()
  const [animation, setAnimation] = useState()
  const [animationTrigger, setAnimationTrigger] = useState(0)

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

  return (
    <span type="like" className="material-symbols-outlined mr-3" data-tip="Like post!" data-for="like" style={{ animation: animation, color: color }} anim>
      thumb_up
    </span>
  )
}

export default LikeButton
