import React, { useEffect, useState } from "react"
import { useParams, NavLink, Routes, Route } from "react-router-dom"
import UserProfileComments from "./UserProfileComments"
import UserProfilePosts from "./UserProfilePosts"

function UserProfile() {
  const { username } = useParams()

  return (
    <div className={"container py-md-5 "}>
      <h2>
        <img className="avatar" src="https://www.nirix.com/uploads/files/Images/general/misc-marketing/avatar-2@2x.png" />
      </h2>
      <div className="col-lg-7 py-3 py-md-5">
        <h1 className="display-3">Jacek</h1>
        <p className="lead text-muted">Z wyksztalcenia technik informatyk. Pracuje jako operator maszyn CNC. Moje zainteresowania to kino, podroze i zona kolegi Darka</p>
      </div>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts:
        </NavLink>
        <NavLink to="comments" className="nav-item nav-link">
          Comments:
        </NavLink>
      </div>

      <Routes>
        <Route path="" element={<UserProfilePosts />} />
        <Route path="comments" element={<UserProfileComments />} />
      </Routes>
    </div>
  )
}

export default UserProfile
