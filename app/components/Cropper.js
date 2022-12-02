import React, { useState, useContext, useEffect } from "react"
import Cropper from "react-easy-crop"
import Slider from "@material-ui/core/Slider"
import Button from "@material-ui/core/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import getCroppedImg, { generateDownload } from "./utils/cropImage"
import { IconButton, makeStyles } from "@material-ui/core"
import { dataURLtoFile } from "./utils/dataURLtoFile"
import Axios from "axios"
import { Buffer } from "buffer"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

const useStyles = makeStyles({
  iconButton: {
    position: "absolute",
    top: "20px",
    right: "20px"
  },
  cancelIcon: {
    color: "#00a3c8",
    fontSize: "50px",
    "&:hover": {
      color: "red"
    }
  }
})

export default function RenderCropper({ handleCropper, username, setAvatar }) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const classes = useStyles()
  const [user, setUser] = useState({
    avatarBytes: ""
  })

  const inputRef = React.useRef()

  const triggerFileSelectPopup = () => inputRef.current.click()

  const [image, setImage] = React.useState(null)
  const [croppedArea, setCroppedArea] = React.useState(null)
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }

  const onSelectFile = event => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.addEventListener("load", () => {
        setImage(reader.result)
      })
    }
  }

  const onDownload = () => {
    generateDownload(image, croppedArea)
  }

  const onClear = () => {
    setImage(null)
  }

  const onUpload = async () => {
    const canvas = await getCroppedImg(image, croppedArea)
    const canvasDataUrl = canvas.toDataURL("image/jpeg")
    const convertedUrlToFile = dataURLtoFile(canvasDataUrl, "cropped-image.jpeg")
    console.log(convertedUrlToFile)
    try {
      const formData = new FormData()
      formData.append("file", convertedUrlToFile)
      formData.append("username", username)
      console.log(formData)
      const response = await Axios.put(`/api/user/changeavatar`, formData, { headers: { Authorization: `Bearer ${appState.user.token}` } })
      console.log("Response" + response)
      console.log("Response data" + response.data)
      // setUser(response.data)
      // const imageBytes = await response.data.avatarBytes
      // console.log("Image Bytes" + imageBytes)
      // var blob = new Blob([imageBytes], { type: "image/jpeg" })
      // console.log("Blob " + blob)
      // var imageUrl = URL.createObjectURL(blob)
      // console.log("Image URL " + imageUrl)
      setAvatar(response.data)

      // setUser(response)
      // let base64ImageString = Buffer.from(user.avatarBytes, "binary").toString("base64")
      // console.log(base64ImageString)
      // const byteCharacters = atob(base64ImageString)
      // const byteNumbers = new Array(byteCharacters.length)
      // for (let i = 0; i < byteCharacters.length; i++) {
      //   byteNumbers[i] = byteCharacters.charCodeAt(i)
      // }
      // const byteArray = new Uint8Array(byteNumbers)
      // const blob = new Blob([byteArray], { type: contentType })
    } catch (e) {
      console.log("There was a problem " + e)
    }
  }

  return (
    <div className="cro-container">
      <IconButton className={classes.iconButton} onClick={handleCropper}>
        <CancelIcon className={classes.cancelIcon} />
      </IconButton>

      <div className="cro-container-cropper">
        {image ? (
          <>
            <div className="cro-cropper">
              <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>

            <div className="cro-slider">
              <Slider min={1} max={3} step={0.1} value={zoom} onChange={(e, zoom) => setZoom(zoom)} color="secondary" />
            </div>
          </>
        ) : null}
      </div>

      <div className="cro-container-buttons">
        <input type="file" accept="image/*" ref={inputRef} onChange={onSelectFile} style={{ display: "none" }} />

        <Button onClick={() => onClear()} variant="contained" color="primary" style={{ marginRight: "10px" }}>
          Clear
        </Button>
        <Button variant="contained" color="primary" onClick={triggerFileSelectPopup} style={{ marginRight: "10px" }}>
          Choose
        </Button>
        <Button variant="contained" color="secondary" onClick={onDownload} style={{ marginRight: "10px" }}>
          Download
        </Button>
        <Button variant="contained" color="secondary" onClick={onUpload}>
          Upload
        </Button>
      </div>
    </div>
  )
}
