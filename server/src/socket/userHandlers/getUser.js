const { User } = require('./../../database/models')

const validateArguments = require('./../../utilities/validator')

/**
 * Listener => USER :: GET
 * Emitters => USER :: GET
 * Parameters => userId
 */

const getUserHandler = async (io, socket, data) => {
  let { userId } = data
  if (!validateArguments({ userId })) {
    return socket.emit('USER::GET', { status: false })
  }

  let userData = await User.findOne({ _id: userId })
    .select('firstName lastName userImage isOnline -_id')
    .lean()
    .exec()

  if (!userData) {
    return socket.emit('USER::GET', { status: false })
  }

  userData.userId = userId

  return socket.emit('USER::GET', { status: true, userData })
}

module.exports = getUserHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await getUserHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61939fd315be8789059b4e11',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { userId: '61939fd315be8789059b4e11' }
//   );
//   console.log('getUserHandler :', Date.now() - t);
// }, 100);
