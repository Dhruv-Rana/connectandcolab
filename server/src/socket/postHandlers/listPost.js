const { Post } = require('./../../database/models')

const validateArguments = require('./../../utilities/validator')
const {
  transformObjectIdMiddleware,
} = require('./../../utilities/helperFunctions')

/**
 * Listener => POST :: LIST
 * Emitters => POST :: LIST
 * Parameters => pageNumber, pageOffset
 */

const listPostHandler = async (io, socket, data) => {
  let { pageOffset } = data
  if (!validateArguments({ pageOffset })) {
    return socket.emit('POST::LIST', { status: false })
  }

  let { posts, postCount, page, totalPages, prevPage, nextPage } =
    await Post.paginate(
      {},
      {
        lean: true,
        leanWithId: false,
        select: '_id user postTitle postBody timeStamp',
        sort: '-timeStamp',
        populate: {
          path: 'user',
          select: '_id firstName lastName userImage isOnline',
          transform: (doc) => transformObjectIdMiddleware({ ...doc }, 'userId'),
          options: { lean: true },
        },
        offset: pageOffset,
        limit: 20,
        allowDiskUse: true,
        customLabels: {
          docs: 'posts',
          totalDocs: 'postCount',
        },
        options: {
          transform: (doc) =>
            doc.map((subDoc) =>
              transformObjectIdMiddleware({ ...subDoc }, 'postId')
            ),
        },
      }
    )

  return socket.emit('POST::LIST', {
    status: true,
    posts,
    postCount,
    page,
    totalPages,
    prevPage,
    nextPage,
  })
}

module.exports = listPostHandler

// TODO: remove
// setTimeout(async () => {
//   let t = Date.now();
//   await listPostHandler(
//     { emit: (event, data) => console.log(event, data) },
//     {
//       emit: (event, data) => console.log(event, data),
//       userId: '61939fd315be8789059b4e11',
//       userInfo: { firstName: 'Parth', lastName: 'Rana', userImage: 'xyz' },
//     },
//     { pageNumber: 1 }
//   );
//   console.log('listPostHandler :', Date.now() - t);
// }, 100);
