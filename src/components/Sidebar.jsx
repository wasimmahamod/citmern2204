import React, { useEffect,useState,useRef,createRef } from 'react'
import profileimg from "../assets/profile.png"
import { FaHome } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut,updateProfile } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { logged } from '../slices/userSlices';
import { IoIosLogOut } from "react-icons/io";
import { LuMessageSquare } from "react-icons/lu";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import { getStorage, ref,uploadString,getDownloadURL  } from "firebase/storage";
import { getDatabase, ref as dref, set } from "firebase/database";

const defaultSrc =
  "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const Sidebar = () => {
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  let navigate =useNavigate()
  let dispatch =useDispatch()

  let userInfo = useSelector((state)=>state.activeUser.value)
 
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef();


  let handleLogout =()=>{
    signOut(auth).then(() => {
      localStorage.removeItem("user")
      dispatch(logged(null))
      navigate("/login")
    }).catch((error) => {
      // An error happened.
    });
  }


  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const storageRef = ref(storage, userInfo.uid);
      uploadString(storageRef, cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'data_url').then((snapshot) => {
       
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log('File available at', downloadURL);
          updateProfile(auth.currentUser, {
             photoURL: downloadURL
          }).then(()=>{
            set(dref(db, 'users/' + userInfo.uid), {
              username: userInfo.displayName,
              email: userInfo.email,
              profile_picture : downloadURL
            }).then(()=>{
              console.log("user")
              localStorage.setItem("user",JSON.stringify({...userInfo,photoURL:downloadURL}))
              dispatch(logged({...userInfo,photoURL:downloadURL}))
              setImage("")
            })
           
          })
        });
      });
    }
  };


  
  return (
    <div className='sidebar'>
      <div onClick={handleOpen}>
      <h3>{userInfo.displayName}</h3>
      <img  src={userInfo.photoURL} className='sidebarimg'/>
      </div>
      <div className='icons'>
       
        <Link to="/home" className={window.location.pathname == "/home" ? "active" : ""}>
         <FaHome className='icon'/><br/>
        </Link>

        <Link to="/home/msg" className={window.location.pathname == "/home/msg" ? "active" : ""}>
          <LuMessageSquare className='icon'/><br/>
        </Link>

        <Link to="/home/notification" className={window.location.pathname == "/home/notification" ? "active" : ""}>
         <IoIosNotifications className='icon'/><br/>
        </Link>

        <Link to="/home/settings" className={window.location.pathname == "/home/settings" ? "active" : ""}>
         <CiSettings className='icon'/> <br />
        </Link>

        <IoIosLogOut onClick={handleLogout} className='icon logout'/>
      </div>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload Your Profile
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {image 
            ? 
            <div className='previewbox'>
          <div
            className="img-preview"
           
          ></div>
          </div>
            :
            <img  src={userInfo.photoURL} className='sidebarimg'/>
            }
          
          
            <input type="file" onChange={onChange}/>
            {image &&
              <Cropper
              ref={cropperRef}
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} 
              guides={true}
            />
            }

            {image &&

<>
<Button variant="contained"  onClick={getCropData}>Upload</Button>
<Button variant="contained" onClick={()=>setImage("")}>Cancel</Button>
</>

}
          </Typography>
        </Box>
      </Modal>
    </div>
  )
}

export default Sidebar
