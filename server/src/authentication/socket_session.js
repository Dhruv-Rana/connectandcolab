const cookie = require('cookie')
const cookieParser = require('cookie-parser')

const { User } = require('../database/models')

const logger = require('./../utilities/logger')

const { cookieName, secret } = require('./../config/session')

const mongoClientStore = require('./mongo_client_store')

/**
 * Helper Functions For Handler
 */

const getSession = (sessionId) => {
  return new Promise((resolve) => {
    mongoClientStore.get(sessionId, async (err, session) => {
      if (err) {
        resolve({ status: false, err })
      } else {
        resolve({ status: true, session })
      }
    })
  })
}

// TODO: change here error names
const socketSession = async (socket, next) => {
  if (!socket.request.headers.cookie) {
    return next(new Error('401:UNAUTHORISED::NO_COOKIE'))
  }
  let cookies = cookie.parse(socket.request.headers.cookie)
  let sessionId = cookieParser.signedCookie(cookies[cookieName], secret)

  let sessionData = await getSession(sessionId)
  if (!sessionData.status) {
    logger(1, __filename, 'SOCKET SESSION GETTER', sessionData.err)
    return next(new Error('500:Internal Server Error'))
  } else {
    let { session } = sessionData
    if (!session) {
      // TODO: change here
      return next(new Error('401:UNAUTHORISED::NO_SESSION'))
    }

    let cookieTimeStamp = new Date(session.cookie.expires)
    cookieTimeStamp = cookieTimeStamp.getTime()

    if (cookieTimeStamp > Date.now()) {
      let userData = await User.findOne({ _id: session.userId })
        .select('firstName lastName userImage -_id')
        .lean()
        .exec()
      socket.userId = session.userId
      socket.isAuthenticated = true
      socket.userInfo = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userImage: userData.userImage,
      }
      return next()
    } else {
      return next(new Error('410:EXPIRED'))
    }
  }

  // mongoClientStore.get(sessionId, async (err, session) => {
  // if (err) {
  //   logger(1, __filename, 'SOCKET SESSION GETTER', err);
  //   return next(new Error('500:Internal Server Error'));
  // } else {
  //   if (!session) {
  //     // TODO: change here
  //     return next(new Error('401:UNAUTHORISED::NO_SESSION'));
  //   }
  //
  //   let cookieTimeStamp = new Date(session.cookie.expires);
  //   cookieTimeStamp = cookieTimeStamp.getTime();
  //
  //   if (cookieTimeStamp > Date.now()) {
  //     let userData = await User.findOne({ _id: session.userId })
  //       .select('firstName lastName -_id')
  //       .lean()
  //       .exec();
  //     socket.userId = session.userId;
  //     socket.isAuthenticated = true;
  //     return next();
  //   } else {
  //     return next(new Error('410:EXPIRED'));
  //   }
  // }
  // });
}

module.exports = {
  socketSession,
}
