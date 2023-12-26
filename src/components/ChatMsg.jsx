import React from 'react'
import ChatImg from '../../src/assets/profile.png'
import MsgImg from '../../src/assets/regimg.png'
import ModalImage from "react-modal-image";
import { Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

const ChatMsg = () => {
    const chatInfo = useSelector((state)=>state.activeChat.chatInfo)
    console.log(chatInfo)
    return (
        <div>
            <div className='chatMsgTop'>
                <img src={ChatImg} alt="" />
                <h3>{chatInfo.name} </h3>
            </div>
            <div className="chatMain">
                {/* recive msg  */}
                <div className='msgBox'>
                    <h1>hey... </h1>
                </div>
                {/* recive msg  end*/}
                {/* recive img  */}
                <div className='msgBox'>
                    <ModalImage className='msgImg'
                        small={MsgImg}
                        large={MsgImg}

                    />
                </div>
                {/* recive img  end*/}
                {/* send msg  */}
                <div className='msgBox sendMsgBox'>
                    <h1>hey... </h1>
                </div>
                {/* send msg  end*/}
                {/* recive img  */}
                <div className='msgBox  sendMsgBox'>
                    <ModalImage className='msgImg'
                        small={MsgImg}
                        large={MsgImg}

                    />
                </div>
                {/* recive img  end*/}
                {/* recive audio  */}
                <div className='msgBox'>
                    <audio src='' controls>

                    </audio>

                </div>
                {/* recive audio  end*/}
                {/* send audio  */}
                <div className='msgBox sendMsgBox'>
                    <audio src='' controls>

                    </audio>

                </div>
                {/* send audio  end*/}
            </div>
            <hr />
            <div className='msgSubmitBox'>
               
            <TextField className='msgInput'  id="outlined-basic"  variant="outlined" />
            <Button className='submitBtn' variant="contained">Send</Button>
            </div>

        </div>
    )
}

export default ChatMsg
