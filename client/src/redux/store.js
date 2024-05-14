import {configureStore} from '@reduxjs/toolkit';
import userSlice from './user/userSlice';

export const store= configureStore({
    //"user" name comes from userSlice's name parameter.
    reducer:{user:userSlice},
    middleware:(getDefaultMiddleware) =>getDefaultMiddleware({
        serializableCheck:false,
    })
})

//use store in main.jsx