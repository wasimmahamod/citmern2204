import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid';
import GroupList from '../components/GroupList';
import FriendRequest from "../components/FriendRequest"
import Firends from "../components/Firends"
import Mygroups from '../components/Mygroups';
import UserList from '../components/UserList';
import Block from '../components/Block';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  let userData =useSelector((state)=>state.activeUser.value)
  let navigate = useNavigate()
  
  useEffect(()=>{
    if(userData == null){
      navigate("/login") 
    }
  },[])
  
  return (
    <Grid container spacing={2}>
        <Grid item xs={4}>
          <GroupList/>
          <FriendRequest/>
        </Grid>
        <Grid item xs={4}>
          <Firends/>
          <Mygroups/>
        </Grid>
        <Grid item xs={4}>
          <UserList/>
          <Block/>
        </Grid>
      
      </Grid>
  )
}

export default Home