import React, { useEffect, useState } from 'react'
import profileimg from "../assets/profile.png"
import Button from '@mui/material/Button';
import { useSelector ,useDispatch} from 'react-redux';
import { getDatabase, ref, onValue,remove,set,push } from "firebase/database";
import { chatUserInfo } from '../slices/chatSlice';
const Firends = () => {
   const dispatch = useDispatch()
   const db = getDatabase();
   let userInfo = useSelector((state)=>state.activeUser.value)
   let [friendList,setFriendList]=useState([])

   
   useEffect(()=>{
      const friendRef = ref(db, 'friends');
      onValue(friendRef, (snapshot) => {
         let arr = []
         snapshot.forEach(item=>{
            if(userInfo.uid == item.val().whosendid || userInfo.uid ==item.val().whoreceiveid){
               arr.push({...item.val(),id:item.key})

            }
         })
         setFriendList(arr)
      });
   },[])

   let handleBlock=(item)=>{
      console.log(item.id);
      if(userInfo.uid == item.whosendid){
         set(push(ref(db, 'block')), {
            id:item.id,
            blockby:userInfo.displayName,
            blockbyid:userInfo.uid,
            block:item.whoreceivename,
            blockid:item.whoreceiveid,
          }).then(()=>{
            remove(ref(db, 'friends/'+item.id))
          })
        
      }else if(userInfo.uid == item.whoreceiveid){
         set(push(ref(db, 'block')), {
            id:item.id,
            blockby:userInfo.displayName,
            blockbyid:userInfo.uid,
            block:item.whosendname,
            blockid:item.whosendid,
          }).then(()=>{
            remove(ref(db, 'friends/'+item.id))
          })
      }
   }

   let handlesignleMsgInfo=(item)=>{
      console.log(item);
      if(userInfo.uid == item.whoreceiveid){
         dispatch(chatUserInfo({name:item.whosendname , id:item.whosendid}))
      }else {
         dispatch(chatUserInfo({name:item.whoreceivename , id:item.whoreceiveid}))
      }
      // dispatch(chatUserInfo(item))
   }
  return (
    <div className='box'>
    <h2>Friends</h2>
    {friendList.map((item)=>(
    <div onClick={()=>handlesignleMsgInfo(item)} className='list'>
       <img src={profileimg}/>
       
       {userInfo.uid == item.whosendid
       ? 
       <h3>{item.whoreceivename}</h3>
       :
       <h3>{item.whosendname}</h3>
      }
       <Button onClick={()=>handleBlock(item)} variant="contained">Block</Button>
    </div>

    ))}
  
   </div>
  )
}

export default Firends
