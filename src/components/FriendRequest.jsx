import React, { useEffect, useState } from 'react'
import profileimg from "../assets/profile.png"
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue,remove,set,push } from "firebase/database";
import { useSelector } from 'react-redux';

const FriendRequest = () => {
   const db = getDatabase();
   const [requestList,setRequestList] = useState([])
   let userInfo = useSelector((state)=>state.activeUser.value)

   useEffect(()=>{
      const friendRequestRef = ref(db, 'friendrequest');
      onValue(friendRequestRef, (snapshot) => {
         let arr = []
         snapshot.forEach(item=>{
            if(userInfo.uid == item.val().whoreceiveid){

               arr.push({...item.val(),frid:item.key})
            }
         })
         setRequestList(arr)
      });
   },[])

   let handlecancel = (item)=>{
      console.log(item)
      remove(ref(db, 'friendrequest/'+item.frid))
   }

   let handleAccept = (item)=>{
      console.log("asd")
      set(push(ref(db, 'friends')), {
         ...item
       }).then(()=>{
         remove(ref(db, 'friendrequest/'+item.frid))
       })
   }


  return (
    <div className='box'>
     <h2>Friend Request</h2>
     {requestList.map(item=>(
      <div className='list'>
        <img src={profileimg}/>
        <h3>{item.whosendname}</h3>
        <Button variant="contained" onClick={()=>handleAccept(item)}>Accept</Button>
        <Button variant="contained" color='error' onClick={()=>handlecancel(item)}>Cancel</Button>
     </div>
     ))}
     
     
    </div>
  )
}

export default FriendRequest
