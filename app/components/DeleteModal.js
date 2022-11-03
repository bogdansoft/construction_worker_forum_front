import React, { useEffect } from "react"

function DeleteModal(props) {
  return (
    <div className="d-flex flex-column">
      <h6>Are you sure ?</h6>
      <div className="align-self-center">
        <button onClick={props.delete} className="delete-button delete-button-yes">
          <span class="material-symbols-outlined">done</span>
        </button>
        <button onClick={props.noDelete} className="delete-button delete-button-no ml-2">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  )
}

export default DeleteModal
