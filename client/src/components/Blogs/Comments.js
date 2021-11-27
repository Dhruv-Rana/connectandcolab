import React, { useEffect, useRef, useState } from 'react'
import { Button, Comment, Form, Ref } from 'semantic-ui-react'
import moment from 'moment'

import socket from '../../socket'

const Comments = (props) => {
  const [replyCommentId, setReplyCommentId] = useState(null)
  const [reply, setReply] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {
    if (replyCommentId) {
      inputRef.current && inputRef.current.children[0].focus()
    }
  }, [replyCommentId])

  const handleAddReply = () => {
    if (reply === '') {
      alert('Comment cannot be empty!')
      return
    }
    socket.emit('POST::ADD_COMMENT', {
      postId: props.postId,
      parentId: replyCommentId,
      commentBody: reply,
    })
    setReply('')
    setReplyCommentId(null)
  }

  const renderComments = (postId, comments) => {
    if (comments.length === 0) {
      return ''
    }
    if (postId === null) {
      return ''
    }
    const n = comments.length
    const tree = []
    for (let i = 0; i < n + 1; i++) {
      tree.push([])
    }
    let map = new Map()
    for (let i = 0; i < n; i++) {
      map.set(comments[i].commentId, i)
    }
    map.set(postId, n)
    for (let i = 0; i < n; i++) {
      let u = map.get(comments[i].commentId)
      let v = map.get(comments[i].parentId)
      tree[v].push(u)
    }

    const dfs = (u) => {
      tree[u].sort((a, b) => {
        return a.timeStamp < b.timeStamp
      })

      return (
        <Comment.Group
          style={{ paddingBottom: 0, marginTop: 2, marginBottom: 2 }}
        >
          {tree[u].map((child) => {
            return (
              <Comment
                style={{
                  paddingBottom: 0,
                  paddingTop: 0,
                  marginTop: 2,
                  marginBottom: 2,
                }}
                key={comments[child].commentId}
              >
                <Comment.Avatar src={comments[child].user.userImage} />
                <Comment.Content>
                  <Comment.Author as="span">{`${comments[child].user.firstName} ${comments[child].user.lastName}`}</Comment.Author>
                  <Comment.Metadata>
                    <span style={{ fontWeight: 700 }}>
                      {moment
                        .unix(comments[child].timeStamp / 1000)
                        .format('HH:mm  DD/MM/YYYY')}
                    </span>
                  </Comment.Metadata>
                  <Comment.Text>{comments[child].commentBody}</Comment.Text>
                  <Comment.Actions>
                    <Comment.Action
                      onClick={() =>
                        setReplyCommentId(comments[child].commentId)
                      }
                    >
                      <span style={{ fontWeight: 700 }}>Reply</span>
                    </Comment.Action>
                  </Comment.Actions>
                  {replyCommentId === comments[child].commentId ? (
                    <Form>
                      <Ref innerRef={inputRef}>
                        <Form.TextArea
                          onChange={(e) => setReply(e.target.value)}
                        />
                      </Ref>
                      <Button
                        primary
                        type={'button'}
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        onClick={handleAddReply}
                      />
                      <Button
                        color="red"
                        type={'button'}
                        content="Cancel"
                        onClick={() => {
                          setReply('')
                          setReplyCommentId(null)
                        }}
                      />
                    </Form>
                  ) : null}
                </Comment.Content>
                {dfs(child)}
              </Comment>
            )
          })}
        </Comment.Group>
      )
    }

    return dfs(n)
  }

  return renderComments(props.postId, props.comments)
}

export default Comments
