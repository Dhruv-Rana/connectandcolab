const crypto = require('crypto')

const {
  algorithm,
  inputEncoding,
  outputEncoding,
  key,
  iv,
} = require('./../../config/crypter')

const encryptAsync = (dataToEncrypt) => {
  return new Promise((resolve) => {
    try {
      let cipher = crypto.createCipheriv(algorithm, key, iv)
      let encrypted = cipher.update(
        dataToEncrypt,
        inputEncoding,
        outputEncoding
      )
      encrypted += cipher.final(outputEncoding)
      resolve({ status: true, data: encrypted })
    } catch (err) {
      resolve({ status: false })
    }
  })
}

const decryptAsync = (dataToDecrypt) => {
  return new Promise((resolve) => {
    try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv)
      let decrypted = decipher.update(
        dataToDecrypt,
        outputEncoding,
        inputEncoding
      )
      decrypted += decipher.final(inputEncoding)

      resolve({ status: true, data: decrypted })
    } catch (err) {
      resolve({ status: false })
    }
  })
}

module.exports = {
  encryptAsync,
  decryptAsync,
}
