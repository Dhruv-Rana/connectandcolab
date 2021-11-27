const BOOLEAN = 'boolean'
const NUMBER = 'number'
const STRING = 'string'
const OBJECT_ID = 'objectId'

module.exports = {
  //////////////////////////////////////////////////////////////////////////////////////

  // Type Definitions For Functions
  typeDefs: {
    BOOLEAN,
    NUMBER,
    STRING,
    OBJECT_ID,
  },

  //////////////////////////////////////////////////////////////////////////////////////

  // HTTP

  // HTTP :: google_auth
  ga_token: STRING,

  // HTTP :: notes

  // HTTP :: notes :: create
  noteName: STRING,
  noteDescription: STRING,

  // HTTP :: notes :: get
  noteId: OBJECT_ID,

  // HTTP :: notes :: create
  // noteId: OBJECT_ID,
  // noteName: STRING,
  // noteDescription: STRING,

  //////////////////////////////////////////////////////////////////////////////////////

  // Socket

  // Socket :: POST

  // Socket :: POST :: LIST
  pageNumber: NUMBER,
  pageOffset: NUMBER,

  // Socket :: POST :: CREATE
  postTitle: STRING,
  postBody: STRING,

  // Socket :: POST :: GET
  postId: OBJECT_ID,

  // Socket :: POST :: ADD_COMMENT
  // postId: OBJECT_ID
  parentId: OBJECT_ID,
  commentBody: STRING,

  // Socket :: USER :: GET
  userId: OBJECT_ID,

  // Socket :: TALK :: GET
  // recipientUserId: OBJECT_ID,

  // Socket :: TALK :: SEND
  recipientUserId: OBJECT_ID,
  message: STRING,

  // Socket :: TALK :: LIST
  talkId: OBJECT_ID,

  //////////////////////////////////////////////////////////////////////////////////////
}
