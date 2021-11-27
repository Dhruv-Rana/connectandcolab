const { User, Post } = require('./../../database/models')

const validateArguments = require('./../../utilities/validator')
const { objectIdToString } = require('./../../utilities/helperFunctions')

/**
 * Listener   => POST :: CREATE
 * Emitters   => POST :: CREATE , NEW
 * Parameters => postTitle, postBody
 */

const createPostHandler = async (io, socket, data) => {
  let { postTitle, postBody } = data
  if (!validateArguments({ postTitle, postBody })) {
    return socket.emit('POST::CREATE', { status: false })
  }

  let post = new Post({ user: socket.userId, postTitle, postBody })
  let { _id, timeStamp } = await post.save()

  User.updateOne({ _id: socket.userId }, { $push: { posts: _id } })
    .then()
    .catch()

  let user = {
    userId: socket.userId,
    ...socket.userInfo,
    isOnline: true,
  }

  let postData = {
    postId: objectIdToString(_id),
    postTitle,
    postBody,
    timeStamp,
    user,
  }

  socket.emit('POST::CREATE', { status: true })
  return io.emit('POST::NEW', { status: true, postData })
}

module.exports = createPostHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await createPostHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61939fd315be8789059b4e11',
//     },
//     { postTitle: 'Title ' + Math.random(), postBody: 'Body ' + Math.random() }
//   );
//   console.log('createPostHandler :', Date.now() - t);
// }, 100);
