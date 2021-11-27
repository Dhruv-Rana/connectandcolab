import React from 'react'
import { Grid, Box } from '@material-ui/core'

const CentreButton = (props) => {
  return (
    <Grid className="home">
      <Grid item xs={12} className="gridItem">
        <Box display="flex" alignItems="center" justifyContent="center">
          {props.children}
        </Box>
      </Grid>
    </Grid>
  )
}

export default CentreButton
