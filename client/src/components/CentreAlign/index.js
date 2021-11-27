import React from 'react'
import { Grid, Box } from '@material-ui/core'

const CentreAlign = (props) => {
  return (
    <Grid item xs={12} className="gridItem">
      <Box display="flex" alignItems="center" justifyContent="center">
        {props.children}
      </Box>
    </Grid>
  )
}

export default CentreAlign
