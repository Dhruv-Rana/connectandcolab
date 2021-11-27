const crypto = require('crypto')
const mongoose = require('mongoose')

const {
  salt,
  iterations,
  keyLength,
  digest,
  outputEncoding,
} = require('../../config/crypter')

const TalkSchema = new mongoose.Schema({
  participant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  participantHash: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  chat: [
    {
      _id: false,
      // messageId: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   default: new mongoose.Types.ObjectId().toHexString(),
      //   required: true,
      // },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
      timeStamp: {
        type: mongoose.Schema.Types.Number,
        default: Date.now,
        required: true,
      },
    },
  ],
  lastChat: {
    user: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  lastActivity: {
    type: mongoose.Schema.Types.Number,
    default: Date.now,
    required: true,
  },
})

TalkSchema.static('getParticipantHash', (participant) => {
  return crypto
    .pbkdf2Sync(participant, salt, iterations, keyLength, digest)
    .toString(outputEncoding)
})

const Talk = mongoose.model('Talk', TalkSchema)

module.exports = Talk
