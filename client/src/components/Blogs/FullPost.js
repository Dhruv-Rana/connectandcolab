import React, { useState, useEffect, useRef } from 'react'

import { Button, Form, Card, Grid, Image, Ref } from 'semantic-ui-react'
import { Modal, Spinner } from 'react-bootstrap'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import moment from 'moment'

import Comments from './Comments'

import socket from '../../socket'

const FullPost = (props) => {
  const postId = props.postId

  const [isPostFetched, setIsPostFetched] = useState(false)

  const [addComment, setAddComment] = useState(false)
  const [commentReply, setCommentReply] = useState('')

  const [postData, setPostData] = useState({})
  const [comments, setComments] = useState([])

  const inputRef = useRef(null)

  useEffect(() => {
    socket.on('POST::GET', (data) => {
      //console.log('POST::GET :', data)
      if (data.status) {
        let { comments, postBody, postId, postTitle, timeStamp, user } =
          data.postData
        setPostData({ postBody, postId, postTitle, timeStamp, user })
        setComments([...comments])
        setIsPostFetched(true)
      } else {
        // TODO: handle false if any
      }
    })

    socket.on('POST::ADD_COMMENT', (data) => {
      //console.log('POST::ADD_COMMENT :', data)
    })

    return () => {
      socket.removeAllListeners('POST::GET')
      socket.removeAllListeners('POST::ADD_COMMENT')
    }
  }, [])

  useEffect(() => {
    socket.on(`POST::ADD_COMMENT::${postId}`, (data) => {
      //console.log(`POST::ADD_COMMENT::${postId} :`, data)
      setComments([...comments, data.commentData])
    })

    return () => {
      socket.removeAllListeners(`POST::ADD_COMMENT::${postId}`)
    }
  }, [comments]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (addComment) {
      inputRef.current && inputRef.current.children[0].focus()
    }
  }, [addComment])

  useEffect(() => {
    socket.emit('POST::GET', { postId })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePostComment = () => {
    if (commentReply === '') {
      alert('Comment cannot be Empty!')
      return
    }
    socket.emit('POST::ADD_COMMENT', {
      postId,
      parentId: postId,
      commentBody: commentReply,
    })
    setCommentReply('')
    setAddComment(false)
  }

  return (
    <Modal.Body>
      {isPostFetched ? (
        <Card style={{ width: '100%' }}>
          <Card.Header>{}</Card.Header>
          <Card.Content>
            <Grid columns={2}>
              <Grid.Column>
                <h2>Title : {postData.postTitle}</h2>
              </Grid.Column>
              <Grid.Column textAlign={'right'}>
                <Button primary onClick={props.closePost}>
                  Return to All Posts
                </Button>
              </Grid.Column>
            </Grid>
            <hr />
            <Grid columns={1}>
              <Grid.Column>
                <Grid.Row>
                  <h3>Content : </h3>
                </Grid.Row>
                <br />
                <Grid.Row>
                  <ReactQuill
                    theme={'snow'}
                    value={postData.postBody}
                    readOnly={true}
                    modules={{ toolbar: false }}
                  />
                </Grid.Row>
              </Grid.Column>
            </Grid>
            <hr />
            <Grid columns={8}>
              <Grid.Column textAlign={'right'} verticalAlign={'middle'}>
                <h4>User : </h4>
              </Grid.Column>
              <Grid.Column textAlign={'center'} verticalAlign={'middle'}>
                <Image
                  // TODO: remove default url
                  avatar={true}
                  centered={true}
                  size={'massive'}
                  src={postData.user.userImage}
                  className={'p-1'}
                />
              </Grid.Column>
              <Grid.Column textAlign={'left'} verticalAlign={'middle'}>
                <h5>
                  {`${postData.user.firstName} ${postData.user.lastName || ''}`}
                </h5>
              </Grid.Column>
              <Grid.Column>{''}</Grid.Column>
              <Grid.Column>{''}</Grid.Column>
              <Grid.Column>{''}</Grid.Column>
              <Grid.Column textAlign={'right'} verticalAlign={'middle'}>
                <b>{moment.unix(postData.timeStamp / 1000).format('HH:mm')}</b>
              </Grid.Column>
              <Grid.Column textAlign={'left'} verticalAlign={'middle'}>
                <b>
                  {moment.unix(postData.timeStamp / 1000).format('DD/MM/YYYY')}
                </b>
              </Grid.Column>
            </Grid>
            <hr />
            <Grid columns={3}>
              <Grid.Column>
                <h3>Comments : </h3>
              </Grid.Column>
              <Grid.Column>
                {addComment ? (
                  <Form>
                    <Ref innerRef={inputRef}>
                      <Form.TextArea
                        onChange={(e) => setCommentReply(e.target.value)}
                      />
                    </Ref>
                    <Button
                      primary
                      content="Add"
                      size={'small'}
                      onClick={handlePostComment}
                    />
                  </Form>
                ) : null}
              </Grid.Column>
              <Grid.Column textAlign={'right'}>
                <Button
                  color={addComment ? 'red' : 'blue'}
                  secondary={!addComment}
                  onClick={() => {
                    setAddComment(!addComment)
                  }}
                >
                  {!addComment ? 'Write Comment' : 'Cancel'}
                </Button>
              </Grid.Column>
            </Grid>
            <hr />
            <Grid columns={'equal'}>
              <Grid.Column width={1}>{''}</Grid.Column>
              <Grid.Column width={12}>
                <Comments comments={comments} postId={postId} />
              </Grid.Column>
            </Grid>
            <hr />
          </Card.Content>
        </Card>
      ) : (
        <Spinner
          style={{ justifySelf: 'center', alignSelf: 'center' }}
          animation="border"
          variant="info"
        />
      )}
    </Modal.Body>
  )
}

export default FullPost
