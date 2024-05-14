import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    currentUser:null,
    error:null,
    loading:false,
};

//use userSlice in store.js ->reducer
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        //first state
        signInStart: (state)=>{
           state.loading=true;
        },
         //second state
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        //third state
        signInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        }
    }
})

export const {signInStart,signInSuccess,signInFailure}=userSlice.actions;
export default userSlice.reducer;