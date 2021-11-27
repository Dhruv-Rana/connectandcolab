import React, { useState, useEffect } from 'react'

import { ChatList } from 'react-chat-elements'
import { Grid, Button, Card } from 'semantic-ui-react'
import { Modal, Spinner } from 'react-bootstrap'

import 'react-chat-elements/dist/main.css'

import socket from '../../socket'

const NewTalk = (props) => {
  const [users, setUsers] = useState([])
  const [isListLoaded, setIsListLoaded] = useState(false)

  useEffect(() => {
    socket.on('USER::LIST', (data) => {
      // console.log('USER::LIST :', data)
      if (data.status) {
        let userData = data.userData.filter(
          (user) => user.userId !== props.userId
        )
        setUsers([...userData])
        setIsListLoaded(true)
      } else {
        // TODO: handle false
      }
    })

    return () => {
      socket.removeAllListeners('USER::LIST')
    }
  }, [props.userId])

  useEffect(() => {
    socket.emit('USER::LIST', {})
  }, [])

  return (
    <Modal.Body>
      <Card style={{ width: '100%' }}>
        <Card.Content>
          <Grid columns={2}>
            <Grid.Column>
              <h3>Select User To Start Talk</h3>
            </Grid.Column>
            <Grid.Column textAlign={'right'}>
              <Button color={'red'} onClick={() => props.setModalOpen(false)}>
                Cancel
              </Button>
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content>
          {isListLoaded ? (
            <ChatList
              onClick={(chat) => {
                props.setTalkUser(chat.userData)
                props.setModalType(0)
                props.setModalOpen(true)
              }}
              dataSource={users.map((user) => {
                return {
                  avatar: user.userImage,
                  alt: user.firstName + ' ' + user.lastName,
                  title: user.firstName + ' ' + user.lastName,
                  subtitle: user.isOnline ? 'Online' : 'Offline',
                  date: user.isOnline ? Date.now() : user.lastOnline,
                  userId: user.userId,
                  userData: user,
                }
              })}
            />
          ) : (
            <Spinner animation={'border'} />
          )}
        </Card.Content>
      </Card>
    </Modal.Body>
  )
}

export default NewTalk
