//Redux is state management library that is used to manage the global state of an app
//Redux centralizes the application's state in a single store
//Reducers are pure function that describe how the state should change in response to an action
//Middleware in Redux is a function that sits between the dispatching of an action and the reduction of that action into a state change

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
//Library saves and restores Redux state automatically across sessions
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: 'root', //local storage
  storage,
  version: 1, //manage migrations
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);