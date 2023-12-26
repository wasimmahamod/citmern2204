import React from 'react'
import Grid from '@mui/material/Grid';
import Firends from '../components/Firends';
import GroupList from '../components/GroupList';
import ChatMsg from '../components/ChatMsg';
const Msg = () => {
  return (
    <Grid container spacing={2}>
        <Grid item xs={4}>
          <GroupList/>
        <Firends/>
        </Grid>
        <Grid item xs={8}>
       <ChatMsg/>
        </Grid>
     
      
      </Grid>
  )
}

export default Msg
