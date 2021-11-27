const mongoose = require('mongoose')

const objectIdToString = (idRef) => {
  return mongoose.Types.ObjectId(idRef).toString()
}

const transformObjectIdMiddleware = (doc, newIdName) => {
  doc[newIdName] = objectIdToString(doc._id)
  delete doc._id
  return doc
}

module.exports = {
  objectIdToString,
  transformObjectIdMiddleware,
}
