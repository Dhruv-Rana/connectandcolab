import * as React from 'react'

import { Tabs, Tab, Box, Typography } from '@mui/material'
import { Container, Modal, Spinner } from 'react-bootstrap'

import Blogs from '../Blogs'
import Talks from '../Talks'
import Notes from '../Notes'
import Logout from '../Logout'

import socket from '../../socket'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

class BasicTabs extends React.Component {
  state = {
    value: 0,
    isOnline: false,
    showModal: false,
    modalProps: {
      fullscreen: true,
    },
    modalContent: null,
  }

  openModal = (modalContent) => {
    this.setState({
      showModal: true,
      modalContent,
    })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      modalContent: null,
    })
  }

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    })
  }

  timeoutRef = null
  componentDidMount() {
    const onConnect = () => {
      this.timeoutRef && clearInterval(this.timeoutRef)
      // console.log('connected')
      this.setState({
        isOnline: true,
      })
    }

    const onDisconnect = () => {
      // console.log('disconnected')
      this.setState({
        isOnline: false,
      })
      this.timeoutRef = setInterval(() => {
        socket.connect()
        // console.log('connect called in loader')
      }, 3000)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('error', () => window.location.reload())

    socket.connect()
  }

  componentWillUnmount() {
    this.timeoutRef && clearInterval(this.timeoutRef)

    socket.removeAllListeners('disconnect')
    socket.disconnect()

    socket.removeAllListeners('connect')

    socket.removeAllListeners('error')
  }

  render() {
    const value = this.state.value
    return (
      <>
        {!this.state.isOnline ? (
          <Modal show={true} fullscreen={true}>
            <Container
              fluid={'xxl'}
              className={'h-100'}
              style={{
                display: 'flex',
                height: '100%',
                justifyItems: 'center',
                alignItems: 'center',
              }}
            >
              <Spinner
                style={{ margin: 'auto' }}
                animation={'border'}
                variant={'dark'}
              />
            </Container>
          </Modal>
        ) : null}
        {this.state.showModal ? (
          <Modal
            show={true}
            fullscreen={this.state.modalProps.fullscreen}
            children={this.state.modalContent}
            scrollable={true}
            animation={false}
          />
        ) : null}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={this.handleChange}
              aria-label="basic tabs example"
              centered
            >
              <Tab label="Posts" {...a11yProps(0)} />

              <Tab label="Talks" {...a11yProps(1)} />
              <Tab label="Notes" {...a11yProps(2)} />
              <Tab label="Sign Out" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Blogs
              displayNotification={this.props.displayNotification}
              modalOperations={{
                openModal: this.openModal,
                closeModal: this.closeModal,
              }}
            />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Talks />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Notes />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Logout logout={this.props.logout} />
          </TabPanel>
        </Box>
      </>
    )
  }
}

export default BasicTabs
