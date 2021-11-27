const { User, Talk } = require('./../../database/models')

const validateArguments = require('./../../utilities/validator')
const { objectIdToString } = require('../../utilities/helperFunctions')

/**
 * Listener => TALK :: SEND        |
 * Emitters => TALK :: SEND , NEW  |
 * Parameters => recipientUserId, message
 */

const sendTalkHandler = async (io, socket, data) => {
  // let t = Date.now();
  let { recipientUserId, message } = data
  if (
    !validateArguments({ message, recipientUserId }) ||
    !(await User.exists({ _id: recipientUserId }))
  ) {
    return socket.emit('TALK::SEND', { status: false })
  }

  if (socket.userId === recipientUserId) {
    return socket.emit('TALK::SEND', { status: false })
  }

  let talksMapKey = `talksMap.${recipientUserId}`
  let talksMapData = await User.findOne({
    _id: socket.userId,
    [talksMapKey]: { $exists: true },
  })
    .select('talksMap')
    .lean()
    .exec()

  let user = {
    userId: socket.userId,
    ...socket.userInfo,
    isOnline: true,
  }

  if (!talksMapData) {
    // create new chat
    let participant = [socket.userId, recipientUserId].sort()
    let currentTS = Date.now()
    let chat = { user: socket.userId, message, timeStamp: currentTS }
    let talk = new Talk({
      participant,
      participantHash: Talk.getParticipantHash(participant.join(' ')),
      chat,
      lastChat: chat,
      lastActivity: currentTS,
    })

    try {
      let { _id } = await talk.save()
      let talkId = objectIdToString(_id)

      await User.updateOne(
        { _id: socket.userId },
        { $set: { [`talksMap.${recipientUserId}`]: talkId } }
      )
      await User.updateOne(
        { _id: recipientUserId },
        { $set: { [`talksMap.${socket.userId}`]: talkId } }
      )
      await User.updateMany(
        { _id: [socket.userId, recipientUserId] },
        { $push: { talks: talkId } }
      )

      socket.emit('TALK::SEND', { status: true, talkId })
      // console.log('new chat :', Date.now() - t);
      return io.to([socket.userId, recipientUserId]).emit('TALK::NEW', {
        status: true,
        talkId,
        messageData: { user, message, timeStamp: currentTS },
      })
    } catch (err) {
      return socket.emit('TALK::SEND', { status: false })
    }
  } else {
    // update chat
    let talkId = talksMapData.talksMap[recipientUserId]
    let currentTS = Date.now()
    let chat = { user: socket.userId, message, timeStamp: currentTS }
    Talk.updateOne(
      { _id: talkId },
      { $push: { chat }, $set: { lastChat: chat, lastActivity: currentTS } }
    )
      .then()
      .catch()

    socket.emit('TALK::SEND', { status: true, talkId })
    // console.log('existing chat :', Date.now() - t);
    return io.to([socket.userId, recipientUserId]).emit('TALK::NEW', {
      status: true,
      talkId,
      messageData: {
        user,
        message,
        timeStamp: Date.now(),
      },
    })
  }

  // let participantHash = Talk.getParticipantHash([
  //   socket.userId,
  //   recipientUserId,
  // ]);
  // let talkIdStatus = validateArguments({ talkId });
  // if (talkIdStatus) {
  //   let talkDataStatus = await Talk.exists({ _id: talkId, participantHash });
  //   if (!talkDataStatus) {
  //     return socket.emit('TALK::SEND', { status: false });
  //   }
  //
  //   Talk.updateOne(
  //     { _id: talkId },
  //     { $push: { chat: { user: socket.userId, message } } }
  //   )
  //     .then()
  //     .catch();
  //
  //   let user = {
  //     userId: socket.userId,
  //     ...socket.userInfo,
  //     isOnline: true,
  //   };
  //
  //   socket.emit('TALK::SEND', { status: true });
  //   return io.to([socket.userId, recipientUserId]).emit('TALK::NEW', {
  //     status: true,
  //     messageData: {
  //       user,
  //       message,
  //       timeStamp: Date.now(),
  //     },
  //   });
  // } else {
  //   // find talk id if not then create
  //   let talksMapKey = `talksMap.${recipientUserId}`;
  //   let talksMapData = await User.findOne({
  //     _id: socket.userId,
  //     [talksMapKey]: { $exists: true },
  //   })
  //     .select('talksMap')
  //     .lean()
  //     .exec();
  // }
}

module.exports = sendTalkHandler

// User.updateOne(
//   { _id: '61939fd315be8789059b4e11' },
//   {
//     $set: { 'talksMap.61939fd315be8789059b4e11': '6194896378d38b28a6007e33' },
//     $push: { talks: '6194899c069d101363d8afa1' },
//   }
// )
//   .then(console.log)
//   .catch(console.log);

// User.exists({
//   _id: '61939fd315be8789059b4e11',
//   'talksMap.61939fd3s15be8789059b4e11': { $exists: true },
// })
//   .then(console.log)
//   .catch(console.log);

// User.findOne({
//   _id: '61939fd315be8789059b4e11',
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
//   await sendTalkHandler(
//     {
//       to: () => {
//         return { emit: (event, data) => console.log('io :', event, data) };
//       },
//       emit: (event, data) => console.log('io :', event, data),
//     },
//     {
//       emit: (event, data) => console.log('socket :', event, data),
//       userId: '61939fd315be8789059b4e11',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { recipientUserId: '6193ac85ddb8456d8073c1f9', message: 'cool haha' }
//   );
//   console.log('sendTalkHandler :', Date.now() - t);
// }, 100);
