/**
 * Secure/Authenticated Route Handler For All Requests
 */

const secureRouteHandler = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next()
  } else {
    return res.sendStatus(401)
  }
}

/**
 * Invalid Routes Handler
 */

const invalidRouteHandler = (req, res) => {
  return res.sendStatus(404)
}

module.exports = {
  secureRouteHandler,
  invalidRouteHandler,
}
