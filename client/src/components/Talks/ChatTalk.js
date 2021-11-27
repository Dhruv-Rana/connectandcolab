import React, { useState, useEffect, useRef } from 'react'

import { Input } from 'react-chat-elements'
import { Grid, Button, Card, Image } from 'semantic-ui-react'
import { Modal, Spinner } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'

import 'react-chat-elements/dist/main.css'

import socket from '../../socket'
import moment from 'moment'

const ChatTalk = (props) => {
  const talkUser = props.talkUser
  const [talkId, setTalkId] = useState(props.talkId)
  const [waitForFirstTalk, setWaitForFirstTalk] = useState(!props.talkId)
  const [chat, setChat] = useState([])
  const [isTalkLoaded, setIsTalkLoaded] = useState(false)

  const [message, setMessage] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {
    socket.on('TALK::GET', (data) => {
      // console.log('TALK::GET :', data)
      if (data.status) {
        setChat([...data.talkData.chat.reverse()])
        setIsTalkLoaded(true)
      } else {
        setIsTalkLoaded(true)
      }
    })

    return () => {
      socket.removeAllListeners('TALK::GET')
    }
  }, [props.userId])

  useEffect(() => {
    socket.on('TALK::SEND', (data) => {
      // console.log('TALK::SEND :', data)
    })

    return () => {
      socket.removeAllListeners('TALK::SEND')
    }
  })

  useEffect(() => {
    let newTalkData = props.newTalk
    if (waitForFirstTalk && newTalkData) {
      setChat([newTalkData])
      setWaitForFirstTalk(false)
      setTalkId(newTalkData.talkId)
      props.setTalkId(newTalkData.talkId)
      props.setNewTalk(null)
    } else {
      if (newTalkData && newTalkData.talkId === talkId) {
        setChat([newTalkData, ...chat])
        props.setNewTalk(null)
      }
    }
  }, [chat, props, props.newTalk, talkId, waitForFirstTalk])

  useEffect(() => {
    socket.emit('TALK::GET', { recipientUserId: talkUser.userId })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal.Body>
      <Card style={{ width: '100%' }}>
        <Card.Content>
          <Grid columns={2}>
            <Grid.Column>
              <Grid columns={4}>
                <Grid.Column textAlign={'center'} verticalAlign={'middle'}>
                  <Image
                    // TODO: remove default url
                    avatar={true}
                    centered={true}
                    size={'massive'}
                    src={talkUser.userImage}
                    className={'p-1'}
                  />
                </Grid.Column>
                <Grid.Column textAlign={'right'} verticalAlign={'middle'}>
                  <h5>{`${talkUser.firstName}`}</h5>
                </Grid.Column>
                <Grid.Column textAlign={'left'} verticalAlign={'middle'}>
                  <h5>{`${talkUser.lastName || ''}`}</h5>
                </Grid.Column>
                <Grid.Column>{''}</Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column textAlign={'right'}>
              <Button
                primary
                onClick={() => {
                  props.setTalkId(null)
                  props.setModalOpen(false)
                }}
              >
                Back To Talks
              </Button>
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content>
          {isTalkLoaded ? (
            <div
              style={{
                height: 450,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
              }}
              className={'w-100'}
              id="scrollablePostDiv"
            >
              <InfiniteScroll
                className={'w-100'}
                dataLength={chat.length}
                hasMore={false}
                loader={<></>}
                next={() => {}}
                scrollableTarget={'scrollablePostDiv'}
                style={{
                  padding: 10,
                  width: '100%',
                  height: 450,
                  overflowX: 'hidden',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                }}
              >
                {chat.map((cm, i) => {
                  return (
                    <Grid columns={1} key={i}>
                      <Grid.Column className={'w-100 mt-3 mb-0'}>
                        <Card
                          style={{
                            float:
                              cm.user !== talkUser.userId ? 'right' : 'left',
                          }}
                        >
                          <Card.Content
                            textAlign={
                              cm.user !== talkUser.userId ? 'right' : 'left'
                            }
                            style={{
                              backgroundColor: 'whitesmoke',
                              margin: 0,
                            }}
                          >
                            <h4>{cm.message}</h4>
                          </Card.Content>
                          <Card.Meta
                            textAlign={
                              cm.user !== talkUser.userId ? 'right' : 'left'
                            }
                            style={{
                              backgroundColor: 'whitesmoke',
                              paddingTop: 0,
                              paddingBottom: 0,
                              marginTop: 0,
                              marginBottom: 0,
                            }}
                          >
                            {moment
                              .unix(cm.timeStamp / 1000)
                              .format('HH:mm DD/MM/YY')}
                          </Card.Meta>
                        </Card>
                      </Grid.Column>
                    </Grid>
                  )
                })}
              </InfiniteScroll>
            </div>
          ) : (
            <Spinner animation={'border'} />
          )}
        </Card.Content>
        <Card.Content>
          <Input
            multiline
            autoHeight
            maxHeight={50}
            ref={inputRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            autofocus={true}
            placeholder="Type Your Message Here"
            rightButtons={
              <Button
                disabled={!message}
                primary
                onClick={() => {
                  socket.emit('TALK::SEND', {
                    recipientUserId: talkUser.userId,
                    message,
                  })
                  setMessage('')
                  inputRef.current.input.value = ''
                  inputRef.current.input.focus()
                }}
              >
                Send
              </Button>
            }
          />
        </Card.Content>
      </Card>
    </Modal.Body>
  )
}

export default ChatTalk
