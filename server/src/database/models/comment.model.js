const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentBody: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'parentModel',
    required: true,
  },
  parentModel: {
    type: mongoose.Schema.Types.String,
    required: true,
    enum: ['Post', 'Comment'],
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'Post',
    required: true,
  },
  timeStamp: {
    type: mongoose.Schema.Types.Number,
    default: Date.now,
    required: true,
  },

  // comments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Comment',
  //     required: true,
  //   },
  // ],
})

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
