const { Post } = require('./../../database/models')

const validateArguments = require('./../../utilities/validator')
const {
  objectIdToString,
  transformObjectIdMiddleware,
} = require('./../../utilities/helperFunctions')

/**
 * Listener => POST :: GET
 * Emitters => POST :: GET
 * Parameters => postId
 */

const getPostHandler = async (io, socket, data) => {
  let { postId } = data
  if (!validateArguments({ postId })) {
    return socket.emit('POST::GET', { status: false })
  }

  let postData = await Post.findOne({ _id: postId })
    .select('user postTitle postBody timeStamp comments -_id')
    .populate({
      path: 'user',
      select: '_id firstName lastName userImage isOnline',
      transform: (doc) => transformObjectIdMiddleware({ ...doc }, 'userId'),
      options: { lean: true },
    })
    .populate({
      path: 'comments',
      select: '_id commentBody parent timeStamp',
      transform: (doc) => {
        doc.commentId = objectIdToString(doc._id)
        doc.parentId = objectIdToString(doc.parent)
        delete doc._id
        delete doc.parent
        return doc
      },
      options: { lean: true },
      populate: {
        path: 'user',
        select: '_id firstName lastName userImage',
        transform: (doc) => transformObjectIdMiddleware({ ...doc }, 'userId'),
        options: { lean: true },
      },
    })
    .lean()
    .exec()

  if (!postData) {
    return socket.emit('POST::GET', { status: false })
  }

  postData.postId = postId

  return socket.emit('POST::GET', { status: true, postData })
}

module.exports = getPostHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await getPostHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61939fd315be8789059b4e11',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { postId: '61939ffc15be8789059b4e14' }
//   );
//   console.log('getPostHandler :', Date.now() - t);
// }, 100);
