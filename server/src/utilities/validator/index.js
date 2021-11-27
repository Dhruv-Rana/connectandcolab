const mongoose = require('mongoose')

const argumentTypes = require('./../../config/validator')

const isNotEmpty = (value) => {
  return value !== undefined && value !== null
}

const isBoolean = (value) => {
  return isNotEmpty(value) && typeof value === 'boolean'
}

const isNumber = (value) => {
  return isNotEmpty(value) && typeof value === 'number'
}

const isString = (value) => {
  return isNotEmpty(value) && typeof value === 'string' && value.length > 0
}

const isObjectId = (value) => {
  return isNotEmpty(value) && mongoose.Types.ObjectId.isValid(value)
}

const validatorTypeFunctions = {
  [argumentTypes.typeDefs.BOOLEAN]: isBoolean,
  [argumentTypes.typeDefs.NUMBER]: isNumber,
  [argumentTypes.typeDefs.STRING]: isString,
  [argumentTypes.typeDefs.OBJECT_ID]: isObjectId,
}

const validateArguments = (argumentObject) => {
  let status = true
  let argumentNames = Object.keys(argumentObject)
  for (let i = 0; i < argumentNames.length; i++) {
    let functionReference =
      validatorTypeFunctions[argumentTypes[argumentNames[i]]]
    if (!functionReference(argumentObject[argumentNames[i]])) {
      // TODO: remove
      // console.log(
      //   'argumentObject break :',
      //   argumentNames[i],
      //   argumentObject[argumentNames[i]]
      // );
      status = false
      break
    }
  }
  return status
}

module.exports = validateArguments
