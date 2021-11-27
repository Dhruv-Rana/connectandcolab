const session = require('express-session')

const { secret, cookieName } = require('./../config/session')

const mongoClientStore = require('./mongo_client_store')

// TODO: temp session maxAge time large value
// TODO: remove unwanted attributes
const routeSessionOptions = {
  store: mongoClientStore,

  resave: false,
  saveUninitialized: false,
  rolling: false,

  name: cookieName,
  secret: secret,

  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'none',
  },
}

const routeSession = session(routeSessionOptions)

module.exports = {
  routeSession,
}
