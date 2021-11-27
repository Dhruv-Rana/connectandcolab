/**
 * User Session Refresher Handler
 * To Keep User Session Alive
 */

const sessionRefresherHandler = (req, res) => {
  return res.json({ status: true })
}

module.exports = sessionRefresherHandler
