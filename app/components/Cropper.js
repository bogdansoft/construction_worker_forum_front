import React from "react"
import Cropper from "react-easy-crop"
import Slider from "@material-ui/core/Slider"
import Button from "@material-ui/core/Button"
import CancelIcon from "@material-ui/icons/Cancel"
import getCroppedImg, { generateDownload } from "./utils/cropImage"
import { IconButton, makeStyles } from "@material-ui/core"
import { dataURLtoFile } from "./utils/dataURLtoFile"
import Axios from "axios"

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

export default function RenderCropper({ handleCropper, username }) {
  const classes = useStyles()

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

    try {
      const formdata = new FormData()
      formdata.append("croppedImage", convertedUrlToFile)

      const response = await Axios.post(`/api/user/changeavatar`, { body: formdata })

      console.log(response)
    } catch {
      console.log("There was a problem")
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
