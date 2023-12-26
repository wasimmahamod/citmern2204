import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { getAuth, signInWithEmailAndPassword,sendEmailVerification ,sendPasswordResetEmail  } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import regimg from "../assets/regimg.png";
import waiting from "../assets/waiting.gif";
import { useDispatch, useSelector } from 'react-redux';
import { logged } from '../slices/userSlices';


import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

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



const MyInput = styled(TextField) ({
    width: '90%',
    marginBottom: '20px'
});

const MyButton = styled(Button)({
  backgroundColor: '#5F35F5',
  width: "90%",
  padding: "20px 0",
  borderRadius: "86px"
});


const Login = () => {
    let [resetEmail,setResetEmail] = useState("")
    let userData =useSelector((state)=>state.activeUser.value)
    const auth = getAuth();
    let navigate = useNavigate()
    let dispatch = useDispatch()
    let [regdata,setRegdata] = useState({ email:"", password:""})
    let [loader,setLoader] = useState(false)

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  

  

    let handleChange = (e)=>{
    
        setRegdata({...regdata,[e.target.name]:e.target.value})
    }

    let handleSubmit = ()=>{
        setLoader(true)
        signInWithEmailAndPassword(auth, regdata.email, regdata.password).then((userCredential) => {
             dispatch(logged(userCredential.user))
             localStorage.setItem("user",JSON.stringify(userCredential.user))
            // if(userCredential.user.emailVerified){
                setRegdata({
                    email:"",
                    password:""
                })
                navigate("/home")
                setLoader(false)
            // }else{
               
            //     toast("Please varify your email")
            //     setLoader(false)
            // }
           
          })
          .catch((error) => {
            const errorCode = error.code;
            console.log(errorCode)
            setLoader(false)
            if(errorCode.includes("login")){
                toast("Ki hack korte chaw,Sajib er biya")

            }
           
          });

        // if(regdata.email == ""){
        //     toast.error("Please give an email")
         
        // }else{
        //     let pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        //     console.log(pattern.test(regdata.email))
        //     if(!pattern.test(regdata.email)){
        //         toast.error("Please give an valid email")
        //     }
        // }
        // if(regdata.fullname == ""){
        //     toast.error("Please give an fullname")
           
        // }
        // if(regdata.password == ""){
        //     toast.error("Please give an password")
           
        // }
        // else{
        //     let lowercase = /(?=.*[a-z])/
        //     let capital = /(?=.*[A-Z])/
        //     let number = /(?=.*[0-9])/
        //     let symbol = /(?=.*[!@#$%^&*])/
        //     let length = /(?=.{8,})/
        //     if(!lowercase.test(regdata.password)){
        //         toast.error("Please add lowercase")
        //     }
        //     if(!capital.test(regdata.password)){
        //         toast.error("Please add capital")
        //     }
        //     if(!number.test(regdata.password)){
        //         toast.error("Please add number")
        //     }
        //     if(!symbol.test(regdata.password)){
        //         toast.error("Please add symbol")
        //     }
        //     if(!length.test(regdata.password)){
        //         toast.error("Password must be minimum 8character")
        //     }
        // }


    }

    const handleReset = ()=>{
      sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
          setResetEmail("")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }

    useEffect(()=>{
      if(userData != null){
        navigate("/home") 
      }
    },[])
  return (
    <>
      <Grid container >
          {loader
          ?
          <img style={{width:"100%",height:"100vh"}} src={waiting}/>
          :
          <>
            <Grid item xs={6}>
              <div className='regbox'>
                <h1>Get started with easily register</h1>
                <p>Free register and you can enjoy it</p>
                
                <div>
                  <MyInput onChange={handleChange} name='email' id="outlined-basic" label="Email Address" variant="outlined" value={regdata.email}/>
                </div>
              
                <div>
                  <MyInput type='password' onChange={handleChange} name='password' id="outlined-basic" label="Password" variant="outlined" value={regdata.password}/>
                </div>
                
                {loader
                ?
                  <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="96"
                  visible={true}
                  />
                  :    
                  <MyButton onClick={handleSubmit} variant="contained">Sign In</MyButton>
            }
              </div>
              <div style={{width:"1000px", margin:"10px auto" ,textAlign:"center"}}>
                <p onClick={handleOpen} style={{marginBottom:"8px" ,color:"blue" ,cursor:"pointer"}}>Forgot Password</p>
                <p>Already have an account ? <Link to="/"> <span style={{color:"orange", cursor:"pointer"}}>Sign Up</span></Link></p>
              </div>
      

            </Grid>
            
            <Grid item xs={6}>
              <img  className='regimg' src={regimg}/>
            </Grid>
          </>
          }
      
    
      
      </Grid>
    
     <Modal
       aria-labelledby="transition-modal-title"
       aria-describedby="transition-modal-description"
       open={open}
       onClose={handleClose}
       closeAfterTransition
       slots={{ backdrop: Backdrop }}
       slotProps={{
         backdrop: {
           timeout: 500,
         },
       }}
     >
       <Fade in={open}>
         <Box sx={style}>
           <h2 style={{textAlign:"center"}}>Forgot Password</h2>
           <MyInput onChange={(e)=>{setResetEmail(e.target.value)}} value={resetEmail} style={{width:"380px",margin:"20px auto"}} type='email' name='Email' label="Email" variant="outlined"/>
           <div style={{display:'flex',justifyContent:"center"}}>
            <Button onClick={handleReset} variant="contained">Reset </Button>

           </div>
         </Box>
       </Fade>
     </Modal>
  
    </>
  )
}

export default Login