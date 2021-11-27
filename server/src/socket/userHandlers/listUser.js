const { User } = require('./../../database/models')

const {
  transformObjectIdMiddleware,
} = require('./../../utilities/helperFunctions')

/**
 * Listener => USER :: LIST
 * Emitters => USER :: LIST
 * Parameters => NULL
 */

const listUserHandler = async (io, socket, data) => {
  let userData = await User.find(
    {},
    {},
    {
      transform: (doc) =>
        doc.map((subDoc) =>
          transformObjectIdMiddleware({ ...subDoc }, 'userId')
        ),
    }
  )
    .select('_id firstName lastName userImage isOnline lastOnline')
    .lean()
    .exec()

  return socket.emit('USER::LIST', { status: true, userData })
}

module.exports = listUserHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await listUserHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61939fd315be8789059b4e11',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { userId: '61939fd315be8789059b4e11' }
//   );
//   console.log('listUserHandler :', Date.now() - t);
// }, 100);
