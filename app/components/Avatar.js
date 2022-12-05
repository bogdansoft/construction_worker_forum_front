import React, { useEffect, useState, useContext } from "react"
import Button from "@material-ui/core/Button"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Grow from "@material-ui/core/Grow"
import Paper from "@material-ui/core/Paper"
import Popper from "@material-ui/core/Popper"
import MenuItem from "@material-ui/core/MenuItem"
import MenuList from "@material-ui/core/MenuList"
import CameraAltIcon from "@material-ui/icons/CameraAlt"
import { makeStyles } from "@material-ui/core/styles"
import { IconButton } from "@material-ui/core"
import RenderCropper from "./Cropper"
import Axios from "axios"
import StateContext from "../StateContext"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  cameraIcon: {
    height: "4rem",
    width: "4rem",
    position: "absolute",
    bottom: "0",
    right: "100px",
    backgroundColor: "white",

    "&:hover": {
      backgroundColor: "white"
    }
  }
}))

export default function RenderAvatar(props) {
  const appState = useContext(StateContext)
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)
  const [avatar, setAvatar] = useState("https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png")

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.get(`/api/user/getavatar?username=${props.username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } }, { cancelToken: ourRequest.token })
        if (response.data !== "Avatar not found") {
          setAvatar(response.data)
        }
      } catch (e) {
        console.log("There was a problem" + e.message)
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  })

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  async function handleRemove(e) {
    e.preventDefault()
    try {
      await Axios.delete(`/api/user/deleteavatar?username=${props.username}`, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      setAvatar("https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png")
    } catch (e) {
      console.log("There was a problem " + e.message)
    }
  }

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  const [showCropper, setShowCropper] = React.useState(false)
  const handleCropper = () => setShowCropper(prevValue => !prevValue)

  return (
    <>
      <div className="avatar-container">
        <div className="avatar">
          <img src={avatar} alt="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" className="avatar-img" />
        </div>

        {props.isLoggedIn && (
          <IconButton className={classes.cameraIcon} ref={anchorRef} aria-controls={open ? "menu-list-grow" : undefined} aria-haspopup="true" onClick={handleToggle}>
            <CameraAltIcon fontSize="large" />
          </IconButton>
        )}

        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleClose}>View</MenuItem>
                    <MenuItem
                      onClick={event => {
                        handleCropper()
                        handleClose(event)
                      }}
                    >
                      Change
                    </MenuItem>
                    <MenuItem onClick={handleRemove}>Remove</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

      {showCropper && <RenderCropper username={props.username} handleCropper={handleCropper} setShowCropper={setShowCropper} setAvatar={setAvatar} />}
    </>
  )
}
