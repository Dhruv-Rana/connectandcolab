import React, { useState, useEffect } from 'react'

import { ChatList } from 'react-chat-elements'
import { Grid, Button } from 'semantic-ui-react'
import { Modal } from 'react-bootstrap'

import 'react-chat-elements/dist/main.css'

import socket from '../../socket'

import NewTalk from './NewTalk'
import ChatTalk from './ChatTalk'

const Talks = () => {
  const [userId, setUserId] = useState()
  const [talks, setTalks] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState(0)
  const [talkId, setTalkId] = useState(null)
  const [talkUser, setTalkUser] = useState(null)

  const [newTalk, setNewTalk] = useState(null)

  useEffect(() => {
    socket.on('TALK::LIST', (data) => {
      // console.log('TALK::LIST :', data)
      if (data.status) {
        setUserId(data.userId)
        setTalks([
          ...data.talkData.sort((a, b) =>
            a.lastActivity < b.lastActivity ? 1 : -1
          ),
        ])
      } else {
        // TODO: handle false
      }
    })

    return () => {
      socket.removeAllListeners('TALK::LIST')
    }
  }, [])

  useEffect(() => {
    socket.on('TALK::NEW', (data) => {
      // console.log('TALK::NEW :', data)
      if (data.status) {
        let { user, message, timeStamp } = data.messageData
        setNewTalk({
          user: user.userId,
          message,
          timeStamp,
          talkId: data.talkId,
        })
      }
    })

    return () => {
      socket.removeAllListeners('TALK::NEW')
    }
  }, [])

  useEffect(() => {
    if (newTalk) {
      let isExists = talks.findIndex((talk) => talk.talkId === newTalk.talkId)
      if (isExists !== -1) {
        if (!talkId) {
          setNewTalk(null)
        } else {
          if (talkId !== newTalk.talkId) {
            setNewTalk(null)
          }
        }

        socket.emit('TALK::LIST')
      } else {
        setNewTalk(null)
        socket.emit('TALK::LIST')
      }
    }
  }, [newTalk, talkId, talks])

  useEffect(() => {
    socket.emit('TALK::LIST')
  }, [])

  return (
    <>
      {modalOpen ? (
        <Modal
          show={true}
          keyboard={false}
          scrollable={true}
          animation={false}
          size={'xl'}
        >
          {modalType ? (
            <NewTalk
              userId={userId}
              setModalOpen={setModalOpen}
              setModalType={setModalType}
              setTalkUser={setTalkUser}
            />
          ) : (
            <ChatTalk
              userId={userId}
              talkId={talkId}
              talkUser={talkUser}
              newTalk={newTalk}
              setTalkId={setTalkId}
              setNewTalk={setNewTalk}
              setModalOpen={setModalOpen}
            />
          )}
        </Modal>
      ) : null}
      <Grid columns={1}>
        <Grid.Column>
          <Grid columns={1}>
            <Grid.Column textAlign={'center'}>
              <Button
                primary
                onClick={() => {
                  setModalType(1)
                  setModalOpen(true)
                }}
              >
                New Talk
              </Button>
            </Grid.Column>
          </Grid>
          <hr />
          <Grid columns={1}>
            <Grid.Column>
              {talks.length ? (
                <ChatList
                  onClick={(talk) => {
                    setTalkId(talk.talkId)
                    setTalkUser(talk.userData)
                    setModalType(0)
                    setModalOpen(true)
                  }}
                  dataSource={talks.map((talk) => {
                    let recipientUser = talk.participant.find((user) => {
                      return user.userId !== userId
                    })
                    return {
                      avatar: recipientUser.userImage,
                      alt:
                        recipientUser.firstName + ' ' + recipientUser.lastName,
                      title:
                        recipientUser.firstName + ' ' + recipientUser.lastName,
                      subtitle:
                        talk.lastChat.message.length > 50
                          ? talk.lastChat.message.slice(0, 50) + '....'
                          : talk.lastChat.message,
                      date: talk.lastActivity,
                      talkId: talk.talkId,
                      userData: recipientUser,
                    }
                  })}
                />
              ) : (
                <Grid columns={1}>
                  <Grid.Column textAlign={'center'}>
                    <h3>{'Empty !'}</h3>
                    <h3>{'Start New Talk ! 😁'}</h3>
                  </Grid.Column>
                </Grid>
              )}
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>
    </>
  )
}

export default Talks
