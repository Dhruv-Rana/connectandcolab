const onConnectHandler = require('./onConnect')
const onDisconnectHandler = require('./onDisconnect')

const testEventHandler = require('./testEvent')

module.exports = {
  onConnectHandler,
  onDisconnectHandler,

  testEventHandler,
}
