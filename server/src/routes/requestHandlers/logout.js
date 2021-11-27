const io = require('./../../socket')

const { User } = require('./../../database/models')

const logger = require('./../../utilities/logger')

/**
 * Helper Functions For Handler
 */

const destroySession = (session) => {
  return new Promise((resolve) => {
    session.destroy((err) => {
      if (err) {
        logger(1, __filename, 'SESSION DESTROY', err)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * User Logout Handler
 */

const logoutHandler = async (req, res) => {
  let { userId } = req.session

  let sockets = await io.in(userId).fetchSockets()
  sockets.forEach((socket) => socket.removeAllListeners('disconnect'))

  if (sockets.length) {
    io.in(userId).disconnectSockets(true)
    User.updateOne({ _id: userId }, { isOnline: false, lastOnline: Date.now() })
      .then()
      .catch()

    let socket = sockets[0]

    socket.broadcast.emit('USER::STATUS::OFF', {
      status: true,
      user: { userId: socket.userId, ...socket.userInfo },
    })
  }

  let sessionStatus = await destroySession(req.session)
  if (sessionStatus) {
    return res.json({ status: true })
  } else {
    return res.sendStatus(500)
  }
}

module.exports = logoutHandler
