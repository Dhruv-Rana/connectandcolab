const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postTitle: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  postBody: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  timeStamp: {
    type: mongoose.Schema.Types.Number,
    default: Date.now,
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
  ],
})

PostSchema.plugin(mongoosePaginate)

const Post = mongoose.model('Post', PostSchema)

module.exports = Post
