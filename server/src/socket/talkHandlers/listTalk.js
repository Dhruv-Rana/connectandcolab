const { User } = require('./../../database/models')

const {
  transformObjectIdMiddleware,
} = require('./../../utilities/helperFunctions')

/**
 * Listener => TALK :: LIST
 * Emitters => TALK :: LIST
 * Parameters => NULL
 */

const listTalkHandler = async (io, socket, data) => {
  let { talks } = await User.findById(socket.userId, {}, {})
    .populate({
      path: 'talks',
      select: '_id participant lastChat lastActivity',
      sort: '-lastActivity',
      populate: {
        path: 'participant',
        select: '_id firstName lastName userImage isOnline lastOnline',
        lean: true,
        transform: (doc) => transformObjectIdMiddleware({ ...doc }, 'userId'),
      },
      // transform: (doc) =>
      //   doc.map((subDoc) => transformObjectIdMiddleware(subDoc, 'talkId')),
      // transform: (doc) => {
      //   console.log('talks : ', doc);
      //   return doc;
      // },
      transform: (doc) => transformObjectIdMiddleware({ ...doc }, 'talkId'),
    })
    .select('talks')
    .lean()
    .exec()

  return socket.emit('TALK::LIST', {
    status: true,
    userId: socket.userId,
    talkData: talks || [],
  })
}

module.exports = listTalkHandler

// User.updateOne(
//   { _id: '61960ebb26d372928c4f83f5' },
//   {
//     $set: { 'talksMap.61960ebb26d372928c4f83f5': '6194896378d38b28a6007e33' },
//     $push: { talks: '6194899c069d101363d8afa1' },
//   }
// )
//   .then(console.log)
//   .catch(console.log);

// User.exists({
//   _id: '61960ebb26d372928c4f83f5',
//   'talksMap.61939fd3s15be8789059b4e11': { $exists: true },
// })
//   .then(console.log)
//   .catch(console.log);

// User.findOne({
//   _id: '61960ebb26d372928c4f83f5',
//   'talksMap.61948874c75adbdb6b196f29': { $exists: true },
// })
//   .select('talksMap.61948874c75adbdb6b196f29 -_id')
//   .lean()
//   .exec()
//   .then(console.log)
//   .catch(console.log);

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await listTalkHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61960ebb26d372928c4f83f5',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { userId: '61960ebb26d372928c4f83f5' }
//   );
//   console.log('listTalkHandler :', Date.now() - t);
// }, 100);
