import { rest } from "msw"

export const handlers = [
  rest.post("http://localhost/api/login", (req, res, ctx) => {
    const { username, password } = req.json

    return res(
      ctx.status(200),
      ctx.json({
        id: "1",
        username
      })
    )
  })
]
