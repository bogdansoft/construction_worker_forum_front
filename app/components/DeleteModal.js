import React, { useEffect } from "react"

function DeleteModal(props) {
  function showCascadeDeletingElementsLengthAndName() {
    if (props.relatedItemsLength > 0) {
      return (
        <h6 className="align-self-center">
          {" "}
          You will also delete: <text style={{ color: "red", fontWeight: "bold" }}>{props.relatedItemsLength}</text> {props.relatedItemsType + "(s)!"}
        </h6>
      )
    }
  }

  return (
    <div className="d-flex flex-column">
      <h6 className="align-self-center">Are you sure ?</h6>
      {showCascadeDeletingElementsLengthAndName()}
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
