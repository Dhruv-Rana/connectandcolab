const { Talk, User } = require('./../../database/models')

const {
  transformObjectIdMiddleware,
} = require('./../../utilities/helperFunctions')
const validateArguments = require('./../../utilities/validator')
const { objectIdToString } = require('../../utilities/helperFunctions')

/**
 * Listener => TALK :: GET
 * Emitters => TALK :: GET
 * Parameters => talkId
 */

const getTalkHandler = async (io, socket, data) => {
  let { recipientUserId } = data
  if (!validateArguments({ recipientUserId })) {
    return socket.emit('TALK::SEND', { status: false })
  }

  let talksMapKey = `talksMap.${recipientUserId}`
  let talksMapData = await User.findOne({
    _id: socket.userId,
    [talksMapKey]: { $exists: true },
  })

  if (!talksMapData) {
    return socket.emit('TALK::GET', { status: false, talkData: {} })
  } else {
    let talkId = talksMapData.talksMap[recipientUserId]
    let talkData = await Talk.findOne({
      _id: talkId,
      participant: { $in: socket.userId },
    })
      .populate({
        path: 'participant',
        select: '_id firstName lastName userImage isOnline lastOnline',
        transform: (doc) => transformObjectIdMiddleware({ ...doc }, 'userId'),
      })
      .select('participant chat')
      .lean()
      .exec()

    return socket.emit('TALK::GET', { status: true, talkData })
  }
}

module.exports = getTalkHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await getTalkHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61960ebb26d372928c4f83f5',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { userId: '61960ebb26d372928c4f83f5' }
//   );
//   console.log('getTalkHandler :', Date.now() - t);
// }, 100);
