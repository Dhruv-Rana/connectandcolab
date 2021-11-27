const express = require('express')
const rootRouter = express.Router()

const path = require('path')

const {
  secureRouteHandler,
  invalidRouteHandler,

  userNotesHandler,

  googleAuthHandler,
  logoutHandler,

  sessionRefresherHandler,
} = require('./requestHandlers')

/**
 * Routes
 */

rootRouter.use('/notes', [secureRouteHandler, userNotesHandler])

rootRouter.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'))
})

rootRouter.get('/*', (req, res) => {
  return res.redirect('/')
})

rootRouter.post('/google_auth', googleAuthHandler)

rootRouter.use(secureRouteHandler)

rootRouter.post('/ref_session', sessionRefresherHandler)

rootRouter.post('/logout', logoutHandler)

rootRouter.use(invalidRouteHandler)

module.exports = rootRouter
