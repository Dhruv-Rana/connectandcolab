/**
 * Listener Handler => TEST
 */

const testEventHandler = (io, socket, data) => {
  io.to(socket.userId).emit('TEST', {
    status: true,
    data: data,
    code: 1000,
  })
}

module.exports = testEventHandler
