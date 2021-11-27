const { OAuth2Client } = require('google-auth-library')

const { User } = require('./../../database/models')

const { CLIENT_ID } = require('./../../config/google_auth')

const logger = require('./../../utilities/logger')
const validateArguments = require('../../utilities/validator')

/**
 * Helper Functions For Handler
 */

// TODO: remove userData prop
const client = new OAuth2Client(CLIENT_ID)
const verifyGoogleUserIdentity = async (ga_token, userData = {}) => {
  try {
    let ticket = await client.verifyIdToken({
      idToken: ga_token,
      audience: CLIENT_ID,
    })
    let payload = ticket.getPayload()
    let { email, name, given_name, family_name, picture } = payload
    let user = {
      emailAddress: email,
      firstName: given_name || name,
      lastName: family_name || '',
      userImage: picture || '',
    }

    return { status: true, user }
  } catch (err) {
    // logger(1, __filename, 'verifyGoogleUserIdentity', err);
    // return { status: true, user: userData }
    return { status: false }
  }
}

const saveSession = (session) => {
  return new Promise((resolve) => {
    session.save((err) => {
      if (err) {
        logger(1, __filename, 'SESSION SAVE', err)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * User Login Through Google Auth Token Handler
 * Parameters => idToken<string>
 */

const googleAuthHandler = async (req, res) => {
  let { ga_token } = req.body
  if (!validateArguments({ ga_token })) {
    return res.sendStatus(400)
  }

  // TODO: temp user info passing to function verifyGoogleUserIdentity
  let verificationDetails = await verifyGoogleUserIdentity(
    ga_token,
    req.body.user
  )

  if (verificationDetails.status) {
    let userData = await User.findOne({
      emailAddress: verificationDetails.user.emailAddress,
    })
      .lean()
      .exec()

    if (userData) {
      if (req.session.isAuthenticated && req.session.userId) {
        let userBody = {
          firstName: verificationDetails.user.firstName,
          lastName: verificationDetails.user.lastName,
          phoneNumber: verificationDetails.user.phoneNumber,
          userImage: verificationDetails.user.userImage,
        }

        await User.updateOne({ _id: userData._id }, userBody)

        return res.json({ status: true })
      }
    } else {
      let userBody = {
        emailAddress: verificationDetails.user.emailAddress,
        userType: 'student',
        firstName: verificationDetails.user.firstName,
        lastName: verificationDetails.user.lastName,
        loginType: 'google',
        phoneNumber: verificationDetails.user.phoneNumber,
        userImage: verificationDetails.user.userImage,
      }

      try {
        let user = new User(userBody)
        userData = await user.save()
      } catch (err) {
        logger(1, __filename, 'USER SAVE', err)
        return res.sendStatus(500)
      }
    }

    req.session.userId = userData._id
    req.session.isAuthenticated = true

    let sessionStatus = await saveSession(req.session)
    if (sessionStatus) {
      return res.json({ status: true })
    } else {
      return res.sendStatus(500)
    }
  } else {
    return res.sendStatus(400)
  }
}

module.exports = googleAuthHandler

/**
 * Initial Dummy Function Call To verifyGoogleUserIdentity So It Gets Initialize/Active Properly
 */

verifyGoogleUserIdentity('dummy_token', {}).then().catch()
