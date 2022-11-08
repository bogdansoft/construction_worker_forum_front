/**
 * @jest-environment jsdom
 */
import { render, cleanup, screen, fireEvent, act } from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react"
import Login from "../Login"

afterEach(cleanup)
test("test login page render", () => {
  render(<Login />)
  expect(screen.getByText("No Account? Sign Up")).toBeInTheDocument()
  expect(screen.getByRole("button", { type: "submit" })).toBeEnabled()
})
