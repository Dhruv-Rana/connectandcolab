import React, { useEffect } from 'react'

const Logout = (props) => {
  useEffect(() => {
    props.logout()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <></>
}

export default Logout
