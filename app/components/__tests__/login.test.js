/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react"
import React from "react"
import Login from "../Login"
test("test", () => {
  render(<Login />)
  expect(true).toBe(true)
})
