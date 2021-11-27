const { User, Post, Comment } = require('./../../database/models')

const validateArguments = require('./../../utilities/validator')
const { objectIdToString } = require('../../utilities/helperFunctions')

/**
 * Listener   => POST :: ADD_COMMENT
 * Emitters   => POST :: ADD_COMMENT , ADD_COMMENT::${postId}
 * Parameters => postId, parentId, commentBody
 */

const addCommentPostHandler = async (io, socket, data) => {
  let { postId, parentId, commentBody } = data
  let parentModel = postId === parentId ? 'Post' : 'Comment'

  if (!validateArguments({ postId, parentId, commentBody })) {
    return socket.emit('POST::ADD_COMMENT', { status: false })
  }
  if (!(await Post.exists({ _id: postId }))) {
    return socket.emit('POST::ADD_COMMENT', { status: false })
  }
  if (parentModel === 'Comment' && !(await Comment.exists({ _id: parentId }))) {
    return socket.emit('POST::ADD_COMMENT', { status: false })
  }

  let thisTT = Date.now()
  let comment = new Comment({
    user: socket.userId,
    commentBody,
    parent: parentId,
    parentModel: postId === parentId ? 'Post' : 'Comment',
    post: postId,
    timeStamp: thisTT,
  })
  let { _id } = await comment.save()

  // await Post.updateOne({ _id: postId }, { $push: { comments: _id } });
  // await User.updateOne({ _id: socket.userId }, { $push: { comments: _id } });

  Post.updateOne({ _id: postId }, { $push: { comments: _id } })
    .then()
    .catch()
  User.updateOne({ _id: socket.userId }, { $push: { comments: _id } })
    .then()
    .catch()

  let user = {
    userId: socket.userId,
    ...socket.userInfo,
    isOnline: true,
  }

  let commentData = {
    commentId: objectIdToString(_id),
    postId,
    parentId,
    user,
    commentBody,
    timeStamp: thisTT,
  }

  socket.emit('POST::ADD_COMMENT', { status: true })
  return io.emit(`POST::ADD_COMMENT::${postId}`, { status: true, commentData })
}

module.exports = addCommentPostHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await addCommentPostHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61939fd315be8789059b4e11',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     {
//       postId: '61939ffc15be8789059b4e14',
//       parentId: '6194899c069d101363d8afa1',
//       commentBody: 'comment on level 1',
//     }
//   );
//   console.log('addCommentPostHandler :', Date.now() - t);
// }, 100);
