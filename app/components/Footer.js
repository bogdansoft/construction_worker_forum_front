import React, { useEffect } from "react"

function Footer() {
  return (
    <>
      <div className="main container">
        <footer className="text-center mt-5">
          <hr />
          <p>2Agile2bTrue &copy; {new Date().getFullYear()} </p>
        </footer>
      </div>
    </>
  )
}

export default Footer
