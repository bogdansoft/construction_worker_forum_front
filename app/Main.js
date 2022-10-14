import React, { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ReactDOM from "react-dom/client"
import Navbar from "./components/Navbar"
import Posts from "./components/Posts"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Search from "./components/Search"
function Main() {
  return (
    <BrowserRouter>
      <Navbar />
      <Search />
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
  module.hot.accept()
}
