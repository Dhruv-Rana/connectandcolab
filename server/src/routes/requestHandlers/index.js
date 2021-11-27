const { secureRouteHandler, invalidRouteHandler } = require('./root')

const userNotesHandler = require('./userNotes')

const googleAuthHandler = require('./googleAuth')
const logoutHandler = require('./logout')

const sessionRefresherHandler = require('./sessionRefresher')

module.exports = {
  secureRouteHandler,
  invalidRouteHandler,

  userNotesHandler,

  googleAuthHandler,
  logoutHandler,

  sessionRefresherHandler,
}
