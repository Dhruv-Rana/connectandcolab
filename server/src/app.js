const express = require('express')
const app = express()

const logger = require('./utilities/logger')

const rootRouter = require('./routes')
const { routeSession } = require('./authentication')

// Global References
global.Refs = {}

// TODO: Change Here: Remove
const cors = require('cors')
app.use(
  cors({
    origin: 'https://localhost:3000',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  })
)

// JSON Data Parser
app.use(express.json())

// Handling Session For All Request
app.use(routeSession)

// TODO: Change Here: Remove
app.use((req, res, next) => {
  logger(0, __filename, 'HTTP::REQ LOGGER MIDDLEWARE', {
    ip: req.socket.remoteAddress,
    method: req.method,
    path: req.path,
    userId: req.session.userId,
    isAuthenticated: req.session.isAuthenticated,
    data: req.body,
  })
  next()
})

// Handling All Request with rootRouter
app.use('/', rootRouter)

// Error Handler
app.use((err, req, res, next) => {
  logger(1, __filename, 'HTTP::EXPRESS ERROR MIDDLEWARE', err)
  // next(err);
  return res.status(500).end()
})

module.exports = app
