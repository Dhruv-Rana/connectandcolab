import React, { useState, useEffect } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import axios from './api'

import { Alert, Snackbar } from '@mui/material'
import { Spinner, Container } from 'react-bootstrap'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [notification, setNotification] = useState({ open: false })
  const [isSessionChecked, setIsSessionChecked] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = () => {
    axios
      .post('/ref_session', '')
      .then((response) => {
        // console.log(`/ref_session :`, response.data)
        setIsSessionChecked(true)
        if (response.data.status) {
          setIsAuthenticated(true)
        }
      })
      .catch((err) => {
        setIsSessionChecked(true)
        // console.log('/ref_session :', err)
      })
  }

  const login = async (googleAuthResponse) => {
    try {
      const { data } = await axios.post('/google_auth', {
        ga_token: googleAuthResponse.tokenId,
      })
      // console.log(`/google_auth :`, data)
      if (data.status) {
        setIsAuthenticated(true)
      }
    } catch (err) {
      // console.log('/google_auth :', err)
    }
  }

  const logout = async () => {
    try {
      const { data } = await axios.post('/logout', '')
      // console.log(`/logout :`, data)
      if (data.status) {
        setIsAuthenticated(false)
      }
    } catch (err) {
      // console.log('/logout :', err)
    }
  }

  const displayNotification = (severity, message, autoHideDuration = 5000) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration,
    })
  }

  return (
    <>
      {isSessionChecked ? (
        isAuthenticated ? (
          <Home logout={logout} displayNotification={displayNotification} />
        ) : (
          <Login login={login} displayNotification={displayNotification} />
        )
      ) : (
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
      )}

      {notification.open ? (
        <Snackbar
          open={true}
          autoHideDuration={notification.autoHideDuration}
          onClose={() => setNotification({ open: false })}
        >
          <Alert severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      ) : null}
    </>
  )
}

export default App
