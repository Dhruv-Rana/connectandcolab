const { User } = require('./../../database/models')

const logger = require('./../../utilities/logger')

/**
 * Listener => ROOT :: disconnect
 * Emitters => USER :: STATUS :: OFF
 * Parameters => NULL
 */

const onDisconnectHandler = async (io, socket) => {
  logger(0, __filename, 'SOCKET::ROOT::disconnected', socket.id)

  let sockets = await io.in(socket.userId).fetchSockets()
  if (sockets.length === 0) {
    socket.broadcast.emit('USER::STATUS::OFF', {
      status: true,
      user: { userId: socket.userId, ...socket.userInfo },
    })

    User.updateOne(
      { _id: socket.userId },
      { isOnline: false, lastOnline: Date.now() }
    )
      .then()
      .catch()
  }
}

module.exports = onDisconnectHandler
