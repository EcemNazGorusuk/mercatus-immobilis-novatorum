import {configureStore} from '@reduxjs/toolkit';
import userSlice from './user/userSlice';

// REDUX PERSIST  (just client) for using lots of reducers
// npm install redux-persist
import { persistReducer, persistStore } from 'redux-persist';
import {combineReducers} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { version } from 'react';

const rootReducer=combineReducers({user:userSlice})    //"user" name comes from userSlice's name parameter.
const persistConfig={key:'root',storage,version:1}
const persistedReducer =persistReducer(persistConfig,rootReducer);

//
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export const persistor=persistStore(store);
//use store & PersistGate & persistor in -> main.jsx