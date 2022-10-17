import React, { useEffect } from "react"

function RegisterForm() {
  return (
    <div className=" login container col-3 ">
      <form>
        <div className="d-flex flex-column align-items-center ">
          <div className="mt-3 mr-2 p-2 ">
            Username : <input type="text" className="ml-4" placeholder="username" />
          </div>
          <div className="mt-3 mr-2 p-2">
            Password : <input type="password" className="ml-4" placeholder="*********" />
          </div>
          <div className="mt-3 mr-2 p-2 ">
            First name : <input type="text" className="ml-4" placeholder="First Name" />
          </div>
          <div className="mt-3 mr-2 p-2 ">
            Last name : <input type="text" className="ml-4" placeholder="Last Name" />
          </div>
          <div className="mt-2 align-self-center p-3">
            <button className="btn btn-primary login-button">Create !</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
