//A slice is a collection of: state, reducers, actions
//Reducers are pure functions that take the current state and an action, and return a new state
//(state, action) => newState

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: {
        userType: null,
        email: null,
        fullName: null,
    },
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      signInStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      signInSuccess: (state, action) => {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
        state.loading = false;
        state.error = null;
      },
      signInFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      updateStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      updateSuccess: (state, action) => {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
        state.loading = false;
        state.error = null;
      },
      updateFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      deleteUserStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      deleteUserSuccess: (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
      },
      deleteUserFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      signoutSuccess: (state) => {
        state.currentUser = null;
        state.error = null;
        state.loading = false;
      },
      // New action to update userType
      updateUserType: (state, action) => {
        state.currentUser.userType = action.payload;
      },
    },
  });
  
  export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
    updateUserType, // Export the new action
  } = userSlice.actions;
  
  export default userSlice.reducer;
  