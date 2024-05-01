import { handler } from '../../api'

export const LogsAPI = (app, context) => {
  app.get('/adminapi/v1/logs', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" })
      return
    }
    res.send({})
  }))
}