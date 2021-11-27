const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')

const mongoClientStore = MongoStore.create({
  client: mongoose.connection.getClient(),
})

module.exports = mongoClientStore
