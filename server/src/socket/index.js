const { Server } = require('socket.io')

const logger = require('./../utilities/logger')

const { socketSession } = require('./../authentication')

const rootHandlers = require('./rootHandlers')
const postHandlers = require('./postHandlers')
const userHandlers = require('./userHandlers')
const talkHandlers = require('./talkHandlers')

const io = new Server()

io.use(socketSession)

io.on('connect', (socket) => {
  /**
   * On Connect Handler => ROOT :: connect
   * Listener => NULL                  |
   * Emitters => USER :: STATUS :: ON  |
   */

  rootHandlers.onConnectHandler(io, socket)

  // TODO: Remove Logger Middleware
  socket.use((socketEvent, next) => {
    logger(0, __filename, 'SOCKET::' + socketEvent[0], {
      userId: socket.userId,
      data: socketEvent[1],
    })
    next()
  })

  /**
   * Listener => POST :: LIST  |  CREATE        |  GET  |  ADD_COMMENT                           |
   * Emitters => POST :: LIST  |  CREATE , NEW  |  GET  |  ADD_COMMENT , ADD_COMMENT::${postId}  |
   */

  socket.on('POST::LIST', (data) =>
    postHandlers.listPostHandler(io, socket, data)
  )
  socket.on('POST::CREATE', (data) =>
    postHandlers.createPostHandler(io, socket, data)
  )
  socket.on('POST::GET', (data) =>
    postHandlers.getPostHandler(io, socket, data)
  )
  socket.on('POST::ADD_COMMENT', (data) =>
    postHandlers.addCommentPostHandler(io, socket, data)
  )

  /**
   * Listener => USER :: GET  |  GET_ONLINE  |  LIST  |
   * Emitters => USER :: GET  |  GET_ONLINE  |  LIST  |
   */

  socket.on('USER::GET', (data) =>
    userHandlers.getUserHandler(io, socket, data)
  )
  socket.on('USER::GET_ONLINE', (data) =>
    userHandlers.getOnlineUserHandler(io, socket, data)
  )
  socket.on('USER::LIST', (data) =>
    userHandlers.listUserHandler(io, socket, data)
  )

  /**
   * Listener => TALK :: LIST  |  SEND       |  GET  |
   * Emitters => TALK :: LIST  |  SEND, NEW  |  GET  |
   */

  socket.on('TALK::LIST', (data) =>
    talkHandlers.listTalkHandler(io, socket, data)
  )
  socket.on('TALK::SEND', (data) =>
    talkHandlers.sendTalkHandler(io, socket, data)
  )
  socket.on('TALK::GET', (data) =>
    talkHandlers.getTalkHandler(io, socket, data)
  )

  /**
   * Listener => TEST  |
   * Emitters => TEST  |
   */

  socket.on('TEST', (data) => rootHandlers.testEventHandler(io, socket, data))

  /**
   * Listener => ROOT :: disconnect     |
   * Emitters => USER :: STATUS :: OFF  |
   */

  socket.on('disconnect', async () =>
    rootHandlers.onDisconnectHandler(io, socket)
  )
})

module.exports = io
