const { User } = require('./../../database/models')

const {
  transformObjectIdMiddleware,
} = require('./../../utilities/helperFunctions')

/**
 * Listener => USER :: GET_ONLINE
 * Emitters => USER :: GET_ONLINE
 * Parameters => NULL
 */

const getOnlineUserHandler = async (io, socket, data) => {
  let userData = await User.find(
    { isOnline: true },
    {},
    {
      transform: (doc) =>
        doc.map((subDoc) =>
          transformObjectIdMiddleware({ ...subDoc }, 'userId')
        ),
    }
  )
    .select('_id firstName lastName userImage')
    .lean()
    .exec()

  return socket.emit('USER::GET_ONLINE', { status: true, userData })
}

module.exports = getOnlineUserHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await getOnlineUserHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61939fd315be8789059b4e11',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { userId: '61939fd315be8789059b4e11' }
//   );
//   console.log('getOnlineUserHandler :', Date.now() - t);
// }, 100);
