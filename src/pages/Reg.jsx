import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithPopup,updateProfile  } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import regimg from "../assets/regimg.png";
import waiting from "../assets/waiting.gif";
import { getDatabase, ref, set } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';
import { logged } from '../slices/userSlices';

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


const Reg = () => {
  let userData =useSelector((state)=>state.activeUser.value)
  const provider = new GoogleAuthProvider();
  const db = getDatabase();
  let dispatch =useDispatch()
    const auth = getAuth();
    let navigate = useNavigate()
    let [regdata,setRegdata] = useState({
        email:"",
        fullname:"",
        password:""
    })
    let [loader,setLoader] = useState(false)

  

    let handleChange = (e)=>{
    
        setRegdata({...regdata,[e.target.name]:e.target.value})
    }

    let handleSubmit = ()=>{
        setLoader(true)
        createUserWithEmailAndPassword(auth, regdata.email, regdata.password).then((userCredential) => {
          updateProfile(auth.currentUser, {
            displayName: regdata.fullname, photoURL: "https://firebasestorage.googleapis.com/v0/b/binodon-c2d4f.appspot.com/o/flat-male-avatar-image-beard-hairstyle-businessman-profile-icon-vector-179285629.webp?alt=media&token=86a5b407-16df-4eae-8e36-c8565f673ff1"
          }).then(() => {
            sendEmailVerification(auth.currentUser)
                .then(() => {
                  set(ref(db, 'users/'+ userCredential.user.uid), {
                    username: regdata.fullname,
                    email: userCredential.user.email,
                    profile_picture : "https://firebasestorage.googleapis.com/v0/b/binodon-c2d4f.appspot.com/o/flat-male-avatar-image-beard-hairstyle-businessman-profile-icon-vector-179285629.webp?alt=media&token=86a5b407-16df-4eae-8e36-c8565f673ff1"
                  });
                    setRegdata({
                        email:"",
                        fullname:"",
                        password:""
                    })
                    navigate("/login")
                    setLoader(false)
                });
          })
           
            
          })
          .catch((error) => {
            const errorCode = error.code;
            setLoader(false)
            if(errorCode){
                if(errorCode.includes("email")){
                    toast("Email already in use")
    
                }
                if(errorCode.includes("password")){
                    toast("please give alteast 6 character")
                }
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

    let handleSignin = ()=>{
      signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        navigate("/home")
        console.log(user);
        dispatch(logged(user))
        localStorage.setItem("user",JSON.stringify(user))
      }).catch((error) => {
        
      });
    }


    useEffect(()=>{
      if(userData != null){
        navigate("/home") 
      }
    },[])

    


  return (
 
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
          <Button onClick={handleSignin}>Google Signin</Button>
          <div>
          <MyInput onChange={handleChange} name='email' id="outlined-basic" label="Email Address" variant="outlined" value={regdata.email}/>
        
          </div>
          <div>
          <MyInput type='text' onChange={handleChange}  name='fullname' id="outlined-basic" label="Fullname" variant="outlined" value={regdata.fullname}/>
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
          <MyButton onClick={handleSubmit} variant="contained">Sign Up</MyButton>
          
      }
    <div style={{width:"250px", margin:"10px auto" ,textAlign:"center"}}>
         <p>Don’t have an account ? <Link to="/login"> <span style={{color:"orange", cursor:"pointer"}}>Sign In</span></Link></p>
     </div>
        </div>
      </Grid>

        <Grid item xs={6}>
          <img  className='regimg' src={regimg}/>
        </Grid>
       
    </>
        }
      </Grid>

  )
}

export default Reg