import React, { useEffect } from "react"

function RegisterForm() {
  return (
    <div className=" login container col-3 ">
      <form>
        <div className="d-flex flex-column align-items-center ">
          <div className="mt-3 mr-2 p-2 form-group">
            <div className="form-control">
              Username : <input type="text" className="ml-3" placeholder="username" />
            </div>
            <div className="alert alert-danger small liveValidateMessage">wrong username</div>
          </div>
          <div className="mt-3 mr-2 p-2 form-group">
            <div className="form-control">
              Password : <input type="text" className="ml-3" placeholder="*******" />
            </div>
            <div className="alert alert-danger small liveValidateMessage">wrong password</div>
          </div>
          <div className="mt-3 mr-2 p-2 form-group">
            <div className="form-control">
              First name : <input type="text" className="ml-3" placeholder="John" />
            </div>
            <div className="alert alert-danger small liveValidateMessage">wrong</div>
          </div>
          <div className="mt-3 mr-2 p-2 form-group">
            <div className="form-control">
              Last name : <input type="text" className="ml-3" placeholder="Doe" />
            </div>
            <div className="alert alert-danger small liveValidateMessage">wrong username</div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
