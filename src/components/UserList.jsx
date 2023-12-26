import React, { useEffect, useState } from 'react'
import profileimg from "../assets/profile.png"
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue,set,push } from "firebase/database";
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';

const UserList = () => {
   const db = getDatabase();
   let [UserList,setUserList] = useState([])
   let [searchUserList,setSearchUserList] = useState([])
   let [frid,setFrid] = useState([])
   let [fid,setFid] = useState([])

   let userInfo = useSelector((state)=>state.activeUser.value)
   useEffect(()=>{
      const userRef = ref(db, 'users');
      onValue(userRef, (snapshot) => {
         let arr = []
         snapshot.forEach(item=>{
            if(item.key != userInfo.uid){

               arr.push({...item.val(),userid:item.key})
            }
           
            
         })
         setUserList(arr)
      });
   },[])

   useEffect(()=>{
      const friendRequestRef = ref(db, 'friendrequest');
      onValue(friendRequestRef, (snapshot) => {
         let arr = []
         snapshot.forEach(item=>{
               arr.push(item.val().whosendid+item.val().whoreceiveid)
         })
         setFrid(arr)
      });
   },[])

   
   useEffect(()=>{
      const friendRequestRef = ref(db, 'friends');
      onValue(friendRequestRef, (snapshot) => {
         let arr = []
         snapshot.forEach(item=>{
               arr.push(item.val().whosendid+item.val().whoreceiveid)
         })
         setFid(arr)
      });
   },[])

   let handlesearch = (e)=>{
    let user = UserList.filter(item=>item.username.toLowerCase().includes(e.target.value.toLowerCase()))
      setSearchUserList(user)
   }

   let handleFriend = (item)=>{

      set(push(ref(db, 'friendrequest')), {
         whosendid: userInfo.uid,
         whosendname: userInfo.displayName,
         whoreceiveid:item.userid,
         whoreceivename: item.username
       }).then(()=>{
         
       })
     
   }

  return (
    <div className='box'>
    <h2> User List</h2>
    <TextField onChange={handlesearch} id="outlined-basic" label="Search User" variant="outlined" />
    {searchUserList.length > 0
    ?
    searchUserList.map(item=>(
      <div className='list'>
       <img src={profileimg}/>
       <h3>{item.username}</h3>
       <Button variant="contained">+</Button>
    </div>
   ))
    :
    UserList.map(item=>(
      <div className='list'>
       <img src={item.profile_picture}/>
       <h3>{item.username}</h3>

       { frid.includes(userInfo.uid+item.userid) || frid.includes(item.userid+userInfo.uid)  
       ? 
       <Button variant="contained" disabled>pending</Button>
       :fid.includes(userInfo.uid+item.userid) || fid.includes(item.userid+userInfo.uid)
       ?
       <Button variant="contained" color='success'>Friends</Button>
       :
       <Button variant="contained" onClick={()=>handleFriend(item)}>+</Button>
       }
    </div>
   ))
    }
   {/* {UserList.map(item=>(
      <div className='list'>
       <img src={profileimg}/>
       <h3>{item.username}</h3>
       <Button variant="contained">Join</Button>
    </div>
   ))} */}

    
    
   </div>
  )
}

export default UserList
