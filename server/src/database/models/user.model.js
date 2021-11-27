const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  emailAddress: {
    type: mongoose.Schema.Types.String,
    trim: true,
    required: true,
  },
  userType: {
    type: mongoose.Schema.Types.String,
    enum: ['student', 'teacher', 'admin'],
    required: true,
  },
  firstName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  lastName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  loginType: {
    type: mongoose.Schema.Types.String,
    enum: ['email', 'google'],
    required: true,
  },
  phoneNumber: {
    type: mongoose.Schema.Types.String,
    trim: true,
  },
  isOnline: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  lastOnline: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  userImage: {
    type: mongoose.Schema.Types.String,
    trim: true,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
  ],
  talksMap: {},
  talks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Talk',
      required: true,
    },
  ],
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true,
    },
  ],
})

const User = mongoose.model('User', UserSchema)

module.exports = User
