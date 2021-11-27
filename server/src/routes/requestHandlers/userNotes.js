const fs = require('fs')
const path = require('path')

const multer = require('multer')
const express = require('express')

const userNotesRouter = express.Router()

const io = require('./../../socket')

const { invalidRouteHandler } = require('./root')

const { User, Note } = require('../../database/models')

const { fileSize, uploadDir } = require('./../../config/multer_uploads')

const {
  objectIdToString,
  transformObjectIdMiddleware,
} = require('../../utilities/helperFunctions')
const validateArguments = require('../../utilities/validator')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize },
}).single('note')

userNotesRouter.post('/create', (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.sendStatus(413)
    } else if (err) {
      return res.sendStatus(500)
    }

    let { userId } = req.session

    let { noteName, noteDescription } = req.body
    if (!validateArguments({ noteName })) {
      return res.sendStatus(400)
    }
    if (!req.file) {
      return res.sendStatus(400)
    }
    if (noteDescription && !validateArguments({ noteDescription })) {
      return res.sendStatus(400)
    }

    let note = new Note({ user: userId, noteName, noteDescription })
    let { _id } = await note.save()

    fs.writeFileSync(
      path.join(uploadDir, `${objectIdToString(_id)}.pdf`),
      req.file.buffer
    )

    User.updateOne({ _id: userId }, { $push: { notes: _id } })
      .then()
      .catch()

    io.emit('NOTE::NEW', {
      status: true,
      noteData: { noteId: objectIdToString(_id), noteName, noteDescription },
    })

    return res.json({ status: true })
  })
})

userNotesRouter.post('/edit', (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.sendStatus(413)
    } else if (err) {
      return res.sendStatus(500)
    }

    let { userId } = req.session

    let { noteId, noteName, noteDescription } = req.body
    if (!validateArguments({ noteId, noteName })) {
      return res.sendStatus(400)
    }
    if (noteDescription && !validateArguments({ noteDescription })) {
      return res.sendStatus(400)
    }

    let noteStatus = await Note.exists({ _id: noteId, user: userId })
    if (!noteStatus) {
      return res.sendStatus(401)
    }

    if (req.file) {
      fs.writeFileSync(path.join(uploadDir, `${noteId}.pdf`), req.file.buffer)
    }

    await Note.updateOne({ _id: noteId }, { noteName, noteDescription })

    io.emit('NOTE::NEW', {
      status: true,
      noteData: { noteId, noteName, noteDescription },
    })

    return res.json({ status: true })
  })
})

userNotesRouter.post('/list', async (req, res) => {
  // let { userId } = req.session;

  // let userData = await User.findOne({ _id: userId })
  //   .select('notes')
  //   .populate({
  //     path: 'notes',
  //     select: '_id noteName noteDescription',
  //     transform: (doc) => transformObjectIdMiddleware({ ...doc }, 'noteId'),
  //   })
  //   .lean()
  //   .exec();

  let noteData = await Note.find(
    {},
    {},
    {
      sort: '-timeStamp',
      transform: (doc) =>
        doc.map((subDoc) =>
          transformObjectIdMiddleware({ ...subDoc }, 'noteId')
        ),
    }
  )
    .select('')
    .lean()
    .exec()

  return res.json({ status: true, noteData })
})

userNotesRouter.get('/get/:noteId', async (req, res) => {
  // let { userId } = req.session;

  let { noteId } = req.params
  if (!validateArguments({ noteId })) {
    return res.sendStatus(400)
  }

  let noteStatus = await Note.exists({ _id: noteId })
  // let noteStatus = await Note.exists({ _id: noteId, user: userId });
  if (noteStatus) {
    return res.sendFile(path.join(uploadDir, `${noteId}.pdf`))
  } else {
    return res.sendStatus(404)
  }
})

userNotesRouter.get('/*', invalidRouteHandler)

module.exports = userNotesRouter
