import { createSlice } from '@reduxjs/toolkit'

export const chatSlices = createSlice({
  name: 'chat',
  initialState: {
    chatInfo: 'Mern 2204'
  },
  reducers: {
    chatUserInfo: (state,action) => {
       state.chatInfo = action.payload
    },
 
  },
})


export const { chatUserInfo } = chatSlices.actions

export default chatSlices.reducer