/**
 * @jest-environment jsdom
 */
import { render, cleanup, screen, act, queryByAttribute } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import React from "react"
import Login from "../Login"
import { MemoryRouter, Router } from "react-router"

afterEach(cleanup)

test("test login page render", () => {
  const dom = render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
  expect(screen.getByText("No Account? Sign Up")).toBeInTheDocument()
  expect(screen.getByRole("button", { type: "submit" })).toBeEnabled()
})

test("when provided good credentials, should render popup message and correct navbar", async () => {
  const user = userEvent.setup()

  const dom = render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

  await user.type(screen.getByRole("textbox"), "jake123")
  await user.type(screen.getByTestId("password-field"), "secret123")
  expect(screen.getByRole("textbox")).toHaveValue("jake123")
  expect(screen.getByTestId("password-field")).toHaveValue("secret123")
  user.click(screen.getByRole("button"))
})

test("when provided bad credentials, should render popup message", () => {})
