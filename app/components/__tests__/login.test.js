/**
 * @jest-environment jsdom
 */
import { render, cleanup, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import React from "react"
import Login from "../Login"
import { MemoryRouter } from "react-router"
import { server } from "../mocks/server"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterEach(cleanup)
afterAll(() => server.close())

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

test("should allow user to login", async () => {
  const user = userEvent.setup()

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
  await user.type(screen.getByRole("textbox"), "jake123")
  await user.type(screen.getByTestId("password-field"), "secret123")
  user.click(screen.getByRole("button"))
  expect(await screen.findByText("Succesfully logged in !")).toBeInTheDocument()
})
