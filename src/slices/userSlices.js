import { createSlice } from '@reduxjs/toolkit'

export const userSlices = createSlice({
  name: 'user',
  initialState: {
    value: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  },
  reducers: {
    logged: (state,action) => {
       state.value = action.payload
    },
 
  },
})


export const { logged } = userSlices.actions

export default userSlices.reducer