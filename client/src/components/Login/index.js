import React from 'react'
import { Typography, Grid, Box } from '@material-ui/core'
import GoogleLogin from 'react-google-login'

import { clientId } from '../../config'
import Logo from '../../assets/colab.jpg'

const Login = (props) => {
  return (
    <Grid className="home">
      <Grid item xs={12} className="gridItem">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h3">
            <br />
            <br />
            <i>
              <b>Welcome to Connect and Colab!</b>
            </i>
          </Typography>
        </Box>
      </Grid>
      <br />
      <br />
      <Grid item xs={12} className="gridItem">
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h5" color="textSecondary">
            <img src={Logo} alt="Logo" />
          </Typography>
        </Box>
      </Grid>
      <br />
      <br />
      <Grid item xs={12} className="gridItem">
        <Box display="flex" alignItems="center" justifyContent="center">
          <GoogleLogin
            clientId={clientId}
            buttonText={'Sign In With Google'}
            onSuccess={props.login}
            onFailure={(err) => console.log('GoogleLogin :', err)}
            cookiePolicy={'single_host_origin'}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default Login
