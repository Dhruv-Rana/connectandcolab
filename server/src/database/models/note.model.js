const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  noteName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  noteDescription: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  timeStamp: {
    type: mongoose.Schema.Types.Number,
    default: Date.now,
    required: true,
  },
})

const Note = mongoose.model('Note', NoteSchema)

module.exports = Note
