const mongoose = require('mongoose')
const databaseConfiguration = require('./../config/database')

const connectionConfiguration = {
  user: '',
  pass: '',
}

const connect = () => {
  return mongoose.connect(databaseConfiguration.dbURI)
}

const disconnect = () => mongoose.disconnect()

module.exports = {
  connect,
  disconnect,
}
