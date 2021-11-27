import { io } from 'socket.io-client'
import { baseUrl } from '../config'

const Socket = io(baseUrl, {
  path: '/iohost',
  autoConnect: false,
  reconnection: false,
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})

export default Socket
