import { configureStore } from '@reduxjs/toolkit'
import userSlices from './slices/userSlices'
import chatSlice from './slices/chatSlice'

export default configureStore({
  reducer: {
    activeUser : userSlices,
    activeChat: chatSlice
  },
})