/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import "@testing-library/jest-dom"
import Login from "../Login"
import { MemoryRouter } from "react-router"

test("test login page render", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
  expect(screen.getByText("No Account? Sign Up")).toBeInTheDocument()
  expect(screen.getByRole("button", { type: "submit" })).toBeEnabled()
})

test("should allow user to type in credentials", async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

  await user.type(screen.getByRole("textbox"), "jake123")
  await user.type(screen.getByTestId("password-field"), "secret123")
  expect(screen.getByRole("textbox")).toHaveValue("jake123")
  expect(screen.getByTestId("password-field")).toHaveValue("secret123")
})
// TODO FINISH THIS TEST
test("should allow user to login", async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
  await user.type(screen.getByRole("textbox"), "jake123")
  await user.type(screen.getByTestId("password-field"), "secret")
  user.click(screen.getByRole("button", { name: /LOGIN/i }))
})
