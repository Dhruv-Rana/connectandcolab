const { User } = require('./../../database/models')

const logger = require('./../../utilities/logger')

/**
 * Listener => ROOT :: connect
 * Emitters => USER :: STATUS :: ON
 * Parameters => NULL
 */

const onConnectHandler = (io, socket) => {
  socket.join(socket.userId)

  io.in(socket.userId)
    .fetchSockets()
    .then((sockets) => {
      if (sockets.length === 1) {
        User.updateOne({ _id: socket.userId }, { isOnline: true })
          .then()
          .catch()
        socket.broadcast.emit('USER::STATUS::ON', {
          status: true,
          user: { userId: socket.userId, ...socket.userInfo },
        })
      }
    })
    .catch()

  logger(0, __filename, 'SOCKET::ROOT::connected', socket.id)
}

module.exports = onConnectHandler
