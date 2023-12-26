import React, { useEffect, useState } from 'react'
import profileimg from "../assets/profile.png"
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue,remove,set,push } from "firebase/database";
const Block = () => {
   const db = getDatabase();
   let userInfo = useSelector((state)=>state.activeUser.value)
   let [blockList,setBlockList]=useState([])

   useEffect(()=>{
      const blockRef = ref(db, 'block');
      onValue(blockRef, (snapshot) => {
         let arr = []
         snapshot.forEach(item=>{
           if(userInfo.uid== item.val().blockbyid){
            arr.push({
               id: item.key,
               block: item.val().block,
               blockid: item.val().blockid
            })
           }else if(userInfo.uid == item.val().blockid){
            arr.push({
               id:item.key,
               blockby: item.val().blockby,
               blockbyid: item.val().blockbyid

            })
           }
             

        
         })
         setBlockList(arr)
      });
   },[])
  return (
    <div className='box'>
    <h2>Blocked Users</h2>
    {blockList.map((item)=>(
    <div className='list'>
       <img src={profileimg}/>
       <h3>{item.block}</h3>
       <h3>{item.blockby}</h3>
       {item.blockid &&
       <Button variant="contained">Unblock</Button>
       
       }
    </div>

    ))}
   </div>
  )
}

export default Block
